import firebase_admin
from firebase_admin import credentials, firestore
import csv
import os
import re

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
    return value

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
            output_file = os.path.join(export_dir, 'companies_export.csv')
        companies_ref = db.collection('companies')
        docs = companies_ref.stream()
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            first_doc = next(docs, None)
            if not first_doc:
                print("没有找到任何公司数据")
                return
            fieldnames = list(first_doc.to_dict().keys())
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            # 写入第一个文档
            row = first_doc.to_dict()
            for key in row:
                if key in ['industry', 'industries', 'languages', 'services']:
                    row[key] = clean_field(row[key])
            writer.writerow(row)
            # 写入剩余文档
            for doc in docs:
                row = doc.to_dict()
                for key in row:
                    if key in ['industry', 'industries', 'languages', 'services']:
                        row[key] = clean_field(row[key])
                writer.writerow(row)
        print(f"成功导出数据到 {output_file}")
    except Exception as e:
        print(f"导出数据时出错: {str(e)}")

if __name__ == '__main__':
    export_companies_to_csv() 