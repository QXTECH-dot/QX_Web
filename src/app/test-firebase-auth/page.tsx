'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { syncFirebaseAuth, getCurrentFirebaseUser, testFirestoreConnection } from '@/lib/firebase/auth';
import { getCompaniesByUser } from '@/lib/firebase/services/userCompany';

export default function TestFirebaseAuthPage() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<string[]>([]);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFirebaseAuth = async () => {
    addLog('=== Starting Firebase Auth Test ===');
    
    if (status !== 'authenticated' || !session) {
      addLog('Not authenticated with NextAuth');
      return;
    }

    const idToken = (session as any)?.idToken;
    const userId = (session.user as any)?.id || (session.user as any)?.sub;
    
    addLog(`NextAuth User ID: ${userId}`);
    addLog(`IdToken: ${idToken ? 'present' : 'missing'}`);

    if (!idToken) {
      addLog('No idToken available');
      return;
    }

    try {
      // Test Firebase Auth sync
      addLog('Testing Firebase Auth sync...');
      const user = await syncFirebaseAuth(idToken);
      if (user) {
        addLog(`Firebase Auth sync successful: ${user.uid} (${user.email})`);
        setFirebaseUser(user);
      } else {
        addLog('Firebase Auth sync failed');
        return;
      }

      // Test current user
      addLog('Getting current Firebase user...');
      const currentUser = getCurrentFirebaseUser();
      addLog(`Current Firebase user: ${currentUser?.uid} (${currentUser?.email})`);

      // Test Firestore connection
      addLog('Testing Firestore connection...');
      const connected = await testFirestoreConnection();
      addLog(`Firestore connection: ${connected ? 'success' : 'failed'}`);

      if (connected) {
        // Test user companies query
        addLog('Querying user companies...');
        const userCompanies = await getCompaniesByUser(userId);
        addLog(`Found ${userCompanies.length} companies`);
        setCompanies(userCompanies);
      }

    } catch (error: any) {
      addLog(`Error: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setFirebaseUser(null);
    setCompanies([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Firebase Auth Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Status:</strong> {status}
            </div>
            <div>
              <strong>User ID:</strong> {(session?.user as any)?.id || (session?.user as any)?.sub || 'N/A'}
            </div>
            <div>
              <strong>Email:</strong> {session?.user?.email || 'N/A'}
            </div>
            <div>
              <strong>IdToken:</strong> {(session as any)?.idToken ? 'Present' : 'Missing'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Controls</h2>
            <div className="space-x-2">
              <button
                onClick={testFirebaseAuth}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={status !== 'authenticated'}
              >
                Test Firebase Auth
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear Logs
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          
          {firebaseUser && (
            <div className="mb-4 p-4 bg-green-50 rounded">
              <h3 className="font-semibold text-green-800">Firebase User</h3>
              <p>UID: {firebaseUser.uid}</p>
              <p>Email: {firebaseUser.email}</p>
            </div>
          )}

          {companies.length > 0 && (
            <div className="mb-4 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold text-blue-800">User Companies</h3>
              {companies.map((company, index) => (
                <div key={index} className="mt-2">
                  <p>Company ID: {company.companyId}</p>
                  <p>Role: {company.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-100 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Click "Test Firebase Auth" to start.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 