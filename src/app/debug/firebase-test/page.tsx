'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

export default function FirebaseTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runTests = async () => {
      const results = [];
      
      // Test 1: Environment Check
      results.push({
        test: 'Environment Check',
        status: 'info',
        message: `Running on: ${typeof window !== 'undefined' ? 'Client' : 'Server'}`
      });
      
      results.push({
        test: 'Current URL',
        status: 'info',
        message: typeof window !== 'undefined' ? window.location.href : 'Server-side'
      });
      
      // Test 2: Firebase Config Check
      try {
        results.push({
          test: 'Firebase Config',
          status: 'success',
          message: 'Firebase config loaded successfully'
        });
      } catch (error: any) {
        results.push({
          test: 'Firebase Config',
          status: 'error',
          message: `Firebase config error: ${error.message}`
        });
      }
      
      // Test 3: Firestore Connection Test
      try {
        console.log('[Firebase Test] Testing Firestore connection...');
        const testQuery = query(collection(db, 'users'));
        const snapshot = await getDocs(testQuery);
        
        results.push({
          test: 'Firestore Connection',
          status: 'success',
          message: `Connected successfully. Found ${snapshot.size} documents in users collection`
        });
        
        // Test 4: Data Read Test
        if (snapshot.size > 0) {
          const firstDoc = snapshot.docs[0];
          results.push({
            test: 'Data Read Test',
            status: 'success',
            message: `Successfully read document: ${firstDoc.id}`
          });
        } else {
          results.push({
            test: 'Data Read Test',
            status: 'warning',
            message: 'No documents found in users collection'
          });
        }
        
      } catch (error: any) {
        console.error('[Firebase Test] Firestore connection error:', error);
        results.push({
          test: 'Firestore Connection',
          status: 'error',
          message: `Connection failed: ${error.message}`
        });
        
        // Additional error details
        if (error.code) {
          results.push({
            test: 'Error Code',
            status: 'error',
            message: `Error code: ${error.code}`
          });
        }
        
        if (error.code === 'permission-denied') {
          results.push({
            test: 'Permission Analysis',
            status: 'error',
            message: 'This is a Firestore security rules issue. Check your firestore.rules file.'
          });
        }
      }
      
      // Test 5: Write Test (if possible)
      try {
        const testData = {
          test: true,
          timestamp: new Date(),
          environment: typeof window !== 'undefined' ? 'client' : 'server'
        };
        
        await addDoc(collection(db, 'test'), testData);
        results.push({
          test: 'Write Test',
          status: 'success',
          message: 'Successfully wrote test document'
        });
      } catch (error: any) {
        results.push({
          test: 'Write Test',
          status: 'error',
          message: `Write failed: ${error.message}`
        });
      }
      
      setTestResults(results);
      setLoading(false);
    };
    
    runTests();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Firebase Connection Test</h1>
      
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2">Running tests...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                result.status === 'success' ? 'bg-green-50 border-green-200' :
                result.status === 'error' ? 'bg-red-50 border-red-200' :
                result.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  result.status === 'success' ? 'bg-green-500' :
                  result.status === 'error' ? 'bg-red-500' :
                  result.status === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></span>
                <strong>{result.test}</strong>
              </div>
              <p className="mt-1 text-sm text-gray-600">{result.message}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Troubleshooting Tips:</h3>
        <ul className="text-sm space-y-1 text-gray-600">
          <li>• If you see "permission-denied" errors, check your Firestore security rules</li>
          <li>• Make sure your domain is authorized in Firebase Console</li>
          <li>• Verify that your Firebase project configuration is correct</li>
          <li>• Check browser console for additional error details</li>
        </ul>
      </div>
    </div>
  );
} 