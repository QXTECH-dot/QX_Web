import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import os
import json
from datetime import datetime

# 直接指定服务账号json文件路径
SERVICE_ACCOUNT_PATH = 'firebase-admin-key.json'

# 初始化Firebase
cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

def clean_field(value, is_array_field=False):
    """
    清洗字段数据
    """
    if pd.isna(value) or value == '' or value == 'nan':
        return None
    
    if isinstance(value, str):
        # 清理字符串
        cleaned = value.strip()
        if cleaned.lower() in ['nan', 'null', 'none', '']:
            return None
        
        # 只有明确指定为数组字段时才分割
        if is_array_field and ',' in cleaned and not cleaned.startswith('http'):
            return [item.strip() for item in cleaned.split(',') if item.strip()]
        
        return cleaned
    
    return value

def process_company_data(row):
    """
    处理单个公司数据行，转换为Firebase格式
    """
    company_data = {}
    
    # 基础字段映射
    field_mapping = {
        'abn': 'abn',
        'name_en': 'name_en',
        'name_cn': 'name_cn', 
        'name': 'name',
        'description': 'description',
        'shortDescription': 'shortDescription',
        'fullDescription': 'fullDescription',
        'logo': 'logo',
        'website': 'website',
        'email': 'email',
        'phone': 'phone',
        'location': 'location',
        'foundedYear': 'foundedYear',
        'teamSize': 'teamSize',
        'rating': 'rating',
        'verified': 'verified',
        'slug': 'slug',  # 新增的slug字段
        'source': 'source',
        'status': 'status'
    }
    
    # 处理基础字段（非数组字段）
    for csv_field, firebase_field in field_mapping.items():
        if csv_field in row:
            value = clean_field(row[csv_field], is_array_field=False)
            if value is not None:
                company_data[firebase_field] = value
    
    # 处理数组字段
    array_fields = ['industry', 'industries', 'languages', 'services']
    for field in array_fields:
        if field in row:
            value = clean_field(row[field], is_array_field=True)
            if value is not None:
                if isinstance(value, list):
                    company_data[field] = value
                elif isinstance(value, str):
                    # 将逗号分隔的字符串转换为数组
                    company_data[field] = [item.strip() for item in value.split(',') if item.strip()]
    
    # 处理特殊字段
    if 'foundedYear' in company_data:
        try:
            company_data['foundedYear'] = int(float(company_data['foundedYear']))
        except (ValueError, TypeError):
            company_data['foundedYear'] = None
    
    if 'rating' in company_data:
        try:
            company_data['rating'] = float(company_data['rating'])
        except (ValueError, TypeError):
            company_data['rating'] = 0.0
    
    if 'verified' in company_data:
        if isinstance(company_data['verified'], str):
            company_data['verified'] = company_data['verified'].lower() in ['true', '1', 'yes']
        else:
            company_data['verified'] = bool(company_data['verified'])
    
    # 添加时间戳
    company_data['updatedAt'] = firestore.SERVER_TIMESTAMP
    if 'createdAt' not in company_data or not company_data['createdAt']:
        company_data['createdAt'] = firestore.SERVER_TIMESTAMP
    
    return company_data

def import_companies_to_firebase(csv_file=None, batch_size=500):
    """
    将CSV文件中的公司数据导入到Firebase
    """
    try:
        # 设置默认CSV文件路径
        if csv_file is None:
            desktop = os.path.expanduser('~/Desktop')
            csv_file = os.path.join(desktop, 'QX Web数据库', 'companies_with_slug_20250710_150306.csv')
        
        # 检查文件是否存在
        if not os.path.exists(csv_file):
            print(f"错误: 找不到CSV文件 {csv_file}")
            return
        
        print(f"正在读取CSV文件: {csv_file}")
        
        # 尝试不同编码读取CSV
        encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
        df = None
        
        for encoding in encodings:
            try:
                df = pd.read_csv(csv_file, encoding=encoding)
                print(f"成功使用 {encoding} 编码读取文件")
                break
            except UnicodeDecodeError:
                continue
        
        if df is None:
            print("错误: 无法读取CSV文件")
            return
        
        print(f"找到 {len(df)} 条公司记录")
        
        # 获取Firebase中的companies集合
        companies_ref = db.collection('companies')
        
        # 批量处理数据
        batch = db.batch()
        batch_count = 0
        processed_count = 0
        success_count = 0
        error_count = 0
        
        print("开始上传数据到Firebase...")
        
        for index, row in df.iterrows():
            try:
                # 获取文档ID
                doc_id = row.get('document_id')
                if pd.isna(doc_id) or not doc_id:
                    # 如果没有document_id，跳过这条记录
                    print(f"跳过第 {index + 1} 条记录: 缺少document_id")
                    continue
                
                # 处理公司数据
                company_data = process_company_data(row)
                
                # 添加到批次
                doc_ref = companies_ref.document(str(doc_id))
                batch.set(doc_ref, company_data, merge=True)
                
                batch_count += 1
                processed_count += 1
                
                # 当批次达到指定大小时提交
                if batch_count >= batch_size:
                    batch.commit()
                    success_count += batch_count
                    print(f"已上传 {success_count} 条记录...")
                    
                    # 重置批次
                    batch = db.batch()
                    batch_count = 0
                
                # 显示进度
                if processed_count % 100 == 0:
                    print(f"已处理 {processed_count}/{len(df)} 条记录")
                    
            except Exception as e:
                error_count += 1
                print(f"处理第 {index + 1} 条记录时出错: {e}")
                continue
        
        # 提交剩余的批次
        if batch_count > 0:
            batch.commit()
            success_count += batch_count
            print(f"已上传最后 {batch_count} 条记录")
        
        print(f"\n=== 导入完成 ===")
        print(f"总记录数: {len(df)}")
        print(f"处理成功: {success_count}")
        print(f"处理失败: {error_count}")
        print(f"跳过记录: {len(df) - processed_count}")
        
        # 验证导入结果
        print("\n正在验证导入结果...")
        companies_snapshot = companies_ref.get()
        total_companies = len(companies_snapshot)
        print(f"Firebase中现有公司总数: {total_companies}")
        
        # 检查slug字段
        companies_with_slug = 0
        for doc in companies_snapshot:
            if 'slug' in doc.to_dict():
                companies_with_slug += 1
        
        print(f"包含slug字段的公司数量: {companies_with_slug}")
        
    except Exception as e:
        print(f"导入过程中出错: {str(e)}")
        import traceback
        traceback.print_exc()

def main():
    """
    主函数
    """
    print("=== Firebase公司数据导入器 ===")
    print("此脚本将CSV文件中的公司数据（包含slug）导入到Firebase")
    print()
    
    # 询问用户是否继续
    response = input("确定要导入数据吗？这将更新Firebase中的公司数据。(y/n): ")
    if response.lower() != 'y':
        print("取消导入")
        return
    
    # 开始导入
    import_companies_to_firebase()

if __name__ == '__main__':
    main() 