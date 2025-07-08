'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface DebugInfo {
  session: any;
  firebaseConnected: boolean;
  userDataFound: boolean;
  userData: any;
  error: string | null;
  environment: string;
}

export default function FirebaseDebug() {
  const { data: session } = useSession();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    session: null,
    firebaseConnected: false,
    userDataFound: false,
    userData: null,
    error: null,
    environment: ''
  });

  useEffect(() => {
    const checkFirebaseConnection = async () => {
      try {
        console.log('[Debug] Starting Firebase connection check...');
        
        // Check environment
        const environment = typeof window !== 'undefined' ? 'client' : 'server';
        console.log('[Debug] Environment:', environment);
        
        // Check session
        console.log('[Debug] Session:', session);
        
        // Test Firebase connection
        const testQuery = query(collection(db, 'users'));
        const snapshot = await getDocs(testQuery);
        console.log('[Debug] Firebase connection test successful, docs count:', snapshot.size);
        
        let userData = null;
        let userDataFound = false;
        
        if (session?.user?.email) {
          console.log('[Debug] Searching for user with email:', session.user.email);
          
          const userQuery = query(
            collection(db, 'users'), 
            where('email', '==', session.user.email)
          );
          const userSnapshot = await getDocs(userQuery);
          
          if (!userSnapshot.empty) {
            userData = userSnapshot.docs[0].data();
            userDataFound = true;
            console.log('[Debug] User data found:', userData);
          } else {
            console.log('[Debug] No user data found for email:', session.user.email);
          }
        }
        
        setDebugInfo({
          session,
          firebaseConnected: true,
          userDataFound,
          userData,
          error: null,
          environment
        });
        
      } catch (error: any) {
        console.error('[Debug] Firebase connection error:', error);
        setDebugInfo({
          session,
          firebaseConnected: false,
          userDataFound: false,
          userData: null,
          error: error.message || 'Unknown error',
          environment: typeof window !== 'undefined' ? 'client' : 'server'
        });
      }
    };

    checkFirebaseConnection();
  }, [session]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Firebase Debug Information</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Environment:</strong> {debugInfo.environment}
        </div>
        
        <div>
          <strong>Session Status:</strong> {session ? 'Authenticated' : 'Not authenticated'}
        </div>
        
        {session && (
          <div>
            <strong>User Email:</strong> {session.user?.email}
          </div>
        )}
        
        <div>
          <strong>Firebase Connected:</strong> {debugInfo.firebaseConnected ? '✅ Yes' : '❌ No'}
        </div>
        
        <div>
          <strong>User Data Found:</strong> {debugInfo.userDataFound ? '✅ Yes' : '❌ No'}
        </div>
        
        {debugInfo.error && (
          <div className="text-red-600">
            <strong>Error:</strong> {debugInfo.error}
          </div>
        )}
        
        {debugInfo.userData && (
          <div>
            <strong>User Data:</strong>
            <pre className="bg-white p-2 rounded text-xs mt-1">
              {JSON.stringify(debugInfo.userData, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-4">
          <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}
        </div>
      </div>
    </div>
  );
} 