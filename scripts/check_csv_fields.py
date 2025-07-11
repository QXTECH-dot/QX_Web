import pandas as pd
import os

def check_csv_fields():
    """
    检查CSV文件中的字段
    """
    # 设置CSV文件路径
    desktop = os.path.expanduser('~/Desktop')
    csv_file = os.path.join(desktop, 'QX Web数据库', 'companies_with_slug_20250710_150306.csv')
    
    if not os.path.exists(csv_file):
        print(f"错误: 找不到CSV文件 {csv_file}")
        return
    
    print(f"正在读取CSV文件: {csv_file}")
    
    # 尝试不同编码读取CSV
    encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
    df = None
    
    for encoding in encodings:
        try:
            df = pd.read_csv(csv_file, encoding=encoding)
            print(f"成功使用 {encoding} 编码读取文件")
            break
        except UnicodeDecodeError:
            continue
    
    if df is None:
        print("错误: 无法读取CSV文件")
        return
    
    print(f"\n=== CSV文件信息 ===")
    print(f"总记录数: {len(df)}")
    print(f"总字段数: {len(df.columns)}")
    
    print(f"\n=== 所有字段列表 ===")
    for i, col in enumerate(df.columns, 1):
        print(f"{i:2d}. {col}")
    
    # 检查关键字段
    key_fields = ['companyId', 'document_id', 'name_en', 'slug', 'fullDescription', 'shortDescription']
    print(f"\n=== 关键字段检查 ===")
    for field in key_fields:
        if field in df.columns:
            non_null_count = df[field].notna().sum()
            print(f"✅ {field}: 存在 ({non_null_count}/{len(df)} 非空)")
            
            # 显示前3个示例值
            sample_values = df[field].dropna().head(3).tolist()
            print(f"   示例值: {sample_values}")
        else:
            print(f"❌ {field}: 不存在")
    
    # 检查companyId字段的具体情况
    if 'companyId' in df.columns:
        print(f"\n=== companyId字段详细信息 ===")
        companyId_series = df['companyId']
        print(f"总数: {len(companyId_series)}")
        print(f"非空数: {companyId_series.notna().sum()}")
        print(f"空值数: {companyId_series.isna().sum()}")
        print(f"唯一值数: {companyId_series.nunique()}")
        
        # 显示前10个值
        print(f"前10个值:")
        for i, val in enumerate(companyId_series.head(10)):
            print(f"  {i+1}. {val}")

if __name__ == '__main__':
    check_csv_fields() 