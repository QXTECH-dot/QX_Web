import pandas as pd
import re
from typing import Dict, List, Tuple, Set
import os
import sys
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore

# 行业映射
INDUSTRY_MAPPING = {
    # 农林渔业
    'agriculture': 'Agriculture, Forestry and Fishing',
    'farming': 'Agriculture, Forestry and Fishing',
    'forestry': 'Agriculture, Forestry and Fishing',
    'fishing': 'Agriculture, Forestry and Fishing',
    'farm': 'Agriculture, Forestry and Fishing',
    
    # 采矿业
    'mining': 'Mining',
    'mine': 'Mining',
    'minerals': 'Mining',
    'resources': 'Mining',
    
    # 制造业
    'manufacturing': 'Manufacturing',
    'factory': 'Manufacturing',
    'production': 'Manufacturing',
    'industrial': 'Manufacturing',
    
    # 电力、燃气、水和废物服务
    'utilities': 'Electricity, Gas, Water and Waste Services',
    'electricity': 'Electricity, Gas, Water and Waste Services',
    'power': 'Electricity, Gas, Water and Waste Services',
    'water': 'Electricity, Gas, Water and Waste Services',
    'waste': 'Electricity, Gas, Water and Waste Services',
    'energy': 'Electricity, Gas, Water and Waste Services',
    
    # 建筑业
    'construction': 'Construction',
    'building': 'Construction',
    'builder': 'Construction',
    'contractor': 'Construction',
    'development': 'Construction',
    
    # 批发贸易
    'wholesale': 'Wholesale Trade',
    'distribution': 'Wholesale Trade',
    'wholesaler': 'Wholesale Trade',
    'supply': 'Wholesale Trade',
    
    # 零售贸易
    'retail': 'Retail Trade',
    'shop': 'Retail Trade',
    'store': 'Retail Trade',
    'ecommerce': 'Retail Trade',
    
    # 住宿和餐饮服务
    'hospitality': 'Accommodation and Food Services',
    'hotel': 'Accommodation and Food Services',
    'restaurant': 'Accommodation and Food Services',
    'catering': 'Accommodation and Food Services',
    'food': 'Accommodation and Food Services',
    'accommodation': 'Accommodation and Food Services',
    
    # 运输、邮政和仓储
    'transport': 'Transport, Postal and Warehousing',
    'logistics': 'Transport, Postal and Warehousing',
    'shipping': 'Transport, Postal and Warehousing',
    'postal': 'Transport, Postal and Warehousing',
    'warehousing': 'Transport, Postal and Warehousing',
    'freight': 'Transport, Postal and Warehousing',
    
    # 信息媒体和电信
    'media': 'Information Media and Telecommunications',
    'telecommunications': 'Information Media and Telecommunications',
    'telecom': 'Information Media and Telecommunications',
    'it': 'Information Media and Telecommunications',
    'technology': 'Information Media and Telecommunications',
    'software': 'Information Media and Telecommunications',
    'digital': 'Information Media and Telecommunications',
    
    # 金融和保险服务
    'finance': 'Financial and Insurance Services',
    'banking': 'Financial and Insurance Services',
    'insurance': 'Financial and Insurance Services',
    'investment': 'Financial and Insurance Services',
    'financial': 'Financial and Insurance Services',
    'mortgage': 'Financial and Insurance Services',
    
    # 租赁、招聘和房地产服务
    'realestate': 'Rental, Hiring and Real Estate Services',
    'property': 'Rental, Hiring and Real Estate Services',
    'rental': 'Rental, Hiring and Real Estate Services',
    'leasing': 'Rental, Hiring and Real Estate Services',
    'hiring': 'Rental, Hiring and Real Estate Services',
    'estate': 'Rental, Hiring and Real Estate Services',
    
    # 专业、科学和技术服务
    'professional': 'Professional, Scientific and Technical Services',
    'scientific': 'Professional, Scientific and Technical Services',
    'technical': 'Professional, Scientific and Technical Services',
    'consulting': 'Professional, Scientific and Technical Services',
    'research': 'Professional, Scientific and Technical Services',
    'engineering': 'Professional, Scientific and Technical Services',
    'legal': 'Professional, Scientific and Technical Services',
    'accounting': 'Professional, Scientific and Technical Services',
    
    # 行政和支持服务
    'administrative': 'Administrative and Support Services',
    'admin': 'Administrative and Support Services',
    'support': 'Administrative and Support Services',
    'business services': 'Administrative and Support Services',
    'office': 'Administrative and Support Services',
    
    # 公共行政和安全
    'government': 'Public Administration and Safety',
    'public': 'Public Administration and Safety',
    'administration': 'Public Administration and Safety',
    'safety': 'Public Administration and Safety',
    'security': 'Public Administration and Safety',
    'defense': 'Public Administration and Safety',
    
    # 教育和培训
    'education': 'Education and Training',
    'training': 'Education and Training',
    'school': 'Education and Training',
    'university': 'Education and Training',
    'college': 'Education and Training',
    'teaching': 'Education and Training',
    
    # 医疗保健和社会援助
    'health': 'Health Care and Social Assistance',
    'healthcare': 'Health Care and Social Assistance',
    'medical': 'Health Care and Social Assistance',
    'hospital': 'Health Care and Social Assistance',
    'social': 'Health Care and Social Assistance',
    'care': 'Health Care and Social Assistance',
    
    # 艺术和娱乐服务
    'arts': 'Arts and Recreation Services',
    'recreation': 'Arts and Recreation Services',
    'entertainment': 'Arts and Recreation Services',
    'sports': 'Arts and Recreation Services',
    'culture': 'Arts and Recreation Services',
    
    # 其他服务
    'other': 'Other Services',
    'services': 'Other Services',
    'miscellaneous': 'Other Services'
}

# 城市映射
CITY_MAPPING = {
    'Sydney': 'NSW',
    'Melbourne': 'VIC',
    'Brisbane': 'QLD',
    'Perth': 'WA',
    'Adelaide': 'SA',
    'Canberra': 'ACT',
    'Hobart': 'TAS',
    'Darwin': 'NT'
}

# 初始化 Firebase
cred = credentials.Certificate('firebase-admin-key.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

def clean_text(text):
    """清理文本数据"""
    if pd.isna(text):
        return ''
    return str(text).strip()

def extract_company_name(full_name):
    """从完整公司名称中提取公司名称和办公室位置"""
    if pd.isna(full_name):
        return '', None
        
    # 标准化公司名称中的空格
    full_name = ' '.join(str(full_name).split())
    
    # 使用正则表达式匹配括号
    match = re.match(r'(.+?)\s*\(([^)]+)\)', full_name)
    if match:
        company_name = match.group(1).strip()
        office_location = match.group(2).strip()
        
        # 检查括号中的内容是否为地区名称
        location_keywords = {'Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Adelaide', 
                           'Canberra', 'Hobart', 'Darwin', 'Gold Coast', 'Newcastle',
                           'NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT', 'TAS', 'NT'}
        
        # 如果括号中是地区名称，则直接返回公司名称
        if any(loc.lower() in office_location.lower() for loc in location_keywords):
            return company_name, office_location
            
        # 如果括号中不是地区名称，则保留括号作为公司名称的一部分
        return full_name, None
        
    return full_name, None

def generate_company_id(index):
    """生成公司ID"""
    return f'COMP_{str(index).zfill(5)}'

def generate_office_id(company_id, state, office_index):
    """生成办公室ID"""
    return f'{company_id}_{state}_{str(office_index).zfill(2)}'

def extract_company_info(row, company_index):
    """提取公司信息"""
    company_name, office_location = extract_company_name(clean_text(row['company_name_en']))
    
    # 处理行业 - 同时考虑主要行业和子行业
    main_industry = clean_text(row['industrial_en'])
    sub_industry = clean_text(row['sub_industrial_en'])
    
    # 尝试从主要行业映射
    industry = INDUSTRY_MAPPING.get(main_industry, None)
    
    # 如果主要行业映射失败，尝试从子行业映射
    if not industry and sub_industry:
        industry = INDUSTRY_MAPPING.get(sub_industry, 'Other')
    elif not industry:
        industry = 'Other'
    
    # 处理成立年份
    founded_year = None
    
    # 处理团队规模
    team_size = None
    
    # 处理语言
    languages = []
    
    return {
        'companyId': generate_company_id(company_index),
        'name_en': company_name,
        'name_cn': clean_text(row['company_name_cn']),
        'abn': clean_text(row['ABN']),
        'logo': clean_text(row['logo_url']),
        'industry': industry,
        'website': clean_text(row['Website']),
        'foundedYear': founded_year,
        'teamSize': team_size,
        'languages': languages,
        'shortDescription': clean_text(row['brief_intro_en']),
        'fullDescription': clean_text(row['intro_en']),
        'social': {},
        'verified': False
    }

def extract_office_info(row, company_id, office_index):
    """提取办公室信息"""
    company_name, office_location = extract_company_name(clean_text(row['company_name_en']))
    
    # 直接使用state_en中的州代码，如果为空则使用'OTH'
    state = clean_text(row['state_en'])
    if not state or state.lower() == 'other':
        state = 'OTH'
    
    return {
        'officeId': generate_office_id(company_id, state, office_index),
        'companyId': company_id,
        'state': state,
        'city': clean_text(row['state_en']),
        'address': clean_text(row['location']),
        'postalCode': '',
        'contactPerson': clean_text(row['contact_person']),
        'email': clean_text(row['email']),
        'phone': clean_text(row['phone_number']),
        'isHeadquarter': True  # 暂时默认所有办公室都是总部
    }

def process_company_data(input_file):
    """处理公司数据"""
    # 读取Excel文件
    df = pd.read_excel(input_file)
    
    # 初始化结果列表
    companies = []
    offices = []
    
    # 用于跟踪公司名称和ID的映射
    company_name_to_id = {}
    company_office_count = {}
    company_index = 1
    
    # 处理每一行数据
    for index, row in df.iterrows():
        company_name, _ = extract_company_name(clean_text(row['company_name_en']))
        
        # 如果是新公司，创建公司记录
        if company_name not in company_name_to_id:
            company_info = extract_company_info(row, company_index)
            company_id = company_info['companyId']
            company_name_to_id[company_name] = company_id
            company_office_count[company_name] = 1
            companies.append(company_info)
            company_index += 1
        else:
            company_id = company_name_to_id[company_name]
            company_office_count[company_name] += 1
        
        # 创建办公室记录
        office_info = extract_office_info(row, company_id, company_office_count[company_name])
        offices.append(office_info)
    
    # 创建DataFrame
    companies_df = pd.DataFrame(companies)
    offices_df = pd.DataFrame(offices)
    
    # 生成输出文件名
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    companies_output = f'companies_{timestamp}.xlsx'
    offices_output = f'offices_{timestamp}.xlsx'
    
    # 保存到Excel文件
    companies_df.to_excel(companies_output, index=False)
    offices_df.to_excel(offices_output, index=False)
    
    return companies_output, offices_output

def process_excel_data(file_path: str):
    """处理 Excel 文件中的所有表格数据"""
    print(f"开始处理 Excel 文件: {file_path}")
    
    # 读取所有表格
    excel_file = pd.ExcelFile(file_path)
    
    # 清空现有集合
    collections = ['companies', 'offices', 'services', 'history']
    for collection in collections:
        delete_collection(db.collection(collection))
    
    # 处理公司数据
    if 'Companies' in excel_file.sheet_names:
        companies_df = pd.read_excel(file_path, sheet_name='Companies')
        process_companies(companies_df)
    
    # 处理办公室数据
    if 'Offices' in excel_file.sheet_names:
        offices_df = pd.read_excel(file_path, sheet_name='Offices')
        process_offices(offices_df)
    
    # 处理服务数据
    if 'Services' in excel_file.sheet_names:
        services_df = pd.read_excel(file_path, sheet_name='Services')
        process_services(services_df)
    
    # 处理历史数据
    if 'History' in excel_file.sheet_names:
        history_df = pd.read_excel(file_path, sheet_name='History')
        process_history(history_df)

def delete_collection(collection_ref):
    """删除集合中的所有文档"""
    docs = collection_ref.limit(500).stream()
    deleted = 0
    
    for doc in docs:
        doc.reference.delete()
        deleted += 1
        
    if deleted >= 500:
        delete_collection(collection_ref)

def clean_data(value):
    """清理数据值"""
    if pd.isna(value):
        return None
    if isinstance(value, (int, float)):
        return value
    return str(value).strip()

def process_companies(df: pd.DataFrame):
    """处理公司数据"""
    print("处理公司数据...")
    companies_ref = db.collection('companies')
    
    for _, row in df.iterrows():
        company_data = {
            'name': clean_data(row.get('name')),
            'name_en': clean_data(row.get('name_en')),
            'name_cn': clean_data(row.get('name_cn')),
            'abn': clean_data(row.get('abn')),
            'logo': clean_data(row.get('logo')),
            'website': clean_data(row.get('website')),
            'email': clean_data(row.get('email')),
            'phone': clean_data(row.get('phone')),
            'foundedYear': clean_data(row.get('foundedYear')),
            'teamSize': clean_data(row.get('teamSize')),
            'industry': clean_data(row.get('industry')),
            'state': clean_data(row.get('state')),
            'shortDescription': clean_data(row.get('shortDescription')),
            'description': clean_data(row.get('description')),
            'verified': clean_data(row.get('verified')),
            'services': [],  # 服务将在后续处理
            'languages': clean_data(row.get('languages')),
        }
        
        # 使用 company_id 作为文档 ID
        company_id = clean_data(row.get('id'))
        if company_id:
            companies_ref.document(company_id).set(company_data)
            print(f"添加公司: {company_data['name_en']} (ID: {company_id})")

def process_offices(df: pd.DataFrame):
    """处理办公室数据"""
    print("处理办公室数据...")
    offices_ref = db.collection('offices')
    
    for _, row in df.iterrows():
        office_data = {
            'companyId': clean_data(row.get('companyId')),
            'officeId': clean_data(row.get('officeId')),
            'state': clean_data(row.get('state')),
            'city': clean_data(row.get('city')),
            'address': clean_data(row.get('address')),
            'postalCode': clean_data(row.get('postalCode')),
            'phone': clean_data(row.get('phone')),
            'isHeadquarter': bool(row.get('isHeadquarter')),
        }
        
        # 使用 officeId 作为文档 ID
        office_id = office_data['officeId']
        if office_id:
            offices_ref.document(office_id).set(office_data)
            print(f"添加办公室: {office_data['city']} (ID: {office_id})")

def process_services(df: pd.DataFrame):
    """处理服务数据"""
    print("处理服务数据...")
    services_ref = db.collection('services')
    
    for _, row in df.iterrows():
        service_data = {
            'companyId': clean_data(row.get('companyId')),
            'serviceId': clean_data(row.get('serviceId')),
            'title': clean_data(row.get('title')),
            'description': clean_data(row.get('description')),
        }
        
        # 使用 serviceId 作为文档 ID
        service_id = service_data['serviceId']
        if service_id:
            services_ref.document(service_id).set(service_data)
            print(f"添加服务: {service_data['title']} (ID: {service_id})")
            
            # 更新公司的服务列表
            company_ref = db.collection('companies').document(service_data['companyId'])
            company_ref.update({
                'services': firestore.ArrayUnion([service_data['title']])
            })

def process_history(df: pd.DataFrame):
    """处理历史数据"""
    print("处理历史数据...")
    history_ref = db.collection('history')
    
    for _, row in df.iterrows():
        history_data = {
            'companyId': clean_data(row.get('companyId')),
            'historyId': clean_data(row.get('historyId')),
            'year': clean_data(row.get('year')),
            'event': clean_data(row.get('event')),
        }
        
        # 使用 historyId 作为文档 ID
        history_id = history_data['historyId']
        if history_id:
            history_ref.document(history_id).set(history_data)
            print(f"添加历史记录: {history_data['year']} (ID: {history_id})")

def main():
    """主函数"""
    file_path = r"D:\IT 软件程序\qx-net-cursor-new\QX Net company data\QX Net next js.xlsx"
    
    if not os.path.exists(file_path):
        print(f"错误：找不到文件 {file_path}")
        return
        
    try:
        process_excel_data(file_path)
        print("数据处理完成！")
    except Exception as e:
        print(f"处理数据时出错：{str(e)}")

if __name__ == "__main__":
    main() 