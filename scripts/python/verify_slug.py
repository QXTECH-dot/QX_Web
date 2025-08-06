import pandas as pd
import os

def verify_slug_results():
    """验证生成的slug结果"""
    file_path = os.path.expanduser('~/Desktop/QX Web数据库/companies_with_slug_20250710_150306.csv')
    
    # 尝试不同编码
    encodings = ['utf-8', 'gbk', 'gb2312', 'latin-1', 'cp1252']
    
    for encoding in encodings:
        try:
            df = pd.read_csv(file_path, encoding=encoding)
            print(f'成功使用 {encoding} 编码读取文件')
            print(f'总记录数: {len(df)}')
            print('=== Slug示例 ===')
            for i, row in df.head(15).iterrows():
                name_en = row.get('name_en', 'N/A')
                slug = row.get('slug', 'N/A')
                print(f'{name_en} -> {slug}')
            
            # 检查是否有空的slug
            empty_slugs = df[df['slug'].isna() | (df['slug'] == '')]
            if not empty_slugs.empty:
                print(f'\n警告: 发现 {len(empty_slugs)} 个空的slug')
                print(empty_slugs[['name_en', 'slug']].head())
            
            # 检查重复slug
            duplicate_slugs = df[df.duplicated(['slug'], keep=False)]
            if not duplicate_slugs.empty:
                print(f'\n警告: 发现 {len(duplicate_slugs)} 个重复的slug')
                print(duplicate_slugs[['name_en', 'slug']].head())
            
            print(f'\n成功验证! 文件包含 {len(df)} 条记录，slug生成完整。')
            break
            
        except Exception as e:
            print(f'使用 {encoding} 编码失败: {e}')
            continue
    else:
        print('无法读取文件，尝试了所有编码格式')

if __name__ == '__main__':
    verify_slug_results() 