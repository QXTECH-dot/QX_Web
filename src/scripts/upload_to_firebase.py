import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
import os
import uuid

def init_firebase():
    """初始化Firebase Admin SDK"""
    cred = credentials.Certificate('firebase-admin-key.json')
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    return firestore.client()

def format_description(description):
    if not description:
        return ""
    
    # 统一换行符为\n
    description = description.replace('\r\n', '\n').replace('\r', '\n')
    
    # 移除多余的空行
    description = '\n'.join(line.strip() for line in description.split('\n') if line.strip())
    
    # 在特定关键词后添加换行
    keywords = ['Services:', 'About:', 'Description:', 'Overview:']
    for keyword in keywords:
        description = description.replace(keyword, f'\n{keyword}')
    
    return description.strip()

def process_company_data(company_row):
    """处理公司数据，返回适合Firebase的格式"""
    # 获取原始描述文本，保持原始格式
    full_description = str(company_row.get('fullDescription', ''))
    
    # 确保换行符是统一的格式（使用\n）
    full_description = full_description.replace('\r\n', '\n').replace('\r', '\n')
    
    # 保持段落之间有两个换行符
    paragraphs = [p.strip() for p in full_description.split('\n') if p.strip()]
    formatted_description = '\n\n'.join(paragraphs)
    
    # 设置默认logo
    default_logo = "https://firebasestorage.googleapis.com/v0/b/qx-net.appspot.com/o/company-logos%2Fdefault-logo.png?alt=media"
    logo = str(company_row.get('logo', ''))
    if not logo or logo.strip() == '' or 'placeholder' in logo.lower():
        logo = default_logo
    
    return {
        'name': str(company_row['name_en']),
        'abn': str(company_row.get('abn', '')),
        'logo': logo,
        'shortDescription': str(company_row.get('shortDescription', '')),
        'fullDescription': formatted_description,
        'foundedYear': int(company_row.get('foundedYear', 0)) if pd.notna(company_row.get('foundedYear')) else None,
        'industry': str(company_row['industry']),
        'teamSize': str(company_row.get('teamSize', '')),
        'website': str(company_row.get('website', '')),
        'languages': str(company_row.get('languages', '')),
        'social': company_row.get('social', {}),
        'verified': bool(company_row.get('verified', False))
    }

def delete_all_data(db):
    """删除所有现有数据"""
    print("正在删除现有数据...")
    # 删除offices集合中的所有文档
    offices_ref = db.collection('offices')
    docs = offices_ref.stream()
    for doc in docs:
        doc.reference.delete()
    
    # 删除companies集合中的所有文档
    companies_ref = db.collection('companies')
    docs = companies_ref.stream()
    for doc in docs:
        doc.reference.delete()
    
    print("现有数据已删除！")

def upload_to_firebase(companies_file, offices_file):
    """上传Excel数据到Firebase"""
    # 初始化Firebase
    db = init_firebase()
    
    # 先删除现有数据
    delete_all_data(db)
    
    # 读取Excel文件
    companies_df = pd.read_excel(companies_file)
    offices_df = pd.read_excel(offices_file)
    
    # 上传公司数据
    print("开始上传公司数据...")
    companies_collection = db.collection('companies')
    
    for _, row in companies_df.iterrows():
        company_data = process_company_data(row)
        company_id = row['companyId']  # 使用Excel中的companyId
        companies_collection.document(company_id).set(company_data)
        print(f"已上传公司: {company_data['name']}")
        
        # 上传该公司的办公室数据
        offices_collection = db.collection('offices')
        company_offices = offices_df[offices_df['companyId'] == company_id]
        
        # 为每个公司的每个城市维护单独的计数器
        office_counters = {}
        
        # 按州分组并排序办公室数据
        sorted_offices = company_offices.sort_values(['state', 'city'])
        
        for _, office_row in sorted_offices.iterrows():
            state = str(office_row['state']) if pd.notna(office_row['state']) else 'Unknown'
            
            # 城市名称标准化
            city = str(office_row['city']).upper() if pd.notna(office_row['city']) else 'UNKNOWN'
            # 将州名转换为对应的城市名
            city_mapping = {
                'ACT': 'CANBERRA',
                'NSW': 'SYDNEY',
                'VIC': 'MELBOURNE',
                'QLD': 'BRISBANE',
                'WA': 'PERTH',
                'SA': 'ADELAIDE',
                'TAS': 'HOBART',
                'NT': 'DARWIN'
            }
            if city in city_mapping:
                city = city_mapping[city]
            
            # 为每个公司的每个城市维护单独的计数器
            counter_key = f"{company_id}_{city}"
            if counter_key not in office_counters:
                office_counters[counter_key] = 1
            else:
                office_counters[counter_key] += 1
            
            # 生成序号（两位数，前导零）
            sequence = str(office_counters[counter_key]).zfill(2)
            
            # 生成新的office_id
            office_id = f"{company_id}_{city}_{sequence}"
            
            # 更新office数据
            office_data = {
                'officeId': office_id,
                'companyId': company_id,
                'city': str(office_row['city']) if pd.notna(office_row['city']) else '',
                'state': state,
                'address': str(office_row.get('address', '')) if pd.notna(office_row.get('address')) else '',
                'postalCode': str(office_row.get('postalCode', '')) if pd.notna(office_row.get('postalCode')) else '',
                'phone': str(office_row.get('phone', '')) if pd.notna(office_row.get('phone')) else '',
                'isHeadquarter': bool(office_row.get('isHeadquarter', False))
            }
            
            offices_collection.document(office_id).set(office_data)
            print(f"已上传办公室: {office_data['state']} - {company_data['name']} ({sequence})")
    
    print("数据上传完成！")

if __name__ == "__main__":
    companies_file = "companies_20250413_142249.xlsx"
    offices_file = "offices_20250413_142249.xlsx"
    
    if not os.path.exists(companies_file) or not os.path.exists(offices_file):
        print("错误：找不到Excel文件！")
        exit(1)
    
    upload_to_firebase(companies_file, offices_file) 