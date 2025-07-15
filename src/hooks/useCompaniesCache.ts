"use client";

import { useState, useEffect } from 'react';
import { Company } from '@/types/company';

interface CacheEntry {
  data: Company[];
  total: number;
  totalPages: number;
  timestamp: number;
  filters: Record<string, any>;
}

interface CompaniesCache {
  [key: string]: CacheEntry;
}

// 缓存时间 - 5分钟
const CACHE_DURATION = 5 * 60 * 1000;
// 最大缓存条目数
const MAX_CACHE_ENTRIES = 50;

class CompaniesDataCache {
  private cache: CompaniesCache = {};

  // 生成缓存键
  private generateCacheKey(params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          result[key] = params[key];
        }
        return result;
      }, {} as Record<string, any>);
    
    return JSON.stringify(sortedParams);
  }

  // 检查缓存是否有效
  private isValidCache(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  }

  // 清理过期缓存
  private cleanExpiredCache(): void {
    const now = Date.now();
    const keys = Object.keys(this.cache);
    
    keys.forEach(key => {
      if (now - this.cache[key].timestamp > CACHE_DURATION) {
        delete this.cache[key];
      }
    });

    // 如果缓存条目太多，删除最旧的条目
    const remainingKeys = Object.keys(this.cache);
    if (remainingKeys.length > MAX_CACHE_ENTRIES) {
      const sortedKeys = remainingKeys.sort((a, b) => 
        this.cache[a].timestamp - this.cache[b].timestamp
      );
      
      const keysToDelete = sortedKeys.slice(0, remainingKeys.length - MAX_CACHE_ENTRIES);
      keysToDelete.forEach(key => delete this.cache[key]);
    }
  }

  // 获取缓存数据
  get(params: Record<string, any>): CacheEntry | null {
    this.cleanExpiredCache();
    
    const key = this.generateCacheKey(params);
    const entry = this.cache[key];
    
    if (entry && this.isValidCache(entry)) {
      console.log('🎯 Cache hit for:', key);
      return entry;
    }
    
    console.log('❌ Cache miss for:', key);
    return null;
  }

  // 设置缓存数据
  set(params: Record<string, any>, data: Company[], total: number, totalPages: number): void {
    this.cleanExpiredCache();
    
    const key = this.generateCacheKey(params);
    this.cache[key] = {
      data,
      total,
      totalPages,
      timestamp: Date.now(),
      filters: { ...params }
    };
    
    console.log('💾 Cached data for:', key);
  }

  // 清空所有缓存
  clear(): void {
    this.cache = {};
    console.log('🗑️ Cache cleared');
  }

  // 获取缓存统计
  getStats(): { size: number; keys: string[] } {
    return {
      size: Object.keys(this.cache).length,
      keys: Object.keys(this.cache)
    };
  }
}

// 全局缓存实例
const companiesCache = new CompaniesDataCache();

export function useCompaniesCache() {
  const [cacheStats, setCacheStats] = useState({ size: 0, keys: [] });

  const updateStats = () => {
    setCacheStats(companiesCache.getStats());
  };

  useEffect(() => {
    updateStats();
  }, []);

  return {
    get: (params: Record<string, any>) => {
      const result = companiesCache.get(params);
      updateStats();
      return result;
    },
    set: (params: Record<string, any>, data: Company[], total: number, totalPages: number) => {
      companiesCache.set(params, data, total, totalPages);
      updateStats();
    },
    clear: () => {
      companiesCache.clear();
      updateStats();
    },
    stats: cacheStats
  };
}