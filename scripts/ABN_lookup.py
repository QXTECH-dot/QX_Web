#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
ABN Lookup Script
This script searches companies by keywords and saves their information.
"""

import json
import pandas as pd
import requests
import logging
import re
from typing import Dict, List, Optional
from datetime import datetime
import time
from pathlib import Path
import os

class ABNLookup:
    def __init__(self, guid: str):
        self.guid = guid
        self.base_url = "https://abr.business.gov.au/json"
        self.session = requests.Session()
        self.results = []
        self.processed_abns = set()  # 用于跟踪已处理的ABN
        
    def _parse_jsonp(self, jsonp_str: str) -> Dict:
        """解析JSONP响应为JSON对象"""
        try:
            json_str = re.search(r'callback\((.*)\)', jsonp_str).group(1)
            return json.loads(json_str)
        except Exception as e:
            logging.error(f"Error parsing JSONP response: {str(e)}")
            return None

    def search_by_name(self, name: str) -> Optional[List[Dict]]:
        """使用公司名称搜索"""
        try:
            url = f"{self.base_url}/MatchingNames.aspx"
            params = {
                "name": name,
                "guid": self.guid,
                "maxResults": 100  # 获取最多结果
            }
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            data = self._parse_jsonp(response.text)
            if data and isinstance(data, dict) and "Message" in data and data["Message"]:
                logging.error(f"API Error for name search '{name}': {data['Message']}")
                return None
            
            return data.get('Names', []) if data else None
        except Exception as e:
            logging.error(f"Error searching name '{name}': {str(e)}")
            return None

    def get_abn_details(self, abn: str) -> Optional[Dict]:
        """获取ABN详细信息"""
        try:
            url = f"{self.base_url}/AbnDetails.aspx"
            params = {
                "abn": abn,
                "guid": self.guid
            }
            response = self.session.get(url, params=params)
            response.raise_for_status()
            
            data = self._parse_jsonp(response.text)
            if data and "Message" in data and data["Message"]:
                logging.error(f"API Error for ABN {abn}: {data['Message']}")
                return None
            
            return data
        except Exception as e:
            logging.error(f"Error getting ABN details for {abn}: {str(e)}")
            return None

    def _is_duplicate(self, abn: str) -> bool:
        """检查ABN是否已经处理过"""
        return abn in self.processed_abns
        
    def search_by_industry(self, keywords: List[str], delay: float = 1.0, output_dir: str = None):
        """按行业关键词搜索公司"""
        total_matches = 0
        total_unique = 0
        duplicates = 0
        inactive = 0
        
        for i, keyword in enumerate(keywords, 1):
            logging.info(f"Searching for keyword: {keyword} ({i}/{len(keywords)})")
            
            # 搜索匹配的公司
            matches = self.search_by_name(keyword)
            if not matches:
                logging.warning(f"No matches found for keyword: {keyword}")
                continue
            
            total_matches += len(matches)
            logging.info(f"Found {len(matches)} matches for '{keyword}'")
            initial_results_count = len(self.results)
            
            # 获取每个公司的详细信息
            for j, match in enumerate(matches, 1):
                abn = match.get('Abn')
                if not abn:
                    continue
                    
                # 检查是否已处理过这个ABN
                if self._is_duplicate(abn):
                    duplicates += 1
                    if j % 10 == 0:
                        logging.info(f"Processed {j}/{len(matches)} companies for '{keyword}' (Unique: {total_unique}, Duplicates: {duplicates}, Inactive: {inactive})")
                    continue
                
                details = self.get_abn_details(abn)
                if details:
                    # 只保存Active状态的公司
                    if details.get('AbnStatus') != 'Active':
                        inactive += 1
                        continue
                        
                    # 添加搜索关键词和时间戳
                    details['SearchKeyword'] = keyword
                    details['QueryTime'] = datetime.now().isoformat()
                    self.results.append(details)
                    self.processed_abns.add(abn)
                    total_unique += 1
                
                # 显示进度
                if j % 10 == 0:
                    logging.info(f"Processed {j}/{len(matches)} companies for '{keyword}' (Unique: {total_unique}, Duplicates: {duplicates}, Inactive: {inactive})")
                
                time.sleep(delay)  # 避免请求过快
            
            # 显示当前关键词的结果统计
            new_results = len(self.results) - initial_results_count
            logging.info(f"Added {new_results} new unique active results for keyword '{keyword}'")
            
            # 每完成一个关键词就保存一次结果
            if output_dir:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                output_file = f"{output_dir}/industry_search_{keyword.lower()}_{timestamp}.xlsx"
                self.save_to_excel(output_file)
                logging.info(f"Saved intermediate results after processing '{keyword}'")
        
        # 显示最终统计信息
        logging.info(f"""
Search completed:
- Total matches found: {total_matches}
- Unique active companies: {total_unique}
- Duplicates skipped: {duplicates}
- Inactive companies skipped: {inactive}
- Total processed: {total_matches}
""")

    def save_to_excel(self, filename: str):
        """将结果保存到Excel文件"""
        if not self.results:
            logging.warning("No results to save")
            return
        
        try:
            # 处理结果数据
            processed_results = []
            seen_abns = set()  # 用于Excel文件级别的去重
            
            for result in self.results:
                abn = result.get('Abn')
                if abn in seen_abns:
                    continue
                    
                processed_result = result.copy()
                # 处理BusinessName列表
                if 'BusinessName' in processed_result and isinstance(processed_result['BusinessName'], list):
                    processed_result['BusinessName'] = '; '.join(processed_result['BusinessName'])
                
                # 添加到处理后的结果
                processed_results.append(processed_result)
                seen_abns.add(abn)
            
            # 创建DataFrame并排序
            df = pd.DataFrame(processed_results)
            if not df.empty:
                # 按EntityName排序
                df = df.sort_values(by=['EntityName'], ignore_index=True)
                
                # 重新组织列的顺序
                columns_order = [
                    'Abn', 'EntityName', 'EntityTypeCode', 'EntityTypeName',
                    'AbnStatus', 'AbnStatusEffectiveFrom', 'BusinessName',
                    'AddressState', 'AddressPostcode', 'AddressDate',
                    'Gst', 'Acn', 'SearchKeyword', 'QueryTime'
                ]
                df = df[columns_order]
            
            # 确保输出目录存在
            output_path = Path(filename)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            # 保存Excel文件
            df.to_excel(output_path, index=False)
            logging.info(f"Results saved to {output_path} ({len(df)} unique active records)")
            
            # 保存原始JSON数据作为备份
            json_path = output_path.with_suffix('.json')
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(self.results, f, ensure_ascii=False, indent=2)
            logging.info(f"Raw data saved to {json_path}")
            
        except Exception as e:
            logging.error(f"Error saving results: {str(e)}")

def main():
    # 设置日志记录
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    # 创建查询器
    abn_lookup = ABNLookup("253136de-6266-47f6-a28d-b729867f4b1c")
    
    # 定义要搜索的行业关键词
    industry_keywords = [
        'Logistics',  # 物流
        'Transport',  # 运输
        'Warehouse',  # 仓储
        'Import',     # 进口
        'Export',     # 出口
        'Freight',    # 货运
        'Shipping',   # 航运
        'Storage',    # 储存
        'Distribution', # 配送
        'Supply Chain' # 供应链
    ]
    
    # 设置输出目录
    output_dir = "/Users/alex/Desktop/QX Net/Qixin-Company Profile"
    
    # 确保输出目录存在
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    try:
        # 执行搜索，并传入输出目录用于定期保存
        abn_lookup.search_by_industry(industry_keywords, output_dir=output_dir)
        
        # 最终保存
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"{output_dir}/industry_search_FINAL_{timestamp}.xlsx"
        abn_lookup.save_to_excel(output_file)
        
        logging.info("Process completed successfully")
    except KeyboardInterrupt:
        logging.info("\nProcess interrupted by user. Saving current results...")
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file = f"{output_dir}/industry_search_INTERRUPTED_{timestamp}.xlsx"
        abn_lookup.save_to_excel(output_file)
        logging.info("Partial results saved successfully")

if __name__ == "__main__":
    main() 