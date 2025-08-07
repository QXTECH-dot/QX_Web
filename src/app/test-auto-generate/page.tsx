'use client';

import React, { useState } from 'react';

export default function TestAutoGenerate() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAutoGenerate = async (industryName: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log(`🔄 测试为行业 "${industryName}" 生成服务...`);
      
      const apiUrl = `/api/services-by-industry/?popular_name=${encodeURIComponent(industryName)}`;
      console.log('📡 API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('📡 响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📡 API结果:', data);
      
      setResult(data);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '未知错误';
      console.error('❌ 测试失败:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const industries = ['Beauty', 'Electrician', 'Legal Services', 'IT Services & Web Development'];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">测试 Auto Generate Services 功能</h1>
      
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold">选择行业测试：</h2>
        <div className="flex gap-2 flex-wrap">
          {industries.map(industry => (
            <button
              key={industry}
              onClick={() => testAutoGenerate(industry)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '测试中...' : `测试 ${industry}`}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded mb-4">
          <h3 className="font-bold text-red-800">错误:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-green-100 border border-green-300 rounded">
          <h3 className="font-bold text-green-800 mb-2">API 结果:</h3>
          <div className="space-y-2">
            <p><strong>成功:</strong> {result.success ? '是' : '否'}</p>
            <p><strong>服务数量:</strong> {result.count || 0}</p>
            {result.data && result.data.length > 0 && (
              <div>
                <strong>服务列表:</strong>
                <ul className="mt-2 space-y-1">
                  {result.data.slice(0, 5).map((service: any, index: number) => (
                    <li key={index} className="text-sm">
                      • {service.service_name}: {service.service_description}
                    </li>
                  ))}
                  {result.data.length > 5 && (
                    <li className="text-sm text-gray-600">... 还有 {result.data.length - 5} 个服务</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          
          <details className="mt-4">
            <summary className="cursor-pointer font-medium">完整 JSON 响应</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}