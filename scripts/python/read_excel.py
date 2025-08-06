import pandas as pd
import os

def read_excel_file(file_path):
    try:
        # 读取 Excel 文件
        excel_file = pd.ExcelFile(file_path)
        
        # 获取所有工作表名称
        sheet_names = excel_file.sheet_names
        print(f"文件包含以下工作表：{sheet_names}\n")
        
        # 读取并显示每个工作表的内容
        for sheet_name in sheet_names:
            print(f"\n=== 工作表：{sheet_name} ===")
            df = pd.read_excel(file_path, sheet_name=sheet_name)
            print(f"行数：{len(df)}")
            print(f"列数：{len(df.columns)}")
            print("\n前5行数据：")
            print(df.head())
            print("\n列名：")
            print(df.columns.tolist())
            print("\n" + "="*50)
            
    except Exception as e:
        print(f"读取文件时出错：{str(e)}")

if __name__ == "__main__":
    # 文件路径
    file_path = os.path.join("QX Net company data", "QX Net next js.xlsx")
    
    # 检查文件是否存在
    if os.path.exists(file_path):
        read_excel_file(file_path)
    else:
        print(f"文件不存在：{file_path}") 