import firebase_admin
from firebase_admin import credentials, firestore
import os

# 直接指定服务账号json文件路径
SERVICE_ACCOUNT_PATH = 'firebase-admin-key.json'

# 初始化Firebase
cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

def check_firebase_fields():
    """
    检查Firebase数据库中的字段
    """
    print("正在检查Firebase数据库中的字段...")
    
    # 获取companies集合
    companies_ref = db.collection('companies')
    companies_snapshot = companies_ref.limit(10).get()  # 先检查前10个文档
    
    if not companies_snapshot:
        print("Firebase中没有找到companies集合或数据为空")
        return
    
    print(f"检查前10个文档的字段...")
    
    # 统计字段出现次数
    field_counts = {}
    
    for i, doc in enumerate(companies_snapshot):
        doc_data = doc.to_dict()
        print(f"\n=== 文档 {i+1} (ID: {doc.id}) ===")
        
        # 统计字段
        for field in doc_data.keys():
            field_counts[field] = field_counts.get(field, 0) + 1
        
        # 检查关键字段
        key_fields = ['companyId', 'name_en', 'slug', 'fullDescription', 'shortDescription']
        for field in key_fields:
            if field in doc_data:
                value = doc_data[field]
                if isinstance(value, str) and len(value) > 50:
                    print(f"✅ {field}: {value[:50]}...")
                else:
                    print(f"✅ {field}: {value}")
            else:
                print(f"❌ {field}: 不存在")
    
    print(f"\n=== 字段统计 (前10个文档) ===")
    for field, count in sorted(field_counts.items()):
        print(f"{field}: {count}/10")
    
    # 检查所有文档的companyId字段
    print(f"\n=== 检查所有文档的companyId字段 ===")
    all_companies = companies_ref.get()
    total_count = len(all_companies)
    companyId_count = 0
    
    for doc in all_companies:
        doc_data = doc.to_dict()
        if 'companyId' in doc_data and doc_data['companyId']:
            companyId_count += 1
    
    print(f"总文档数: {total_count}")
    print(f"包含companyId字段的文档数: {companyId_count}")
    print(f"缺失companyId字段的文档数: {total_count - companyId_count}")
    
    if companyId_count == 0:
        print("❌ 所有文档都缺少companyId字段！")
    elif companyId_count == total_count:
        print("✅ 所有文档都有companyId字段")
    else:
        print(f"⚠️  部分文档缺少companyId字段")
    
    # 显示几个有companyId的示例
    if companyId_count > 0:
        print(f"\n=== companyId字段示例 ===")
        count = 0
        for doc in all_companies:
            doc_data = doc.to_dict()
            if 'companyId' in doc_data and doc_data['companyId']:
                print(f"文档ID: {doc.id}, companyId: {doc_data['companyId']}")
                count += 1
                if count >= 5:  # 只显示前5个
                    break

if __name__ == '__main__':
    check_firebase_fields() 