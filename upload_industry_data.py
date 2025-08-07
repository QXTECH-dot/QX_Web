#!/usr/bin/env python3
import firebase_admin
from firebase_admin import credentials, firestore
import json
from datetime import datetime

# 示例数据结构 - 根据实际Excel内容调整
sample_data = [
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
        "entry_count": 380,
        "exit_count": 95,
        "net_change": 285,
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
        "id": "industry_viz_2020_0002",
        "year": 2020,
        "industry": "Manufacturing",
        "state": "VIC", 
        "employee_category": "20-199 employees",
        "entry_count": 350,
        "exit_count": 150,
        "net_change": 200,
        "final_count": 3400,
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
    },
    {
        "id": "industry_viz_2021_0002",
        "year": 2021,
        "industry": "Manufacturing",
        "state": "VIC",
        "employee_category": "20-199 employees",
        "entry_count": 410,
        "exit_count": 80,
        "net_change": 330,
        "final_count": 3730,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
]

def upload_to_firebase(data_records):
    """Upload data to Firebase Firestore"""
    
    try:
        # Initialize Firebase
        cred_path = "firebase-admin-key.json"
        
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        
        # Collection name
        collection_name = "industry_visualization_data"
        
        print(f"Uploading {len(data_records)} records to Firebase...")
        
        # Upload in batches
        batch_size = 500
        total_batches = (len(data_records) + batch_size - 1) // batch_size
        
        for batch_num in range(total_batches):
            start_idx = batch_num * batch_size
            end_idx = min(start_idx + batch_size, len(data_records))
            batch_data = data_records[start_idx:end_idx]
            
            batch = db.batch()
            
            for record in batch_data:
                doc_ref = db.collection(collection_name).document(record['id'])
                batch.set(doc_ref, record)
            
            batch.commit()
            print(f"Uploaded batch {batch_num + 1}/{total_batches} ({len(batch_data)} records)")
        
        print("✅ Firebase upload completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Firebase upload error: {str(e)}")
        return False

def save_sample_json():
    """Save sample data as JSON for reference"""
    with open("industry_visualization_sample.json", 'w', encoding='utf-8') as f:
        json.dump(sample_data, f, indent=2, ensure_ascii=False)
    print("Sample data saved to industry_visualization_sample.json")

if __name__ == "__main__":
    print("=== Industry Visualization Data Upload ===")
    
    # Save sample data
    save_sample_json()
    
    # Upload to Firebase
    success = upload_to_firebase(sample_data)
    
    if success:
        print(f"Successfully uploaded {len(sample_data)} sample records!")
        print("You can now test the visualization page.")
    else:
        print("Upload failed. Please check your Firebase configuration.")
    
    print("\nData structure:")
    print("- year: 2019-2021")
    print("- industry: Industry classification")
    print("- state: Australian state")
    print("- employee_category: Company size by employees")
    print("- entry_count: New companies")
    print("- exit_count: Companies that exited")
    print("- net_change: Net change in companies")
    print("- final_count: Total companies at year end")