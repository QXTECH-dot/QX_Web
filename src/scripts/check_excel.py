import pandas as pd
import os

def check_excel_structure():
    """检查Excel文件的结构"""
    excel_path = os.path.join('QX Net company data', 'QX Net next js.xlsx')
    
    # 读取所有sheet
    excel_file = pd.ExcelFile(excel_path)
    
    # 检查每个sheet的结构
    for sheet_name in excel_file.sheet_names:
        print(f"\n{sheet_name} 表的列名:")
        df = pd.read_excel(excel_file, sheet_name)
        print(list(df.columns))
        print(f"数据行数: {len(df)}")
        print("-" * 50)

if __name__ == "__main__":
    check_excel_structure() 