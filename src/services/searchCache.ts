import { Company } from '@/types/company';
import { SearchParams } from '@/components/search/SearchUtils';

const CACHE_EXPIRY = 5 * 60 * 1000; // 5分钟过期
const MAX_CACHE_SIZE = 100;

interface CacheItem {
  results: Company[];
  timestamp: number;
}

class SearchCache {
  private cache: Map<string, CacheItem> = new Map();

  private getCacheKey(params: SearchParams): string {
    return JSON.stringify(params);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > CACHE_EXPIRY) {
        this.cache.delete(key);
      }
    }

    // 如果缓存仍然太大，删除最旧的条目
    if (this.cache.size > MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toDelete = entries.slice(0, entries.length - MAX_CACHE_SIZE);
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }

  get(params: SearchParams): Company[] | null {
    this.cleanup();
    const key = this.getCacheKey(params);
    const item = this.cache.get(key);
    
    if (item && Date.now() - item.timestamp <= CACHE_EXPIRY) {
      return item.results;
    }
    
    return null;
  }

  set(params: SearchParams, results: Company[]) {
    this.cleanup();
    const key = this.getCacheKey(params);
    this.cache.set(key, {
      results,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

export const searchCache = new SearchCache(); 