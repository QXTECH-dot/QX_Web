import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import os
from datetime import datetime

def initialize_firebase():
    """初始化Firebase连接"""
    try:
        firebase_admin.get_app()
    except ValueError:
        cred = credentials.Certificate('QX Net company data/qx-net-next-js-firebase-adminsdk-fbsvc-2cc9fc9468.json')
        firebase_admin.initialize_app(cred)
    return firestore.client()

def export_companies():
    """导出companies表数据到CSV文件"""
    try:
        # 初始化Firebase
        db = initialize_firebase()
        
        # 获取companies集合的所有文档
        companies_ref = db.collection('companies')
        companies = companies_ref.stream()
        
        # 将数据转换为列表
        companies_data = []
        for company in companies:
            company_dict = company.to_dict()
            company_dict['id'] = company.id  # 添加文档ID
            companies_data.append(company_dict)
        
        # 创建DataFrame
        df = pd.DataFrame(companies_data)
        
        # 确保输出目录存在
        output_dir = 'QX Net company data'
        os.makedirs(output_dir, exist_ok=True)
        
        # 生成带时间戳的文件名
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = os.path.join(output_dir, f'companies_export_{timestamp}.csv')
        
        # 保存为CSV
        df.to_csv(output_file, index=False, encoding='utf-8')
        print(f'数据已成功导出到: {output_file}')
        
        # 打印数据统计
        print(f'总共导出了 {len(companies_data)} 条记录')
        
    except Exception as e:
        print(f'导出过程中发生错误: {str(e)}')

if __name__ == '__main__':
    export_companies() 