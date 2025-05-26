import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// 读取service account密钥
const keyPath = path.resolve(process.cwd(), 'firebase-admin-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

function fuzzyMatch(str: string, query: string) {
  return str.toLowerCase().includes(query.toLowerCase());
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const query = (req.query.query as string) || '';
    // 1. 获取companies集合的相关字段
    const companiesSnapshot = await db.collection('companies').get();
    const industrySet = new Set<string>();
    companiesSnapshot.forEach(doc => {
      const data = doc.data();
      // industry 可能是数组或字符串
      if (data.industry) {
        if (Array.isArray(data.industry)) {
          data.industry.forEach((i: string) => i && industrySet.add(i));
        } else if (typeof data.industry === 'string') {
          // 兼容字符串形式的数组
          try {
            const arr = JSON.parse(data.industry);
            if (Array.isArray(arr)) {
              arr.forEach((i: string) => i && industrySet.add(i));
            } else {
              industrySet.add(data.industry);
            }
          } catch {
            industrySet.add(data.industry);
          }
        }
      }
      if (data.second_industry) industrySet.add(data.second_industry);
      if (data.third_industry) industrySet.add(data.third_industry);
    });

    // 2. 获取services集合的title
    const servicesSnapshot = await db.collection('services').get();
    servicesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.title) industrySet.add(data.title);
    });

    let allOptions = Array.from(industrySet).filter(Boolean);
    // 3. 如果有query参数，做后端模糊搜索
    if (query.trim()) {
      allOptions = allOptions.filter(opt => fuzzyMatch(opt, query));
    }

    res.status(200).json({ options: allOptions });
  } catch (err) {
    console.error('Error fetching industry/services options:', err);
    res.status(500).json({ error: 'Failed to fetch options' });
  }
} 