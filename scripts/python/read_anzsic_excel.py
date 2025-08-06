#!/usr/bin/env python3
import pandas as pd
import json
import sys
import os

def read_anzsic_excel():
    """Read ANZSIC Excel file and convert to structured JSON"""
    
    # Excel文件路径
    excel_file = "/Users/alex/Desktop/IT Program/QX Net next js/qx-net-nextjs-new/ANZSIC 2006 Division, subdivision and group codes and titles.xls"
    
    try:
        # 读取Excel文件
        print("Reading Excel file...")
        df = pd.read_excel(excel_file)
        
        # 显示前几行来了解数据结构
        print("Excel file structure:")
        print(df.head(10))
        print("\nColumns:")
        print(df.columns.tolist())
        print(f"\nTotal rows: {len(df)}")
        
        # 保存为CSV以便进一步分析
        csv_file = "/Users/alex/Desktop/IT Program/QX Net next js/qx-net-nextjs-new/anzsic_data.csv"
        df.to_csv(csv_file, index=False)
        print(f"\nData saved to: {csv_file}")
        
        # 尝试识别数据结构
        print("\nData types:")
        print(df.dtypes)
        
        # 显示一些统计信息
        print("\nData description:")
        print(df.describe(include='all'))
        
        return df
        
    except Exception as e:
        print(f"Error reading Excel file: {str(e)}")
        return None

if __name__ == "__main__":
    df = read_anzsic_excel()