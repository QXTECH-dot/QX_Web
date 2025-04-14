import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime
import json

def initialize_firebase():
    """初始化Firebase连接"""
    try:
        firebase_admin.get_app()
    except ValueError:
        cred = credentials.Certificate('firebase-admin-key.json')
        firebase_admin.initialize_app(cred)
    return firestore.client()

def load_excel_data(file_path):
    """加载Excel文件中的所有sheet数据"""
    try:
        excel_file = pd.ExcelFile(file_path)
        data = {
            'companies': pd.read_excel(excel_file, 'Companies').fillna(''),
            'offices': pd.read_excel(excel_file, 'Offices').fillna(''),
            'services': pd.read_excel(excel_file, 'Services').fillna(''),
            'history': pd.read_excel(excel_file, 'History').fillna('')
        }
        return data
    except Exception as e:
        print(f"读取Excel文件时出错: {str(e)}")
        return None

def process_company_data(db, companies_df):
    for _, row in companies_df.iterrows():
        try:
            company_id = str(row['companyId'])
            # 处理数字字段的空值
            founded_year = int(row['foundedYear']) if pd.notna(row['foundedYear']) and row['foundedYear'] != '' else None
            team_size = int(row['teamSize']) if pd.notna(row['teamSize']) and row['teamSize'] != '' else None
            
            # 处理列表字段
            industry = row['industry'].split(',') if pd.notna(row['industry']) else []
            languages = row['languages'].split(',') if pd.notna(row['languages']) else []
            
            company_data = {
                'companyId': company_id,
                'name_en': str(row['name_en']) if pd.notna(row['name_en']) else '',
                'name_cn': str(row['name_cn']) if pd.notna(row['name_cn']) else '',
                'abn': str(row['abn']) if pd.notna(row['abn']) else '',
                'logo': str(row['logo']) if pd.notna(row['logo']) else '',
                'industry': industry,
                'website': str(row['website']) if pd.notna(row['website']) else '',
                'foundedYear': founded_year,
                'teamSize': team_size,
                'languages': languages,
                'shortDescription': str(row['shortDescription']) if pd.notna(row['shortDescription']) else '',
                'fullDescription': str(row['fullDescription']) if pd.notna(row['fullDescription']) else '',
                'social': str(row['social']) if pd.notna(row['social']) else '',
                'verified': bool(row['verified']) if pd.notna(row['verified']) else False,
                'updated_at': firestore.SERVER_TIMESTAMP
            }
            
            # 使用set而不是add，这样可以更新现有记录
            db.collection('companies').document(company_id).set(company_data, merge=True)
            print(f'成功处理公司数据: {company_id}')
            
        except Exception as e:
            print(f'处理公司数据时出错 {company_id if "company_id" in locals() else "Unknown"}: {str(e)}')
            continue

def process_office_data(db, offices_df):
    for _, row in offices_df.iterrows():
        try:
            company_id = str(row['companyId'])
            office_id = str(row['officeId'])
            
            office_data = {
                'officeId': office_id,
                'companyId': company_id,
                'state': str(row['state']) if pd.notna(row['state']) else '',
                'city': str(row['city']) if pd.notna(row['city']) else '',
                'address': str(row['address']) if pd.notna(row['address']) else '',
                'postalCode': str(row['postalCode']) if pd.notna(row['postalCode']) else '',
                'contactPerson': str(row['contactPerson']) if pd.notna(row['contactPerson']) else '',
                'email': str(row['email']) if pd.notna(row['email']) else '',
                'phone': str(row['phone']) if pd.notna(row['phone']) else '',
                'isHeadquarter': bool(row['isHeadquarter']) if pd.notna(row['isHeadquarter']) else False,
                'updated_at': firestore.SERVER_TIMESTAMP
            }
            
            # 检查公司是否存在
            company_ref = db.collection('companies').document(company_id)
            if company_ref.get().exists:
                db.collection('offices').document(office_id).set(office_data, merge=True)
                print(f'成功处理办公室数据: {office_id}')
            else:
                print(f'警告: 找不到对应的公司ID {company_id} 的办公室记录')
                
        except Exception as e:
            print(f'处理办公室数据时出错: {str(e)}')
            continue

def process_service_data(db, services_df):
    for _, row in services_df.iterrows():
        try:
            company_id = str(row['companyId'])
            service_id = str(row['serviceId'])
            
            service_data = {
                'serviceId': service_id,
                'companyId': company_id,
                'title': str(row['title']) if pd.notna(row['title']) else '',
                'description': str(row['description']) if pd.notna(row['description']) else '',
                'updated_at': firestore.SERVER_TIMESTAMP
            }
            
            # 检查公司是否存在
            company_ref = db.collection('companies').document(company_id)
            if company_ref.get().exists:
                db.collection('services').document(service_id).set(service_data, merge=True)
                print(f'成功处理服务数据: {service_id}')
            else:
                print(f'警告: 找不到对应的公司ID {company_id} 的服务记录')
                
        except Exception as e:
            print(f'处理服务数据时出错: {str(e)}')
            continue

def process_history_data(db, history_df):
    for _, row in history_df.iterrows():
        try:
            company_id = str(row['companyId'])
            history_id = str(row['historyId'])
            
            history_data = {
                'historyId': history_id,
                'companyId': company_id,
                'year': int(row['year']) if pd.notna(row['year']) and row['year'] != '' else None,
                'event': str(row['event']) if pd.notna(row['event']) else '',
                'updated_at': firestore.SERVER_TIMESTAMP
            }
            
            # 检查公司是否存在
            company_ref = db.collection('companies').document(company_id)
            if company_ref.get().exists:
                db.collection('history').document(history_id).set(history_data, merge=True)
                print(f'成功处理历史数据: {history_id}')
            else:
                print(f'警告: 找不到对应的公司ID {company_id} 的历史记录')
                
        except Exception as e:
            print(f'处理历史数据时出错: {str(e)}')
            continue

def main():
    """主函数"""
    print("开始数据处理...")
    
    # 初始化Firebase
    db = initialize_firebase()
    
    # 设置Excel文件路径
    excel_path = os.path.join('QX Net company data', 'QX Net next js.xlsx')
    
    # 加载Excel数据
    data = load_excel_data(excel_path)
    if not data:
        print("无法加载Excel数据，程序终止")
        return
    
    # 按照依赖关系顺序处理数据
    print("\n1. 处理公司数据...")
    process_company_data(db, data['companies'])
    
    print("\n2. 处理办公室数据...")
    process_office_data(db, data['offices'])
    
    print("\n3. 处理服务数据...")
    process_service_data(db, data['services'])
    
    print("\n4. 处理历史数据...")
    process_history_data(db, data['history'])
    
    print("\n数据处理完成!")

if __name__ == "__main__":
    main() 