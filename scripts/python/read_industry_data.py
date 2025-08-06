#!/usr/bin/env python3
import pandas as pd
import json
import os
from datetime import datetime

def read_excel_files():
    """读取三个Excel文件并分析数据结构"""
    
    base_path = "/Users/alex/Desktop/IT Program/QX Net next js/qx-net-nextjs-new/QX Net company data/数据可视化"
    
    files = {
        '2019': f'{base_path}/2019-816502.xls',
        '2020': f'{base_path}/2020-816502.xlsx', 
        '2021': f'{base_path}/2021-816502.xlsx'
    }
    
    all_data = []
    
    for year, file_path in files.items():
        try:
            print(f"Reading {year} data from: {file_path}")
            
            # 尝试读取Excel文件
            if file_path.endswith('.xls'):
                df = pd.read_excel(file_path, engine='xlrd')
            else:
                df = pd.read_excel(file_path, engine='openpyxl')
            
            print(f"Shape: {df.shape}")
            print(f"Columns: {list(df.columns)}")
            print(f"First 5 rows:")
            print(df.head())
            print(f"Data types:")
            print(df.dtypes)
            print("-" * 50)
            
            # 保存原始数据用于分析
            df['year'] = year
            all_data.append(df)
            
        except Exception as e:
            print(f"Error reading {year} file: {str(e)}")
    
    return all_data

def process_and_structure_data(all_data):
    """处理和结构化数据"""
    processed_records = []
    
    for df in all_data:
        year = df['year'].iloc[0]
        
        # 删除year列用于处理
        df_clean = df.drop('year', axis=1)
        
        # 遍历每一行数据
        for index, row in df_clean.iterrows():
            # 跳过空行或标题行
            if pd.isna(row.iloc[0]) or str(row.iloc[0]).strip() == '':
                continue
                
            # 提取数据 - 需要根据实际列结构调整
            record = {
                'id': f"industry_data_{year}_{index:04d}",
                'year': int(year),
                'industry': str(row.iloc[0]).strip() if not pd.isna(row.iloc[0]) else '',
                'state': str(row.iloc[1]).strip() if len(row) > 1 and not pd.isna(row.iloc[1]) else '',
                'employee_size_category': str(row.iloc[2]).strip() if len(row) > 2 and not pd.isna(row.iloc[2]) else '',
                'company_count': int(row.iloc[3]) if len(row) > 3 and not pd.isna(row.iloc[3]) else 0,
                'net_entries': int(row.iloc[4]) if len(row) > 4 and not pd.isna(row.iloc[4]) else 0,
                'net_exits': int(row.iloc[5]) if len(row) > 5 and not pd.isna(row.iloc[5]) else 0,
                'net_change': int(row.iloc[6]) if len(row) > 6 and not pd.isna(row.iloc[6]) else 0,
                'final_count': int(row.iloc[7]) if len(row) > 7 and not pd.isna(row.iloc[7]) else 0,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            processed_records.append(record)
    
    return processed_records

def save_to_csv(processed_records):
    """保存为CSV文件"""
    df = pd.DataFrame(processed_records)
    csv_path = "/Users/alex/Desktop/IT Program/QX Net next js/qx-net-nextjs-new/industry_visualization_data.csv"
    df.to_csv(csv_path, index=False, encoding='utf-8')
    print(f"Data saved to: {csv_path}")
    return csv_path

def save_to_json(processed_records):
    """保存为JSON文件用于Firebase上传"""
    json_path = "/Users/alex/Desktop/IT Program/QX Net next js/qx-net-nextjs-new/industry_visualization_data.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(processed_records, f, indent=2, ensure_ascii=False)
    print(f"JSON data saved to: {json_path}")
    return json_path

if __name__ == "__main__":
    print("=== Reading Industry Visualization Data ===")
    
    # 读取Excel文件
    all_data = read_excel_files()
    
    if all_data:
        print(f"\n=== Processing {len(all_data)} files ===")
        
        # 处理数据
        processed_records = process_and_structure_data(all_data)
        
        print(f"Processed {len(processed_records)} records")
        
        # 保存数据
        csv_path = save_to_csv(processed_records)
        json_path = save_to_json(processed_records)
        
        # 显示数据摘要
        if processed_records:
            print(f"\n=== Data Summary ===")
            years = set(r['year'] for r in processed_records)
            industries = set(r['industry'] for r in processed_records if r['industry'])
            states = set(r['state'] for r in processed_records if r['state'])
            
            print(f"Years: {sorted(years)}")
            print(f"Industries: {len(industries)} unique")
            print(f"States: {sorted(states)}")
            print(f"Total records: {len(processed_records)}")
            
            # 显示几个示例记录
            print(f"\n=== Sample Records ===")
            for i, record in enumerate(processed_records[:3]):
                print(f"Record {i+1}: {record}")
    else:
        print("No data was successfully read.")