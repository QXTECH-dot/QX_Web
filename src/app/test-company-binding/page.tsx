'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getCompaniesByUser } from '@/lib/firebase/services/userCompany';
import { getCompanyById } from '@/lib/firebase/services/company';
import { syncFirebaseAuth, getCurrentFirebaseUser } from '@/lib/firebase/auth';

export default function TestCompanyBindingPage() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<string[]>([]);
  const [userCompanies, setUserCompanies] = useState<any[]>([]);
  const [companyDetails, setCompanyDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
    setUserCompanies([]);
    setCompanyDetails([]);
  };

  const testBindingStatus = async () => {
    setLoading(true);
    clearLogs();
    
    try {
      addLog('=== 测试公司绑定状态 ===');
      
      // 检查session状态
      addLog(`Session状态: ${status}`);
      if (status !== 'authenticated') {
        addLog('用户未登录');
        return;
      }

      const userAny = session?.user as any;
      const userEmail = userAny?.email;
      const idToken = (session as any)?.idToken;
      
      addLog(`用户邮箱: ${userEmail}`);
      addLog(`idToken存在: ${!!idToken}`);

      // 尝试Firebase Auth同步
      if (idToken) {
        addLog('尝试Firebase Auth同步...');
        try {
          const firebaseUser = await syncFirebaseAuth(idToken);
          if (firebaseUser) {
            addLog(`Firebase Auth同步成功: ${firebaseUser.uid} (${firebaseUser.email})`);
          } else {
            addLog('Firebase Auth同步失败');
          }
        } catch (error: any) {
          addLog(`Firebase Auth同步错误: ${error.message}`);
        }
      }

      // 检查当前Firebase用户
      const currentUser = getCurrentFirebaseUser();
      addLog(`当前Firebase用户: ${currentUser ? `${currentUser.uid} (${currentUser.email})` : '无'}`);

      // 查询用户绑定的公司 - 使用email查询
      addLog('查询用户绑定的公司...');
      const companies = await getCompaniesByUser(userEmail);
      addLog(`找到 ${companies.length} 个绑定的公司`);
      setUserCompanies(companies);

      if (companies.length > 0) {
        addLog('获取公司详细信息...');
        const details = [];
        for (const userCompany of companies) {
          try {
            const companyDetail = await getCompanyById(userCompany.companyId); // 使用companyId字段名
            if (companyDetail) {
              details.push(companyDetail);
              addLog(`公司详情: ${companyDetail.name || companyDetail.abn} (ID: ${userCompany.companyId})`);
            } else {
              addLog(`警告: 公司ID ${userCompany.companyId} 的详细信息未找到`);
            }
          } catch (error: any) {
            addLog(`获取公司 ${userCompany.companyId} 详情失败: ${error.message}`);
          }
        }
        setCompanyDetails(details);
      } else {
        addLog('用户没有绑定任何公司');
      }

    } catch (error: any) {
      addLog(`测试失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestBinding = async () => {
    if (!session?.user) {
      addLog('用户未登录，无法创建测试绑定');
      return;
    }

    try {
      addLog('=== 创建测试绑定 ===');
      const userAny = session?.user as any;
      const email = userAny?.email;

      const testCompanyData = {
        name: 'QIXIN CO PTY LTD',
        abn: '75671782540',
        industry: 'IT Services'
      };

      addLog(`为用户 ${email} 创建测试绑定...`);
      
      const response = await fetch('/api/companies/bind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyData: testCompanyData,
          email,
          role: 'owner'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        addLog(`测试绑定创建成功: ${JSON.stringify(result.data)}`);
      } else {
        addLog(`测试绑定创建失败: ${result.error}`);
      }
    } catch (error: any) {
      addLog(`创建测试绑定时出错: ${error.message}`);
    }
  };

  const updateCompanyInfo = async () => {
    if (!session?.user) {
      addLog('用户未登录，无法更新公司信息');
      return;
    }

    try {
      addLog('=== 更新公司信息 ===');
      
      if (userCompanies.length === 0) {
        addLog('没有找到绑定的公司，请先创建绑定');
        return;
      }

      const companyId = userCompanies[0].companyId;
      addLog(`更新公司ID: ${companyId}`);

      const updateData = {
        name: 'QIXIN CO PTY LTD',
        shortDescription: '澳大利亚IT服务公司',
        fullDescription: 'QIXIN CO PTY LTD是一家专业的IT服务公司，提供网站开发、云解决方案等服务。',
        industry: 'IT Services',
        website: 'https://qxnet.com.au',
        email: 'info@qxnet.com.au',
        phone: '+61 1234 5678',
        logo: '/companies/qixin-logo.png',
        size: '10-50',
        foundedYear: '2020',
        languages: 'English, Chinese',
        status: 'verified'
      };

      // 直接调用Firebase更新函数
      const { updateCompany } = await import('@/lib/firebase/services/company');
      await updateCompany(companyId, updateData);
      
      addLog(`公司信息更新成功: ${JSON.stringify(updateData)}`);
      addLog('请刷新页面查看更新结果');
      
    } catch (error: any) {
      addLog(`更新公司信息时出错: ${error.message}`);
    }
  };

  const manualCreateBinding = async () => {
    if (!session?.user) {
      addLog('用户未登录，无法创建绑定');
      return;
    }

    try {
      addLog('=== 手动创建绑定记录 ===');
      
      const userAny = session?.user as any;
      const email = userAny?.email;
      
      addLog(`用户邮箱: ${email}`);

      // 直接调用Firebase服务
      const { addDoc, collection, Timestamp, setDoc, doc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase/config');
      
      // 1. 先创建公司记录 - 使用标准的COMP_XXXXX格式
      addLog('创建公司记录...');
      const companyId = 'COMP_00671'; // 使用标准格式
      
      const companyData = {
        name: 'QIXIN CO PTY LTD',
        abn: '75671782540',
        industry: 'IT Services',
        website: 'https://qxnet.com.au',
        email: 'info@qxnet.com.au',
        phone: '+61 1234 5678',
        verifiedEmail: email,
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'verified',
        shortDescription: 'QIXIN CO PTY LTD is a registered business in Australia.',
        foundedYear: '2020'
      };
      
      // 使用固定的公司ID创建公司记录
      await setDoc(doc(db, 'companies', companyId), companyData);
      addLog(`公司记录创建成功: ${companyId}`);
      
      // 2. 创建用户-公司绑定记录 - 使用您偏好的命名格式
      addLog('创建用户-公司绑定记录...');
      const docId = 'COMP_00671_USER'; // 使用您偏好的格式
      
      const bindingData = {
        companyId: companyId,   // 使用companyId字段名保持一致
        email: email,           // 使用email而不是userId
        id: 'COMP_00671_USER01', // 内部ID字段
        role: 'owner',
        createdAt: Timestamp.now()
      };
      
      await setDoc(doc(db, 'user_company', docId), bindingData);
      
      addLog(`绑定记录创建成功: ${docId}`);
      addLog('请刷新页面并重新测试绑定状态');
      
      // 3. 创建邮箱验证记录
      addLog('创建邮箱验证记录...');
      const emailVerificationDoc = await addDoc(collection(db, 'email_verifications'), {
        email: email,
        companyId: companyId,
        verifiedAt: new Date(),
        createdAt: new Date()
      });
      addLog(`邮箱验证记录创建成功: ${emailVerificationDoc.id}`);
      
    } catch (error: any) {
      addLog(`手动创建绑定时出错: ${error.message}`);
      console.error('Error details:', error);
    }
  };

  const checkFirestoreConnection = async () => {
    try {
      addLog('=== 检查Firestore连接 ===');
      
      const { db } = await import('@/lib/firebase/config');
      const { collection, getDocs } = await import('firebase/firestore');
      
      addLog('尝试连接Firestore...');
      
      // 尝试读取一个集合
      const testCollection = collection(db, 'user_company');
      const snapshot = await getDocs(testCollection);
      
      addLog(`连接成功! user_company集合中有 ${snapshot.size} 个文档`);
      
      if (snapshot.size > 0) {
        snapshot.docs.forEach((doc, index) => {
          const data = doc.data();
          addLog(`文档 ${index + 1}: ${doc.id}`);
          addLog(`  数据: ${JSON.stringify(data, null, 2)}`);
          
          // 检查邮箱匹配
          const userAny = session?.user as any;
          const currentEmail = userAny?.email;
          addLog(`  当前用户邮箱: "${currentEmail}"`);
          addLog(`  数据库邮箱: "${data.email}"`);
          addLog(`  邮箱匹配: ${currentEmail === data.email}`);
        });
      } else {
        addLog('集合为空，这就是为什么Firebase控制台显示没有数据的原因');
      }
      
    } catch (error: any) {
      addLog(`Firestore连接失败: ${error.message}`);
    }
  };

  const testDirectQuery = async () => {
    try {
      addLog('=== 直接查询测试 ===');
      
      const userAny = session?.user as any;
      const userEmail = userAny?.email;
      
      addLog(`查询邮箱: "${userEmail}"`);
      addLog(`邮箱类型: ${typeof userEmail}`);
      addLog(`邮箱长度: ${userEmail?.length}`);
      
      const { db } = await import('@/lib/firebase/config');
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      
      // 精确查询
      const q = query(collection(db, 'user_company'), where('email', '==', userEmail));
      addLog('执行查询...');
      
      const snapshot = await getDocs(q);
      addLog(`查询结果: ${snapshot.size} 个文档`);
      
      snapshot.docs.forEach((doc, index) => {
        addLog(`匹配文档 ${index + 1}: ${doc.id} - ${JSON.stringify(doc.data())}`);
      });
      
      // 尝试不同的查询方式
      addLog('=== 尝试查询所有文档然后筛选 ===');
      const allSnapshot = await getDocs(collection(db, 'user_company'));
      let foundMatch = false;
      
      allSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        addLog(`检查文档 ${doc.id}:`);
        addLog(`  数据库email: "${data.email}" (${typeof data.email})`);
        addLog(`  查询email: "${userEmail}" (${typeof userEmail})`);
        addLog(`  完全相等: ${data.email === userEmail}`);
        addLog(`  字符串比较: ${String(data.email) === String(userEmail)}`);
        
        if (data.email === userEmail) {
          foundMatch = true;
          addLog(`✅ 找到匹配! 文档ID: ${doc.id}`);
        }
      });
      
      if (!foundMatch) {
        addLog('❌ 没有找到匹配的邮箱');
      }
      
    } catch (error: any) {
      addLog(`直接查询失败: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">公司绑定测试页面</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">操作</h2>
          <div className="flex gap-4 mb-4 flex-wrap">
            <button
              onClick={testBindingStatus}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '测试中...' : '测试绑定状态'}
            </button>
            <button
              onClick={createTestBinding}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              创建测试绑定
            </button>
            <button
              onClick={manualCreateBinding}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              手动创建绑定
            </button>
            <button
              onClick={checkFirestoreConnection}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              检查数据库连接
            </button>
            <button
              onClick={testDirectQuery}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              详细查询调试
            </button>
            <button
              onClick={updateCompanyInfo}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              更新公司信息
            </button>
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              清除日志
            </button>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
            <div className="font-semibold mb-2">📋 操作说明:</div>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>测试绑定状态</strong>: 检查当前用户是否有绑定的公司</li>
              <li><strong>创建测试绑定</strong>: 通过API创建绑定关系</li>
              <li><strong>手动创建绑定</strong>: 直接在Firestore中创建完整的绑定记录</li>
              <li><strong>检查数据库连接</strong>: 验证Firestore连接并列出现有数据</li>
              <li><strong>详细查询调试</strong>: 详细分析查询过程和数据匹配情况</li>
              <li><strong>更新公司信息</strong>: 完善现有公司的详细信息</li>
              <li><strong>清除日志</strong>: 清空测试日志</li>
            </ul>
          </div>
        </div>

        {/* Session 信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session 信息</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify({ status, user: session?.user, hasIdToken: !!(session as any)?.idToken }, null, 2)}
          </pre>
        </div>

        {/* 用户绑定的公司 */}
        {userCompanies.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">用户绑定的公司</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(userCompanies, null, 2)}
            </pre>
          </div>
        )}

        {/* 公司详细信息 */}
        {companyDetails.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">公司详细信息</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(companyDetails, null, 2)}
            </pre>
          </div>
        )}

        {/* 日志 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">测试日志</h2>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            ) : (
              <div className="text-gray-500">点击"测试绑定状态"开始测试...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 