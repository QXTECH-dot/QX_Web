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
    清洗字段数据 - 修复版本
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
    处理单个公司数据行，转换为Firebase格式 - 修复版本
    """
    company_data = {}
    
    # 基础字段映射（这些字段不应该被分割为数组）
    string_fields = {
        'abn': 'abn',
        'companyId': 'companyId',  # 添加缺失的companyId字段
        'name_en': 'name_en',
        'name_cn': 'name_cn', 
        'name': 'name',
        'trading name': 'trading_name',  # 添加trading name字段
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
        'slug': 'slug',
        'source': 'source',
        'status': 'status',
        'industry_1': 'industry_1',  # 添加行业字段
        'industry_2': 'industry_2',
        'industry_3': 'industry_3'
    }
    
    # 处理字符串字段（不分割）
    for csv_field, firebase_field in string_fields.items():
        if csv_field in row:
            value = clean_field(row[csv_field], is_array_field=False)
            if value is not None:
                company_data[firebase_field] = value
    
    # 处理数组字段（需要分割）
    array_fields = ['industries', 'languages', 'services']
    for field in array_fields:
        if field in row:
            value = clean_field(row[field], is_array_field=True)
            if value is not None:
                if isinstance(value, list):
                    company_data[field] = value
                elif isinstance(value, str):
                    # 将逗号分隔的字符串转换为数组
                    company_data[field] = [item.strip() for item in value.split(',') if item.strip()]
    
    # 特殊处理：将industry_1, industry_2, industry_3合并成industry数组
    industries = []
    for i in range(1, 4):
        industry_field = f'industry_{i}'
        if industry_field in company_data and company_data[industry_field]:
            industries.append(company_data[industry_field])
    
    if industries:
        company_data['industry'] = industries
        # 为了兼容性，也保留单独的字段
        # company_data['industry_1'], company_data['industry_2'], company_data['industry_3'] 已经设置
    
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

def clear_existing_data():
    """
    清空现有的companies集合数据
    """
    print("正在清空现有数据...")
    companies_ref = db.collection('companies')
    
    # 分批删除文档
    batch_size = 500
    docs = companies_ref.limit(batch_size).stream()
    deleted = 0
    
    while True:
        batch = db.batch()
        docs_to_delete = []
        
        for doc in docs:
            docs_to_delete.append(doc)
            if len(docs_to_delete) >= batch_size:
                break
        
        if not docs_to_delete:
            break
        
        for doc in docs_to_delete:
            batch.delete(doc.reference)
        
        batch.commit()
        deleted += len(docs_to_delete)
        print(f"已删除 {deleted} 条记录...")
        
        # 获取下一批
        docs = companies_ref.limit(batch_size).stream()
    
    print(f"清空完成，共删除 {deleted} 条记录")

def import_companies_to_firebase(csv_file=None, batch_size=500, clear_data=False):
    """
    将CSV文件中的公司数据导入到Firebase - 修复版本
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
        
        # 如果需要清空现有数据
        if clear_data:
            clear_existing_data()
        
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
                batch.set(doc_ref, company_data)  # 使用set而不是merge，完全替换
                
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
        companies_with_description = 0
        
        for doc in companies_snapshot:
            doc_data = doc.to_dict()
            if 'slug' in doc_data:
                companies_with_slug += 1
            if 'fullDescription' in doc_data and doc_data['fullDescription']:
                companies_with_description += 1
        
        print(f"包含slug字段的公司数量: {companies_with_slug}")
        print(f"包含fullDescription的公司数量: {companies_with_description}")
        
        # 检查是否有被错误分割的description
        print("\n检查description字段格式...")
        problematic_docs = 0
        for doc in companies_snapshot:
            doc_data = doc.to_dict()
            if 'fullDescription' in doc_data and isinstance(doc_data['fullDescription'], list):
                problematic_docs += 1
                if problematic_docs <= 3:  # 只显示前3个示例
                    print(f"发现问题文档 {doc.id}: fullDescription是数组格式")
        
        if problematic_docs == 0:
            print("✅ 所有description字段格式正确")
        else:
            print(f"❌ 发现 {problematic_docs} 个文档的description字段被错误分割")
        
    except Exception as e:
        print(f"导入过程中出错: {str(e)}")
        import traceback
        traceback.print_exc()

def main():
    """
    主函数
    """
    print("=== Firebase公司数据修复导入器 ===")
    print("此脚本将修复description字段被错误分割的问题")
    print()
    
    # 询问是否清空现有数据
    clear_response = input("是否清空现有数据重新导入？(y/n): ")
    clear_data = clear_response.lower() == 'y'
    
    if clear_data:
        print("⚠️  警告：这将删除所有现有的公司数据！")
        confirm = input("确定要继续吗？(y/n): ")
        if confirm.lower() != 'y':
            print("取消操作")
            return
    
    # 询问用户是否继续
    response = input("确定要开始导入数据吗？(y/n): ")
    if response.lower() != 'y':
        print("取消导入")
        return
    
    # 开始导入
    import_companies_to_firebase(clear_data=clear_data)

if __name__ == '__main__':
    main() 