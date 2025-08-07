import pandas as pd

# 读取Excel文件
file_path = r"D:\IT 软件程序\qx-net-cursor-new\QX Net company data\australian-industry-classification-csv.xlsx"
try:
    df = pd.read_excel(file_path)
    print("\nExcel文件内容预览:")
    print(df.head())
    print("\n列名:")
    print(df.columns.tolist())
    print("\n数据形状:", df.shape)
except Exception as e:
    print(f"读取文件时出错: {str(e)}") 