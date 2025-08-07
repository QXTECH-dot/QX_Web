import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
import os

# 初始化Firebase
cred = credentials.Certificate('firebase-admin-key.json')
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

# 读取Excel文件Services sheet
excel_path = os.path.join('QX Net company data', 'QX Net next js.xlsx')
df = pd.read_excel(excel_path, sheet_name='Services')

# 过滤掉所有Unnamed列
df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

# 清空services集合
services_ref = db.collection('services')
# 批量删除所有旧文档
print('正在清空原有services集合...')
for doc in services_ref.stream():
    doc.reference.delete()
print('原有services集合已清空。')

# 批量上传新数据
print('正在上传新services数据...')
batch = db.batch()
count = 0
for idx, row in df.iterrows():
    service_id = str(row.get('serviceId') or row.get('serviceID') or row.get('ServiceId') or row.get('ServiceID'))
    if not service_id or service_id == 'nan':
        continue  # 跳过无效ID
    data = {k: (v if pd.notna(v) else None) for k, v in row.items() if not k.startswith('Unnamed')}
    doc_ref = services_ref.document(service_id)
    batch.set(doc_ref, data)
    count += 1
    # Firestore批处理限制500，分批提交
    if count % 500 == 0:
        batch.commit()
        batch = db.batch()
if count % 500 != 0:
    batch.commit()
print(f'上传完成，共上传{count}条服务数据。') 