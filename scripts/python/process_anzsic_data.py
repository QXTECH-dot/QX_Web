#!/usr/bin/env python3
import pandas as pd
import json
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime

def process_anzsic_data():
    """Process ANZSIC data and upload to Firebase"""
    
    # 读取CSV数据
    csv_file = "/Users/alex/Desktop/IT Program/QX Net next js/qx-net-nextjs-new/anzsic_data.csv"
    df = pd.read_csv(csv_file)
    
    print(f"Processing {len(df)} records...")
    
    # 创建层级结构
    processed_data = []
    level1_codes = {}
    level2_codes = {}
    level1_counter = 1
    level2_counter = 1
    
    for index, row in df.iterrows():
        level1 = row['indusry_1']
        level2 = row['indusry_2']
        level3 = row['indusry_3'] if pd.notna(row['indusry_3']) else None
        
        # 为一级行业生成代码
        if level1 not in level1_codes:
            level1_codes[level1] = f"L1_{level1_counter:02d}"
            level1_counter += 1
        
        # 为二级行业生成代码
        level2_key = f"{level1}::{level2}"
        if level2_key not in level2_codes:
            level2_codes[level2_key] = f"{level1_codes[level1]}_L2_{level2_counter:02d}"
            level2_counter += 1
        
        # 为三级行业生成代码
        level3_code = None
        if level3:
            level3_code = f"{level2_codes[level2_key]}_L3_{index + 1:03d}"
        
        record = {
            'id': f"industry_{index + 1:03d}",
            'level1': level1,
            'level2': level2,
            'level3': level3,
            'level1_code': level1_codes[level1],
            'level2_code': level2_codes[level2_key],
            'level3_code': level3_code,
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        processed_data.append(record)
    
    # 保存为JSON文件以便检查
    output_file = "/Users/alex/Desktop/IT Program/QX Net next js/qx-net-nextjs-new/processed_anzsic_data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(processed_data, f, indent=2, ensure_ascii=False)
    
    print(f"Processed data saved to: {output_file}")
    
    # 生成统计信息
    unique_level1 = len(set(item['level1'] for item in processed_data))
    unique_level2 = len(set(f"{item['level1']}::{item['level2']}" for item in processed_data))
    unique_level3 = len([item for item in processed_data if item['level3']])
    
    print(f"\nStatistics:")
    print(f"Total records: {len(processed_data)}")
    print(f"Unique Level 1 industries: {unique_level1}")
    print(f"Unique Level 2 industries: {unique_level2}")
    print(f"Level 3 industries: {unique_level3}")
    
    # 展示一些示例数据
    print(f"\nSample data:")
    for i in range(min(5, len(processed_data))):
        record = processed_data[i]
        print(f"  {record['id']}: {record['level1_code']} -> {record['level2_code']} -> {record['level3_code']}")
        print(f"    L1: {record['level1']}")
        print(f"    L2: {record['level2']}")
        print(f"    L3: {record['level3']}")
        print()
    
    return processed_data

def upload_to_firebase(processed_data):
    """Upload processed data to Firebase"""
    
    # 初始化Firebase
    cred_path = "/Users/alex/Desktop/IT Program/QX Net next js/qx-net-nextjs-new/firebase-admin-key.json"
    
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    
    db = firestore.client()
    
    # 创建industry_categories集合
    collection_name = "industry_categories"
    
    print(f"Uploading {len(processed_data)} records to Firebase collection: {collection_name}")
    
    batch_size = 500  # Firestore批量写入限制
    total_batches = (len(processed_data) + batch_size - 1) // batch_size
    
    for batch_num in range(total_batches):
        start_idx = batch_num * batch_size
        end_idx = min(start_idx + batch_size, len(processed_data))
        batch_data = processed_data[start_idx:end_idx]
        
        batch = db.batch()
        
        for record in batch_data:
            doc_ref = db.collection(collection_name).document(record['id'])
            batch.set(doc_ref, record)
        
        try:
            batch.commit()
            print(f"Uploaded batch {batch_num + 1}/{total_batches} ({len(batch_data)} records)")
        except Exception as e:
            print(f"Error uploading batch {batch_num + 1}: {str(e)}")
            return False
    
    print(f"Successfully uploaded all data to Firebase!")
    return True

if __name__ == "__main__":
    print("=== Processing ANZSIC Industry Classification Data ===")
    processed_data = process_anzsic_data()
    
    # 自动上传到Firebase
    print("\nUploading to Firebase...")
    success = upload_to_firebase(processed_data)
    if success:
        print("✅ Data upload completed successfully!")
    else:
        print("❌ Data upload failed!")