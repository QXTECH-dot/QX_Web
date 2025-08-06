import firebase_admin
from firebase_admin import credentials, firestore

# 直接指定服务账号json文件路径
SERVICE_ACCOUNT_PATH = 'firebase-admin-key.json'

# 初始化Firebase
cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

def verify_data_quality():
    """
    验证修复后的数据质量
    """
    print("=== 数据质量验证 ===")
    
    companies_ref = db.collection('companies')
    companies = companies_ref.limit(10).stream()  # 检查前10个文档
    
    print("\n检查前10个公司的数据格式:")
    print("-" * 80)
    
    for i, doc in enumerate(companies, 1):
        data = doc.to_dict()
        print(f"\n{i}. 公司ID: {doc.id}")
        print(f"   名称: {data.get('name_en', 'N/A')}")
        print(f"   Slug: {data.get('slug', 'N/A')}")
        
        # 检查fullDescription
        full_desc = data.get('fullDescription')
        if full_desc:
            if isinstance(full_desc, str):
                print(f"   ✅ fullDescription: 字符串格式 (长度: {len(full_desc)})")
                print(f"      预览: {full_desc[:100]}...")
            elif isinstance(full_desc, list):
                print(f"   ❌ fullDescription: 错误的数组格式 (元素数: {len(full_desc)})")
                print(f"      内容: {full_desc[:3]}...")
            else:
                print(f"   ⚠️  fullDescription: 未知格式 ({type(full_desc)})")
        else:
            print(f"   ⚠️  fullDescription: 空值")
        
        # 检查shortDescription
        short_desc = data.get('shortDescription')
        if short_desc:
            if isinstance(short_desc, str):
                print(f"   ✅ shortDescription: 字符串格式 (长度: {len(short_desc)})")
            elif isinstance(short_desc, list):
                print(f"   ❌ shortDescription: 错误的数组格式")
            else:
                print(f"   ⚠️  shortDescription: 未知格式 ({type(short_desc)})")
        else:
            print(f"   ⚠️  shortDescription: 空值")
        
        # 检查数组字段
        for field in ['languages', 'services', 'industry']:
            value = data.get(field)
            if value:
                if isinstance(value, list):
                    print(f"   ✅ {field}: 正确的数组格式 (元素数: {len(value)})")
                elif isinstance(value, str):
                    print(f"   ⚠️  {field}: 字符串格式 (应该是数组)")
                else:
                    print(f"   ❌ {field}: 错误格式 ({type(value)})")
    
    print("\n" + "=" * 80)
    print("验证完成")

def get_statistics():
    """
    获取数据统计信息
    """
    print("\n=== 数据统计 ===")
    
    companies_ref = db.collection('companies')
    all_companies = companies_ref.stream()
    
    total_count = 0
    slug_count = 0
    full_desc_count = 0
    short_desc_count = 0
    problematic_full_desc = 0
    problematic_short_desc = 0
    
    for doc in all_companies:
        total_count += 1
        data = doc.to_dict()
        
        if data.get('slug'):
            slug_count += 1
        
        full_desc = data.get('fullDescription')
        if full_desc:
            full_desc_count += 1
            if isinstance(full_desc, list):
                problematic_full_desc += 1
        
        short_desc = data.get('shortDescription')
        if short_desc:
            short_desc_count += 1
            if isinstance(short_desc, list):
                problematic_short_desc += 1
    
    print(f"总公司数量: {total_count}")
    print(f"包含slug的公司: {slug_count} ({slug_count/total_count*100:.1f}%)")
    print(f"包含fullDescription的公司: {full_desc_count} ({full_desc_count/total_count*100:.1f}%)")
    print(f"包含shortDescription的公司: {short_desc_count} ({short_desc_count/total_count*100:.1f}%)")
    print(f"fullDescription格式错误的公司: {problematic_full_desc}")
    print(f"shortDescription格式错误的公司: {problematic_short_desc}")
    
    if problematic_full_desc == 0 and problematic_short_desc == 0:
        print("🎉 所有description字段格式都正确！")
    else:
        print("⚠️  仍有description字段格式问题")

if __name__ == '__main__':
    verify_data_quality()
    get_statistics() 