import * as admin from 'firebase-admin';

interface FirebaseAdminConfig {
  credential: {
    privateKey: string;
    clientEmail: string;
    projectId: string;
  };
  databaseURL?: string;
}

// 只初始化一次 Firebase Admin
if (!admin.apps.length) {
  try {
    // 从环境变量中获取服务账号信息
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON as string
    );

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
      // 如果你使用了 Realtime Database，也可以配置 databaseURL
      //databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
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