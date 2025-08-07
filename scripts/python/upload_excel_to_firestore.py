import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def initialize_firebase():
    try:
        # 初始化 Firebase
        cred = credentials.Certificate("QX Net company data/qx-net-next-js-firebase-adminsdk-fbsvc-2cc9fc9468.json")
        firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        logging.error(f"Firebase初始化失败: {str(e)}")
        raise

def safe_int(value):
    try:
        if pd.isna(value) or value == '':
            return None
        if isinstance(value, str) and '+' in value:
            return int(value.replace('+', ''))
        return int(value)
    except (ValueError, TypeError):
        return None

def safe_str(value):
    if pd.isna(value):
        return ''
    return str(value).strip()

def safe_list(value):
    if pd.isna(value):
        return []
    if isinstance(value, str):
        # 尝试解析JSON字符串
        try:
            parsed = eval(value)
            if isinstance(parsed, list):
                return parsed
        except:
            # 如果解析失败，将字符串作为单个值返回
            return [value.strip()]
    return value if isinstance(value, list) else []

def clear_collection(db, collection_name):
    try:
        # 清空指定集合
        batch_size = 500
        docs = db.collection(collection_name).limit(batch_size).stream()
        deleted = 0
        
        # 批量删除文档
        for doc in docs:
            doc.reference.delete()
            deleted += 1
            
        if deleted >= batch_size:
            # 如果删除的文档数量达到批次大小，可能还有更多文档
            return clear_collection(db, collection_name)
            
        logging.info(f"已清空集合 {collection_name}: 删除了 {deleted} 条记录")
    except Exception as e:
        logging.error(f"清空集合 {collection_name} 失败: {str(e)}")
        raise

def upload_companies(db, df):
    success_count = 0
    error_count = 0
    
    for _, row in df.iterrows():
        try:
            company_id = safe_str(row['companyId'])
            if not company_id:
                logging.warning("跳过无效的公司ID")
                continue
                
            company_data = {
                'name_en': safe_str(row['name_en']),
                'name_cn': safe_str(row['name_cn']),
                'abn': safe_str(row['abn']),
                'logo': safe_str(row['logo']),
                'industry': safe_list(row['industry']),
                'website': safe_str(row['website']),
                'foundedYear': safe_int(row['foundedYear']),
                'teamSize': safe_int(row['teamSize']),
                'languages': safe_list(row['languages']),
                'shortDescription': safe_str(row['shortDescription']),
                'fullDescription': safe_str(row['fullDescription']),
                'social': safe_str(row['social']),
                'verified': bool(row['verified']) if pd.notna(row['verified']) else False,
                'createdAt': firestore.SERVER_TIMESTAMP,
                'updatedAt': firestore.SERVER_TIMESTAMP
            }
            
            # 完全覆盖现有数据
            db.collection('companies').document(company_id).set(company_data)
            success_count += 1
            logging.info(f"成功上传公司数据: {company_id}")
            
        except Exception as e:
            error_count += 1
            logging.error(f"上传公司数据失败 {company_id if 'company_id' in locals() else 'Unknown'}: {str(e)}")
            continue
            
    logging.info(f"公司数据上传完成: 成功 {success_count} 条, 失败 {error_count} 条")

def main():
    try:
        # 初始化Firebase
        db = initialize_firebase()
        
        # 从桌面读取CSV文件
        csv_path = "/Users/alex/Desktop/QX_Net_company_data.csv"
        df = pd.read_csv(csv_path)
        
        # 清空现有数据
        clear_collection(db, 'companies')
        
        # 上传新数据
        upload_companies(db, df)
        
        logging.info("数据上传完成")
        
    except Exception as e:
        logging.error(f"程序执行失败: {str(e)}")
        raise

if __name__ == "__main__":
    main() 