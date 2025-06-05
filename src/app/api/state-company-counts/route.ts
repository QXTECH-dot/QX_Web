import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

// 州缩写映射
const stateShortMap: Record<string, string> = {
  'new-south-wales': 'NSW',
  'victoria': 'VIC',
  'queensland': 'QLD',
  'western-australia': 'WA',
  'south-australia': 'SA',
  'tasmania': 'TAS',
  'northern-territory': 'NT',
  'australian-capital-territory': 'ACT',
};

export async function GET() {
  // 1. 查询所有offices
  const officesSnapshot = await getDocs(collection(db, 'offices'));
  // 2. 构建 state -> Set<companyId> 映射
  const stateCompanyMap: Record<string, Set<string>> = {};
  officesSnapshot.forEach(doc => {
    const data = doc.data();
    const state = data.state;
    const companyId = data.companyId;
    if (!state || !companyId) return;
    // 兼容缩写和全名
    let stateKey = state;
    if (stateShortMap[state]) {
      stateKey = stateShortMap[state];
    } else if (Object.values(stateShortMap).includes(state)) {
      stateKey = state;
    }
    if (!stateCompanyMap[stateKey]) stateCompanyMap[stateKey] = new Set();
    stateCompanyMap[stateKey].add(companyId);
  });
  // 3. 统计每个州的公司数量
  const result: Record<string, number> = {};
  Object.keys(stateCompanyMap).forEach(state => {
    result[state] = stateCompanyMap[state].size;
  });
  return NextResponse.json(result);
} 