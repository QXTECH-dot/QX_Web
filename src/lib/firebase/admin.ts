import * as admin from 'firebase-admin';
import path from 'path';

// 只初始化一次 Firebase Admin
if (!admin.apps.length) {
  try {
    // 尝试使用环境变量
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin initialized with environment variables');
    } else {
      // 如果环境变量不存在，使用JSON密钥文件
      const serviceAccountPath = path.join(process.cwd(), 'firebase-admin-key.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
      console.log('Firebase Admin initialized with service account key file');
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