import * as admin from 'firebase-admin';
import path from 'path';

// 只初始化一次 Firebase Admin
if (!admin.apps.length) {
  try {
    console.log('Initializing Firebase Admin...');
    console.log('Environment check:', {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      nodeEnv: process.env.NODE_ENV
    });

    // 优先使用环境变量（推荐用于生产环境）
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin initialized with environment variables');
    } else if (process.env.NODE_ENV !== 'production') {
      // 仅在非生产环境中尝试使用JSON密钥文件
      try {
        const serviceAccountPath = path.join(process.cwd(), 'firebase-admin-key.json');
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
        });
        console.log('Firebase Admin initialized with service account key file');
      } catch (fileError) {
        console.error('Failed to load service account key file:', fileError);
        throw new Error('Firebase configuration not found. Please set environment variables or provide service account key file.');
      }
    } else {
      // 生产环境必须使用环境变量
      throw new Error('Firebase environment variables are required in production. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
}

// 导出 Firebase Admin 实例，便于其他地方使用
export const firestore = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

export default admin; 