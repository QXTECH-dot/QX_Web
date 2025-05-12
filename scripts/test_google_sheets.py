import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def initialize_google_sheets():
    try:
        # 使用Google Sheets API的认证范围
        scope = ['https://spreadsheets.google.com/feeds',
                'https://www.googleapis.com/auth/drive']
        
        # 从环境变量或配置文件中获取Google Sheets的凭据
        creds = ServiceAccountCredentials.from_json_keyfile_name('google-sheets-credentials.json', scope)
        client = gspread.authorize(creds)
        return client
    except Exception as e:
        logging.error(f"Google Sheets初始化失败: {str(e)}")
        raise

def get_sheet_data(client, spreadsheet_id, sheet_name):
    try:
        # 打开指定的电子表格
        spreadsheet = client.open_by_key(spreadsheet_id)
        # 选择指定的工作表
        worksheet = spreadsheet.worksheet(sheet_name)
        # 获取所有数据
        data = worksheet.get_all_records()
        # 转换为DataFrame
        return pd.DataFrame(data)
    except Exception as e:
        logging.error(f"获取工作表数据失败: {str(e)}")
        raise

def main():
    try:
        # 初始化 Google Sheets
        logging.info("正在初始化Google Sheets...")
        gs_client = initialize_google_sheets()
        
        # 从Google Sheets读取数据
        spreadsheet_id = "1GH8cvqtJOqYSi8RPhXIP5QRh2Hh7-sdrTwxNrXYwL9Q"
        
        # 获取所有工作表
        spreadsheet = gs_client.open_by_key(spreadsheet_id)
        worksheets = spreadsheet.worksheets()
        
        logging.info(f"找到 {len(worksheets)} 个工作表:")
        for worksheet in worksheets:
            logging.info(f"- {worksheet.title}")
            
            # 读取每个工作表的前5行数据
            data = worksheet.get_all_records()
            df = pd.DataFrame(data)
            logging.info(f"工作表 '{worksheet.title}' 的数据预览:")
            logging.info(df.head())
            logging.info("\n")
            
    except Exception as e:
        logging.error(f"读取数据时出错：{str(e)}")
        raise

if __name__ == "__main__":
    main() 