import os
import pandas as pd
from firebase_admin import credentials, initialize_app, storage
import re

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
    return name

def upload_logo_to_firebase(local_path, company_name):
    """上传logo到Firebase Storage"""
    try:
        # 生成存储路径
        storage_path = f"company-logos/{company_name}.{local_path.split('.')[-1]}"
        
        # 上传文件
        blob = bucket.blob(storage_path)
        blob.upload_from_filename(local_path)
        
        # 生成公开URL
        url = f"https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/{storage_path.replace('/', '%2F')}?alt=media"
        return url
    except Exception as e:
        print(f"上传logo失败 {company_name}: {str(e)}")
        return None

def main():
    # 桌面路径
    desktop_path = "/Users/alex/Desktop"
    logo_dir = os.path.join(desktop_path, "logo_image")
    csv_path = os.path.join(desktop_path, "QX_Net_company_data.csv")
    
    # 读取CSV文件
    df = pd.read_csv(csv_path)
    
    # 创建公司名称到logo文件的映射
    logo_files = {}
    for filename in os.listdir(logo_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            clean_name = clean_company_name(filename)
            logo_files[clean_name] = os.path.join(logo_dir, filename)
    
    # 更新CSV中的logo URL
    for index, row in df.iterrows():
        company_name = clean_company_name(row['name_en'])
        if company_name in logo_files:
            logo_url = upload_logo_to_firebase(logo_files[company_name], company_name)
            if logo_url:
                df.at[index, 'logo'] = logo_url
                print(f"已更新 {row['name_en']} 的logo URL")
    
    # 保存更新后的CSV
    df.to_csv(csv_path, index=False)
    print("所有logo已上传并更新到CSV文件")

if __name__ == "__main__":
    main() 