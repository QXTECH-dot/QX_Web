import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import os

def initialize_firebase():
    """初始化Firebase连接"""
    try:
        firebase_admin.get_app()
    except ValueError:
        cred = credentials.Certificate('QX Net company data/qx-net-next-js-firebase-adminsdk-fbsvc-2cc9fc9468.json')
        firebase_admin.initialize_app(cred)
    return firestore.client()

def import_companies():
    """从CSV文件导入数据到companies表"""
    try:
        # 初始化Firebase
        db = initialize_firebase()
        
        # 读取最新的CSV文件
        csv_dir = 'QX Net company data'
        csv_files = [f for f in os.listdir(csv_dir) if f.startswith('companies_export_') and f.endswith('.csv')]
        if not csv_files:
            print('未找到companies导出文件')
            return
            
        latest_csv = max(csv_files)  # 获取最新的文件
        csv_path = os.path.join(csv_dir, latest_csv)
        
        # 读取CSV文件，尝试不同的编码
        try:
            df = pd.read_csv(csv_path, encoding='utf-8')
        except UnicodeDecodeError:
            try:
                df = pd.read_csv(csv_path, encoding='gbk')
            except UnicodeDecodeError:
                df = pd.read_csv(csv_path, encoding='latin1')
        
        # 获取companies集合的引用
        companies_ref = db.collection('companies')
        
        # 计数器
        updated_count = 0
        error_count = 0
        
        # 遍历DataFrame的每一行
        for _, row in df.iterrows():
            try:
                # 将行数据转换为字典
                company_data = row.to_dict()
                
                # 获取company_id
                company_id = company_data.pop('id', None)
                if not company_id:
                    print(f'警告: 跳过没有ID的记录')
                    error_count += 1
                    continue
                
                # 更新文档
                companies_ref.document(company_id).set(company_data)
                updated_count += 1
                
                if updated_count % 100 == 0:  # 每100条记录打印一次进度
                    print(f'已更新 {updated_count} 条记录...')
                    
            except Exception as e:
                print(f'更新记录时出错: {str(e)}')
                error_count += 1
        
        print(f'\n导入完成!')
        print(f'成功更新: {updated_count} 条记录')
        print(f'失败记录: {error_count} 条')
        
    except Exception as e:
        print(f'导入过程中发生错误: {str(e)}')

if __name__ == '__main__':
    import_companies() 