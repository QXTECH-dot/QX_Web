import { SearchParams } from '@/components/search/SearchUtils';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  params: SearchParams;
  timestamp: number;
}

export const saveSearchHistory = (params: SearchParams) => {
  try {
    const history = getSearchHistory();
    const newItem: SearchHistoryItem = {
      params,
      timestamp: Date.now()
    };

    // 移除重复的搜索
    const filteredHistory = history.filter(
      item => JSON.stringify(item.params) !== JSON.stringify(params)
    );

    // 添加新的搜索记录到开头
    filteredHistory.unshift(newItem);

    // 限制历史记录数量
    const limitedHistory = filteredHistory.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Failed to save search history:', error);
  }
};

export const getSearchHistory = (): SearchHistoryItem[] => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to get search history:', error);
    return [];
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear search history:', error);
  }
}; 