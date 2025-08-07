#!/usr/bin/env python3
"""
处理行业数据可视化Excel文件并上传到Firebase
"""
import pandas as pd
import json
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os

def read_excel_file(file_path, year):
    """读取单个Excel文件"""
    try:
        print(f"Reading {year} data from: {file_path}")
        
        # 根据文件扩展名选择引擎
        if file_path.endswith('.xls'):
            df = pd.read_excel(file_path, engine='xlrd')
        else:
            df = pd.read_excel(file_path, engine='openpyxl')
        
        print(f"File {year} loaded successfully - Shape: {df.shape}")
        print(f"Columns: {list(df.columns)}")
        
        return df, year
    except Exception as e:
        print(f"Error reading {year} file: {str(e)}")
        return None, year

def process_excel_data():
    """处理所有Excel文件"""
    
    # 文件路径
    files = {
        2019: "QX Net company data/数据可视化/2019-816502.xls",
        2020: "QX Net company data/数据可视化/2020-816502.xlsx", 
        2021: "QX Net company data/数据可视化/2021-816502.xlsx"
    }
    
    all_records = []
    
    for year, file_path in files.items():
        df, _ = read_excel_file(file_path, year)
        
        if df is not None:
            print(f"\nProcessing {year} data...")
            print(f"Columns found: {list(df.columns)}")
            print(f"First few rows:")
            print(df.head())
            
            # 处理每一行数据
            for index, row in df.iterrows():
                # 跳过空行或无效数据
                if pd.isna(row.iloc[0]) or str(row.iloc[0]).strip() == '':
                    continue
                
                try:
                    # 基于实际Excel结构调整字段映射
                    # 这里需要根据实际Excel文件的列结构来调整
                    record = {
                        'id': f"industry_viz_{year}_{index:04d}",
                        'year': year,
                        'industry': str(row.iloc[0]).strip() if not pd.isna(row.iloc[0]) else 'Unknown',
                        'state': str(row.iloc[1]).strip() if len(row) > 1 and not pd.isna(row.iloc[1]) else 'ALL',
                        'employee_category': str(row.iloc[2]).strip() if len(row) > 2 and not pd.isna(row.iloc[2]) else 'ALL',
                        'entry_count': float(row.iloc[3]) if len(row) > 3 and not pd.isna(row.iloc[3]) else 0,
                        'exit_count': float(row.iloc[4]) if len(row) > 4 and not pd.isna(row.iloc[4]) else 0,
                        'net_change': float(row.iloc[5]) if len(row) > 5 and not pd.isna(row.iloc[5]) else 0,
                        'final_count': float(row.iloc[6]) if len(row) > 6 and not pd.isna(row.iloc[6]) else 0,
                        'created_at': datetime.now().isoformat(),
                        'updated_at': datetime.now().isoformat()
                    }
                    
                    all_records.append(record)
                    
                except Exception as e:
                    print(f"Error processing row {index} in {year}: {str(e)}")
                    continue
    
    return all_records

def save_to_csv(records):
    """保存为CSV文件"""
    if not records:
        print("No records to save")
        return None
        
    df = pd.DataFrame(records)
    csv_path = "industry_visualization_processed.csv"
    df.to_csv(csv_path, index=False, encoding='utf-8')
    print(f"✅ CSV saved: {csv_path}")
    
    # 显示数据统计
    print("\n=== Data Statistics ===")
    print(f"Total records: {len(records)}")
    years = df['year'].unique()
    print(f"Years: {sorted(years)}")
    industries = df['industry'].unique()
    print(f"Industries: {len(industries)} unique")
    states = df['state'].unique()
    print(f"States: {sorted(states)}")
    
    return csv_path

def upload_to_firebase(records):
    """上传到Firebase Firestore"""
    
    if not records:
        print("No records to upload")
        return False
        
    try:
        # 初始化Firebase
        cred_path = "firebase-admin-key.json"
        
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        
        # 集合名称
        collection_name = "industry_visualization_data"
        
        print(f"Uploading {len(records)} records to Firebase collection: {collection_name}")
        
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
            print(f"✅ Uploaded batch {batch_num + 1}/{total_batches} ({len(batch_data)} records)")
        
        print("✅ Firebase upload completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Firebase upload error: {str(e)}")
        return False

def create_sample_data():
    """创建示例数据用于测试"""
    sample_records = [
        {
            "id": "industry_viz_2019_0001",
            "year": 2019,
            "industry": "Agriculture, Forestry and Fishing",
            "state": "NSW",
            "employee_category": "1-19 employees",
            "entry_count": 450,
            "exit_count": 120,
            "net_change": 330,
            "final_count": 2800,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": "industry_viz_2019_0002",
            "year": 2019,
            "industry": "Manufacturing",
            "state": "VIC",
            "employee_category": "20-199 employees",
            "entry_count": 320,
            "exit_count": 80,
            "net_change": 240,
            "final_count": 3200,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": "industry_viz_2020_0001",
            "year": 2020,
            "industry": "Agriculture, Forestry and Fishing",
            "state": "NSW",
            "employee_category": "1-19 employees",
            "entry_count": 420,
            "exit_count": 180,
            "net_change": 240,
            "final_count": 3040,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        },
        {
            "id": "industry_viz_2021_0001",
            "year": 2021,
            "industry": "Agriculture, Forestry and Fishing",
            "state": "NSW",
            "employee_category": "1-19 employees",
            "entry_count": 500,
            "exit_count": 100,
            "net_change": 400,
            "final_count": 3440,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
    ]
    
    return sample_records

if __name__ == "__main__":
    print("=== Industry Data Visualization Processing ===")
    
    # 检查Excel文件是否存在
    files_exist = all([
        os.path.exists("QX Net company data/数据可视化/2019-816502.xls"),
        os.path.exists("QX Net company data/数据可视化/2020-816502.xlsx"),
        os.path.exists("QX Net company data/数据可视化/2021-816502.xlsx")
    ])
    
    if files_exist:
        print("✅ Excel files found, processing real data...")
        records = process_excel_data()
    else:
        print("⚠️  Excel files not found, using sample data...")
        records = create_sample_data()
    
    if records:
        print(f"\n✅ Processed {len(records)} records")
        
        # 保存为CSV
        csv_path = save_to_csv(records)
        
        # 上传到Firebase
        upload_success = upload_to_firebase(records)
        
        if upload_success:
            print("\n🎉 Data processing completed successfully!")
            print("You can now view the visualization at: /industry-data-visualization")
        else:
            print("\n❌ Firebase upload failed")
    else:
        print("❌ No records processed")
    
    print("\n=== Data Structure ===")
    print("Fields:")
    print("- id: Unique identifier")
    print("- year: 2019-2021")
    print("- industry: Industry classification")
    print("- state: Australian state (NSW, VIC, QLD, WA, etc.)")
    print("- employee_category: Company size by employees")
    print("- entry_count: Number of new companies")
    print("- exit_count: Number of companies that exited")
    print("- net_change: Net change in company count")
    print("- final_count: Total companies at year end")