import firebase_admin
from firebase_admin import credentials, firestore
import csv
import os
import re
from datetime import datetime

# 直接指定服务账号json文件路径
SERVICE_ACCOUNT_PATH = 'firebase-admin-key.json'

# 初始化Firebase
cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

def clean_field(value):
    """
    清洗字段，去除多余的中括号、引号，数组转为逗号分隔字符串
    """
    if isinstance(value, str):
        v = value.strip()
        # 去除首尾中括号
        if (v.startswith("[") and v.endswith("]")) or (v.startswith("(") and v.endswith(")")):
            v = v[1:-1].strip()
        # 去除多余的引号
        v = re.sub(r"^['\"]|['\"]$", "", v)
        # 多个元素用逗号分隔
        v = v.replace("','", ',').replace('","', ',')
        return v
    elif isinstance(value, list):
        return ','.join(map(str, value))
    elif value is None:
        return ''
    return str(value)

def export_companies_to_csv(output_file=None):
    """
    从Firebase Firestore导出companies集合的数据到CSV文件，并清洗部分字段
    """
    try:
        # 设置导出路径为桌面 QX Web数据库 文件夹
        if output_file is None:
            desktop = os.path.expanduser('~/Desktop')
            export_dir = os.path.join(desktop, 'QX Web数据库')
            os.makedirs(export_dir, exist_ok=True)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_file = os.path.join(export_dir, f'companies_export_{timestamp}.csv')
        
        companies_ref = db.collection('companies')
        docs = list(companies_ref.stream())
        
        if not docs:
            print("没有找到任何公司数据")
            return
        
        print(f"找到 {len(docs)} 家公司数据")
        
        # 收集所有可能的字段名
        all_fieldnames = set()
        all_data = []
        
        for doc in docs:
            doc_data = doc.to_dict()
            doc_data['document_id'] = doc.id  # 添加文档ID
            all_fieldnames.update(doc_data.keys())
            all_data.append(doc_data)
        
        # 转换为排序的列表
        fieldnames = sorted(list(all_fieldnames))
        
        print(f"发现字段: {', '.join(fieldnames)}")
        
        # 写入CSV文件
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames, extrasaction='ignore')
            writer.writeheader()
            
            for doc_data in all_data:
                # 清洗数据
                cleaned_row = {}
                for key in fieldnames:
                    value = doc_data.get(key, '')
                    if key in ['industry', 'industries', 'languages', 'services']:
                        cleaned_row[key] = clean_field(value)
                    else:
                        cleaned_row[key] = clean_field(value)
                
                writer.writerow(cleaned_row)
        
        print(f"成功导出 {len(all_data)} 条数据到 {output_file}")
        
    except Exception as e:
        print(f"导出数据时出错: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    export_companies_to_csv() 