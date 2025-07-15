#!/usr/bin/env python3
import pandas as pd
import json
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

def read_and_process_data():
    """读取Excel文件并处理数据"""
    
    # 文件路径
    files = {
        2019: "QX Net company data/数据可视化/2019-816502.xls",
        2020: "QX Net company data/数据可视化/2020-816502.xlsx", 
        2021: "QX Net company data/数据可视化/2021-816502.xlsx"
    }
    
    all_records = []
    
    for year, file_path in files.items():
        try:
            print(f"Processing {year} data...")
            
            # 读取Excel文件
            if file_path.endswith('.xls'):
                df = pd.read_excel(file_path, engine='xlrd')
            else:
                df = pd.read_excel(file_path, engine='openpyxl')
            
            print(f"File {year} - Shape: {df.shape}")
            print(f"Columns: {list(df.columns)}")
            
            # 处理每一行数据
            for index, row in df.iterrows():
                # 跳过空行
                if pd.isna(row.iloc[0]):
                    continue
                
                # 根据实际数据结构调整字段映射
                record = {
                    'id': f"industry_viz_{year}_{index:04d}",
                    'year': year,
                    'industry': str(row.iloc[0]) if not pd.isna(row.iloc[0]) else '',
                    'state': str(row.iloc[1]) if len(row) > 1 and not pd.isna(row.iloc[1]) else 'ALL',
                    'employee_category': str(row.iloc[2]) if len(row) > 2 and not pd.isna(row.iloc[2]) else 'ALL',
                    'entry_count': float(row.iloc[3]) if len(row) > 3 and not pd.isna(row.iloc[3]) else 0,
                    'exit_count': float(row.iloc[4]) if len(row) > 4 and not pd.isna(row.iloc[4]) else 0,
                    'net_change': float(row.iloc[5]) if len(row) > 5 and not pd.isna(row.iloc[5]) else 0,
                    'final_count': float(row.iloc[6]) if len(row) > 6 and not pd.isna(row.iloc[6]) else 0,
                    'created_at': datetime.now().isoformat(),
                    'updated_at': datetime.now().isoformat()
                }
                
                all_records.append(record)
                
        except Exception as e:
            print(f"Error processing {year}: {str(e)}")
    
    return all_records

def save_to_files(records):
    """保存到CSV和JSON文件"""
    
    # 保存为CSV
    df = pd.DataFrame(records)
    csv_path = "industry_visualization_data.csv"
    df.to_csv(csv_path, index=False, encoding='utf-8')
    print(f"CSV saved: {csv_path}")
    
    # 保存为JSON
    json_path = "industry_visualization_data.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    print(f"JSON saved: {json_path}")
    
    return csv_path, json_path

def upload_to_firebase(records):
    """上传到Firebase"""
    
    try:
        # 初始化Firebase
        cred_path = "firebase-admin-key.json"
        
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        
        # 集合名称
        collection_name = "industry_visualization_data"
        
        print(f"Uploading {len(records)} records to Firebase...")
        
        # 批量上传
        batch_size = 500
        total_batches = (len(records) + batch_size - 1) // batch_size
        
        for batch_num in range(total_batches):
            start_idx = batch_num * batch_size
            end_idx = min(start_idx + batch_size, len(records))
            batch_data = records[start_idx:end_idx]
            
            batch = db.batch()
            
            for record in batch_data:
                doc_ref = db.collection(collection_name).document(record['id'])
                batch.set(doc_ref, record)
            
            batch.commit()
            print(f"Uploaded batch {batch_num + 1}/{total_batches}")
        
        print("✅ Firebase upload completed!")
        return True
        
    except Exception as e:
        print(f"Firebase upload error: {str(e)}")
        return False

if __name__ == "__main__":
    print("=== Industry Visualization Data Processing ===")
    
    # 读取和处理数据
    records = read_and_process_data()
    
    if records:
        print(f"\nProcessed {len(records)} records")
        
        # 显示数据摘要
        years = set(r['year'] for r in records)
        industries = set(r['industry'] for r in records if r['industry'])
        states = set(r['state'] for r in records if r['state'])
        
        print(f"Years: {sorted(years)}")
        print(f"Industries: {len(industries)} unique")
        print(f"States: {sorted(states)}")
        
        # 显示示例记录
        print("\nSample records:")
        for i, record in enumerate(records[:3]):
            print(f"{i+1}: {record}")
        
        # 保存文件
        csv_path, json_path = save_to_files(records)
        
        # 上传到Firebase
        upload_to_firebase(records)
    else:
        print("No records processed!")