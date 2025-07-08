'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function UserDataTest() {
  const { data: session } = useSession();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runUserDataTest = async () => {
    if (!session?.user?.email) {
      setTestResults([{ test: 'Session Check', status: 'error', message: 'No user email in session' }]);
      return;
    }

    setLoading(true);
    const results = [];

    try {
      // Test 1: 尝试获取所有用户
      try {
        console.log('[UserDataTest] Testing get all users...');
        const allUsersSnapshot = await getDocs(collection(db, 'users'));
        results.push({
          test: 'Get All Users',
          status: 'success',
          message: `Found ${allUsersSnapshot.size} users in total`
        });

        // Test 2: 客户端过滤查找当前用户
        let foundUser = null;
        for (const doc of allUsersSnapshot.docs) {
          const userData = doc.data();
          if (userData.email === session.user.email) {
            foundUser = userData;
            break;
          }
        }

        if (foundUser) {
          results.push({
            test: 'Client-side User Filter',
            status: 'success',
            message: `Found user: ${foundUser.firstName} ${foundUser.lastName}`
          });
        } else {
          results.push({
            test: 'Client-side User Filter',
            status: 'warning',
            message: 'User not found in database'
          });
        }

      } catch (error: any) {
        results.push({
          test: 'Get All Users',
          status: 'error',
          message: `Failed: ${error.message}`
        });
      }

      // Test 3: 尝试where查询
      try {
        console.log('[UserDataTest] Testing where query...');
        const q = query(collection(db, 'users'), where('email', '==', session.user.email));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          results.push({
            test: 'Where Query',
            status: 'success',
            message: `Found user via where query: ${userData.firstName} ${userData.lastName}`
          });
        } else {
          results.push({
            test: 'Where Query',
            status: 'warning',
            message: 'No user found via where query'
          });
        }
      } catch (error: any) {
        results.push({
          test: 'Where Query',
          status: 'error',
          message: `Failed: ${error.message}`
        });
      }

      // Test 4: 测试user_company集合
      try {
        console.log('[UserDataTest] Testing user_company collection...');
        const userCompanySnapshot = await getDocs(collection(db, 'user_company'));
        results.push({
          test: 'User Company Collection',
          status: 'success',
          message: `Found ${userCompanySnapshot.size} user-company relationships`
        });
      } catch (error: any) {
        results.push({
          test: 'User Company Collection',
          status: 'error',
          message: `Failed: ${error.message}`
        });
      }

    } catch (error: any) {
      results.push({
        test: 'General Error',
        status: 'error',
        message: `Unexpected error: ${error.message}`
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user?.email) {
      runUserDataTest();
    }
  }, [session]);

  return (
    <div className="p-4 bg-blue-50 rounded-lg mt-4">
      <h3 className="text-lg font-semibold mb-4">User Data Test Results</h3>
      
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="ml-2">Testing...</span>
        </div>
      ) : (
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div 
              key={index}
              className={`p-3 rounded border text-sm ${
                result.status === 'success' ? 'bg-green-100 border-green-300' :
                result.status === 'error' ? 'bg-red-100 border-red-300' :
                'bg-yellow-100 border-yellow-300'
              }`}
            >
              <div className="font-medium">{result.test}</div>
              <div className="text-gray-600">{result.message}</div>
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={runUserDataTest}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        Rerun Test
      </button>
    </div>
  );
} 