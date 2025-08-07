import pandas as pd
import re
import os
from datetime import datetime

def generate_slug(company_name):
    """
    根据公司名称生成URL友好的slug
    """
    if not company_name or pd.isna(company_name):
        return ''
    
    # 转换为字符串并处理
    name = str(company_name).strip()
    
    # 转换为小写
    slug = name.lower()
    
    # 移除常见的公司后缀词汇（可选）
    common_suffixes = [
        'pty ltd', 'pty. ltd.', 'ltd', 'limited', 'inc', 'incorporated', 
        'corp', 'corporation', 'co', 'company', 'llc', 'llp', 'lp'
    ]
    
    # 移除特殊字符，只保留字母、数字、空格和连字符
    slug = re.sub(r'[^a-z0-9\s\-]', '', slug)
    
    # 将多个空格替换为单个空格
    slug = re.sub(r'\s+', ' ', slug)
    
    # 将空格替换为连字符
    slug = slug.replace(' ', '-')
    
    # 将多个连字符替换为单个连字符
    slug = re.sub(r'-+', '-', slug)
    
    # 移除首尾的连字符
    slug = slug.strip('-')
    
    # 如果slug为空，使用默认值
    if not slug:
        slug = 'company'
    
    return slug

def generate_unique_slug(base_slug, existing_slugs):
    """
    生成唯一的slug，如果存在冲突则添加数字后缀
    """
    if base_slug not in existing_slugs:
        return base_slug
    
    counter = 2
    while f"{base_slug}-{counter}" in existing_slugs:
        counter += 1
    
    return f"{base_slug}-{counter}"

def add_slug_to_csv(input_file=None, output_file=None):
    """
    为CSV文件中的公司数据添加slug字段
    """
    try:
        # 设置默认输入文件路径
        if input_file is None:
            desktop = os.path.expanduser('~/Desktop')
            input_file = os.path.join(desktop, 'QX Web数据库', 'companies_export_20250710_142825.csv')
        
        # 检查输入文件是否存在
        if not os.path.exists(input_file):
            print(f"错误: 找不到输入文件 {input_file}")
            return
        
        # 设置输出文件路径
        if output_file is None:
            desktop = os.path.expanduser('~/Desktop')
            export_dir = os.path.join(desktop, 'QX Web数据库')
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            output_file = os.path.join(export_dir, f'companies_with_slug_{timestamp}.csv')
        
        print(f"正在读取文件: {input_file}")
        
        # 尝试不同的编码格式读取CSV文件
        encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
        df = None
        
        for encoding in encodings:
            try:
                print(f"尝试使用 {encoding} 编码读取文件...")
                df = pd.read_csv(input_file, encoding=encoding)
                print(f"成功使用 {encoding} 编码读取文件")
                break
            except UnicodeDecodeError:
                continue
        
        if df is None:
            print("错误: 无法读取CSV文件，尝试了多种编码格式都失败")
            return
        
        print(f"找到 {len(df)} 条公司记录")
        
        # 检查是否有name_en字段
        if 'name_en' not in df.columns:
            print("错误: CSV文件中没有找到 'name_en' 字段")
            print(f"可用字段: {', '.join(df.columns)}")
            return
        
        # 生成slug
        print("正在生成slug...")
        existing_slugs = set()
        slugs = []
        
        for index, row in df.iterrows():
            company_name = row.get('name_en', '')
            
            # 如果name_en为空，尝试使用name字段
            if pd.isna(company_name) or str(company_name).strip() == '':
                company_name = row.get('name', '')
            
            # 生成基础slug
            base_slug = generate_slug(company_name)
            
            # 生成唯一slug
            unique_slug = generate_unique_slug(base_slug, existing_slugs)
            existing_slugs.add(unique_slug)
            slugs.append(unique_slug)
            
            # 显示进度
            if (index + 1) % 100 == 0:
                print(f"已处理 {index + 1}/{len(df)} 条记录")
        
        # 添加slug列到DataFrame
        df['slug'] = slugs
        
        # 保存到新的CSV文件
        df.to_csv(output_file, index=False, encoding='utf-8')
        
        print(f"成功生成slug并保存到: {output_file}")
        
        # 显示一些示例
        print("\n--- 生成的slug示例 ---")
        sample_data = df[['name_en', 'slug']].head(10)
        for _, row in sample_data.iterrows():
            print(f"{row['name_en']} -> {row['slug']}")
        
        # 统计信息
        print(f"\n--- 统计信息 ---")
        print(f"总记录数: {len(df)}")
        print(f"生成的唯一slug数: {len(set(slugs))}")
        print(f"重复slug数: {len(slugs) - len(set(slugs))}")
        
        # 检查是否有重复的slug
        duplicate_slugs = df[df.duplicated(['slug'], keep=False)]
        if not duplicate_slugs.empty:
            print(f"发现 {len(duplicate_slugs)} 条记录有重复的slug:")
            print(duplicate_slugs[['name_en', 'slug']].head())
        
    except Exception as e:
        print(f"处理过程中出错: {str(e)}")
        import traceback
        traceback.print_exc()

def main():
    """
    主函数
    """
    print("=== 公司数据Slug生成器 ===")
    print("此脚本将为公司数据生成URL友好的slug")
    print()
    
    # 可以在这里指定自定义的输入和输出文件路径
    input_file = None  # 使用默认路径
    output_file = None  # 使用默认路径
    
    add_slug_to_csv(input_file, output_file)

if __name__ == '__main__':
    main() 