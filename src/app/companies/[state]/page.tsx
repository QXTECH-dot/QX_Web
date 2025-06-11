'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 州名映射
const stateMapping: { [key: string]: string } = {
  'nsw': 'NSW',
  'vic': 'VIC', 
  'qld': 'QLD',
  'wa': 'WA',
  'sa': 'SA',
  'tas': 'TAS',
  'act': 'ACT',
  'nt': 'NT'
};

export default function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  useEffect(() => {
    const stateParam = resolvedParams.state.toLowerCase();
    const stateCode = stateMapping[stateParam] || stateParam.toUpperCase();
    
    // 重定向到主公司列表页，并添加location参数
    router.replace(`/companies?location=${stateCode}`);
  }, [resolvedParams.state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Redirecting...</h2>
        <p className="text-gray-600">Loading companies in {resolvedParams.state.toUpperCase()}...</p>
      </div>
    </div>
  );
} 