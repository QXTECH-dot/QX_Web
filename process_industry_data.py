import pandas as pd
import re
import json
from datetime import datetime

def clean_text(text):
    if pd.isna(text):
        return ""
    return str(text).strip()

def generate_category_id(primary, secondary=None, tertiary=None):
    # 生成一级分类ID
    if not secondary and not tertiary:
        # 使用字母+数字格式，如A01, A02等
        return f"A{len(primary.split()) + 1:02d}"
    
    # 生成二级分类ID
    if not tertiary:
        primary_id = generate_category_id(primary)
        # 使用二级分类名称生成序号
        return f"{primary_id}.{len(secondary.split()) + 1:02d}"
    
    # 生成三级分类ID
    secondary_id = generate_category_id(primary, secondary)
    return f"{secondary_id}.{len(tertiary.split()) + 1:02d}"

def generate_service_id(category_id, service_name):
    # 使用服务名称生成三位序号
    service_num = abs(hash(service_name)) % 1000
    return f"{category_id}.{service_num:03d}"

# 读取Excel文件
df = pd.read_excel('QX Net company data/australian-industry-classification-csv.xlsx')

# 创建Firebase数据结构
firebase_data = {
    "industry_categories": {},
    "services": {}
}

# 处理行业分类数据
categories = set()
category_data = []

for _, row in df.iterrows():
    primary = clean_text(row['Primary Category'])
    secondary = clean_text(row['Secondary Category'])
    tertiary = clean_text(row['Tertiary Category'])
    
    # 生成一级分类
    if primary and primary not in categories:
        primary_id = generate_category_id(primary)
        categories.add(primary)
        category_data.append({
            "id": primary_id,
            "primary_category": primary,
            "level": 1,
            "parent_id": None,
            "sort_order": 10,
            "status": 1,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        })
    
    # 生成二级分类
    if secondary and (primary, secondary) not in categories:
        secondary_id = generate_category_id(primary, secondary)
        categories.add((primary, secondary))
        primary_id = generate_category_id(primary)
        category_data.append({
            "id": secondary_id,
            "primary_category": primary,
            "secondary_category": secondary,
            "level": 2,
            "parent_id": primary_id,
            "sort_order": 20,
            "status": 1,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        })
    
    # 生成三级分类
    if tertiary and (primary, secondary, tertiary) not in categories:
        tertiary_id = generate_category_id(primary, secondary, tertiary)
        categories.add((primary, secondary, tertiary))
        secondary_id = generate_category_id(primary, secondary)
        category_data.append({
            "id": tertiary_id,
            "primary_category": primary,
            "secondary_category": secondary,
            "tertiary_category": tertiary,
            "level": 3,
            "parent_id": secondary_id,
            "sort_order": 30,
            "status": 1,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        })

# 将分类数据添加到Firebase数据结构中
for category in category_data:
    firebase_data["industry_categories"][category["id"]] = category

# 处理服务数据
for _, row in df.iterrows():
    primary = clean_text(row['Primary Category'])
    secondary = clean_text(row['Secondary Category'])
    tertiary = clean_text(row['Tertiary Category'])
    service = clean_text(row['Services'])
    description = clean_text(row['Service Description'])
    
    # 确定服务所属的分类ID
    if tertiary:
        category_id = generate_category_id(primary, secondary, tertiary)
    elif secondary:
        category_id = generate_category_id(primary, secondary)
    else:
        category_id = generate_category_id(primary)
    
    service_id = generate_service_id(category_id, service)
    
    # 添加服务数据
    firebase_data["services"][service_id] = {
        "id": service_id,
        "category_id": category_id,
        "service_name": service,
        "service_description": description,
        "sort_order": 0,
        "status": 1,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

# 将数据写入JSON文件
with open('firebase_industry_data.json', 'w', encoding='utf-8') as f:
    json.dump(firebase_data, f, ensure_ascii=False, indent=2)

print("Firebase数据文件生成完成！") 