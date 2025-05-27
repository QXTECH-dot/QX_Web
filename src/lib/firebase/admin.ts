import * as admin from 'firebase-admin';

// 只初始化一次 Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      // databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`, // 如有需要可启用
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

// 导出 Firebase Admin 实例，便于其他地方使用
export const firestore = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

export default admin; 