import os
import pandas as pd
from firebase_admin import credentials, initialize_app, storage
import re
from difflib import SequenceMatcher
from collections import defaultdict
import tempfile
from process_logo import process_logo
            
        # 初始化Firebase
cred = credentials.Certificate("QX Net company data/qx-net-next-js-firebase-adminsdk-fbsvc-2cc9fc9468.json")
initialize_app(cred, {
    'storageBucket': 'qx-net-next-js.firebasestorage.app'
})

# 获取Firebase Storage bucket
bucket = storage.bucket()

def clean_company_name(name):
    """清理公司名称，移除特殊字符和空格"""
    # 移除文件扩展名
    name = re.sub(r'\.(jpg|jpeg|png|gif)$', '', name, flags=re.IGNORECASE)
    # 移除_logo后缀
    name = re.sub(r'_logo$', '', name, flags=re.IGNORECASE)
    # 移除特殊字符
    name = re.sub(r'[^a-zA-Z0-9\s]', '', name)
    # 转换为小写并移除多余空格
    name = name.lower().strip()
    
    # 处理特殊情况
    special_cases = {
        'livecomfy pty ltd': 'livecomfy',
        'romo design pty ltd': 'romodesign',
        'aih group pty ltd': 'aihgroup',
        'cai lawyers pty ltd': 'cailawyers',
        'architest pty ltd': 'architest',
        'allseasonsspeed lending': 'allseasonsrealty',
        'dahlsens echuca trade': 'dahlsenswaggawaggatrade'
    }
    
    if name in special_cases:
        return special_cases[name]
    
    return name

def calculate_similarity(str1, str2):
    """计算两个字符串的相似度"""
    return SequenceMatcher(None, str1, str2).ratio()

def find_best_match(logo_name, company_names):
    """找到最匹配的公司名称"""
    best_match = None
    best_score = 0
    
    for company_name in company_names:
        score = calculate_similarity(logo_name, company_name)
        if score > best_score:
            best_score = score
            best_match = company_name
            
    return best_match, best_score

def upload_logo_to_firebase(local_path, company_name):
    """上传logo到Firebase Storage"""
    try:
        # 创建临时文件以处理logo
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
            temp_path = temp_file.name
        
        # 处理logo为1:1比例
        processed_path = process_logo(local_path, temp_path, size=(300, 300))
        if not processed_path:
            print(f"处理logo失败 {company_name}")
            if os.path.exists(temp_path):
                os.remove(temp_path)
            return None
        
        # 生成存储路径
        storage_path = f"company-logos/{company_name}.png"  # 统一使用PNG格式
        
        # 上传处理后的文件
        blob = bucket.blob(storage_path)
        blob.upload_from_filename(processed_path)
        
        # 删除临时文件
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        # 生成公开URL
        url = f"https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/{storage_path.replace('/', '%2F')}?alt=media"
        return url
    except Exception as e:
        print(f"上传logo失败 {company_name}: {str(e)}")
        # 清理临时文件
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        return None

def main():
    # 桌面路径
    desktop_path = "/Users/alex/Desktop"
    logo_dir = os.path.join(desktop_path, "logo_image")
    csv_path = os.path.join(desktop_path, "QX_Net_company_data.csv")
    
    # 读取CSV文件
    df = pd.read_csv(csv_path)
    
    # 创建公司名称列表（清理后的）
    company_names = [clean_company_name(name) for name in df['name_en']]
    
    # 创建logo文件列表
    logo_files = {}
    for filename in os.listdir(logo_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            clean_name = clean_company_name(filename)
            logo_files[clean_name] = os.path.join(logo_dir, filename)
    
    # 记录未匹配的logo
    unmatched_logos = []
    matched_logos = []
    
    # 更新CSV中的logo URL
    for index, row in df.iterrows():
        company_name = clean_company_name(row['name_en'])
        if company_name in logo_files:
            # 精确匹配
            logo_url = upload_logo_to_firebase(logo_files[company_name], company_name)
            if logo_url:
                df.at[index, 'logo'] = logo_url
                print(f"已更新 {row['name_en']} 的logo URL (精确匹配)")
                matched_logos.append((company_name, company_name, 1.0))
        else:
            # 模糊匹配
            best_match, similarity = find_best_match(company_name, logo_files.keys())
            if similarity > 0.7:  # 相似度阈值
                logo_url = upload_logo_to_firebase(logo_files[best_match], company_name)
                if logo_url:
                    df.at[index, 'logo'] = logo_url
                    print(f"已更新 {row['name_en']} 的logo URL (模糊匹配，相似度: {similarity:.2f})")
                    matched_logos.append((company_name, best_match, similarity))
            else:
                unmatched_logos.append((company_name, best_match, similarity))
    
    # 保存更新后的CSV
    df.to_csv(csv_path, index=False)
    
    # 打印匹配结果报告
    print("\n=== 匹配结果报告 ===")
    print(f"\n已匹配的logo数量: {len(matched_logos)}")
    print("\n未匹配的logo:")
    for company_name, best_match, similarity in unmatched_logos:
        print(f"公司名称: {company_name}")
        print(f"最相似logo: {best_match} (相似度: {similarity:.2f})")
        print("---")
    
    print("\n所有logo已上传并更新到CSV文件")

if __name__ == "__main__":
    main() 