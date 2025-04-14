import pandas as pd
from firebase_admin import credentials, firestore, initialize_app
import os
from typing import List, Dict
import sys
import json
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 从环境变量获取Firebase配置
firebase_config = os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')
if not firebase_config:
    print("错误: 未找到Firebase配置")
    sys.exit(1)

# 初始化Firebase
cred = credentials.Certificate(json.loads(firebase_config))
initialize_app(cred)
db = firestore.client()

def validate_excel_format(df: pd.DataFrame) -> bool:
    """
    验证Excel文件格式是否正确
    """
    required_columns = ['historyId', 'companyId', 'year', 'event']
    return all(col in df.columns for col in required_columns)

def process_excel_file(file_path: str) -> List[Dict]:
    """
    处理Excel文件并返回格式化后的数据
    """
    try:
        df = pd.read_excel(file_path)
        
        if not validate_excel_format(df):
            print("错误: Excel文件格式不正确。需要包含以下列: historyId, companyId, year, event")
            sys.exit(1)
            
        # 转换数据格式
        records = []
        for _, row in df.iterrows():
            record = {
                'historyId': str(row['historyId']),
                'companyId': str(row['companyId']),
                'year': int(row['year']),
                'event': str(row['event'])
            }
            records.append(record)
            
        return records
    except Exception as e:
        print(f"处理Excel文件时出错: {str(e)}")
        sys.exit(1)

def import_to_firestore(records: List[Dict]) -> None:
    """
    将数据导入到Firestore
    """
    try:
        batch = db.batch()
        collection_ref = db.collection('companyHistories')
        
        for record in records:
            doc_ref = collection_ref.document(record['historyId'])
            batch.set(doc_ref, record)
            
        batch.commit()
        print(f"成功导入 {len(records)} 条记录")
    except Exception as e:
        print(f"导入数据时出错: {str(e)}")
        sys.exit(1)

def main():
    if len(sys.argv) != 2:
        print("使用方法: python import_company_history.py <excel文件路径>")
        sys.exit(1)
        
    file_path = sys.argv[1]
    
    if not os.path.exists(file_path):
        print(f"错误: 文件 {file_path} 不存在")
        sys.exit(1)
        
    records = process_excel_file(file_path)
    import_to_firestore(records)

if __name__ == "__main__":
    main()

 