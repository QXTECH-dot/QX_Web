import * as admin from 'firebase-admin';
import path from 'path';

// 清理和格式化私钥的函数
function cleanPrivateKey(privateKey: string): string {
  if (!privateKey) {
    throw new Error('Private key is empty');
  }

  // 移除所有多余的空白字符和换行符
  let cleaned = privateKey.trim();
  
  // 如果私钥被转义了，先处理转义字符
  if (cleaned.includes('\\n')) {
    cleaned = cleaned.replace(/\\n/g, '\n');
  }
  
  // 移除所有换行符，然后重新格式化
  cleaned = cleaned.replace(/\n/g, '').replace(/\r/g, '');
  
  // 确保有正确的开始和结束标记
  if (!cleaned.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('Private key must start with -----BEGIN PRIVATE KEY-----');
  }
  
  if (!cleaned.includes('-----END PRIVATE KEY-----')) {
    throw new Error('Private key must end with -----END PRIVATE KEY-----');
  }
  
  // 提取私钥内容（去掉开始和结束标记）
  const beginMarker = '-----BEGIN PRIVATE KEY-----';
  const endMarker = '-----END PRIVATE KEY-----';
  
  const startIndex = cleaned.indexOf(beginMarker) + beginMarker.length;
  const endIndex = cleaned.indexOf(endMarker);
  
  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    throw new Error('Invalid private key format');
  }
  
  const keyContent = cleaned.substring(startIndex, endIndex).trim();
  
  // 重新组装私钥，每64个字符一行
  const lines = [beginMarker];
  for (let i = 0; i < keyContent.length; i += 64) {
    lines.push(keyContent.substring(i, i + 64));
  }
  lines.push(endMarker);
  
  return lines.join('\n');
}

// 只初始化一次 Firebase Admin
if (!admin.apps.length) {
  try {
    console.log('Initializing Firebase Admin...');
    
    const isFirebaseEnvironment = process.env.FUNCTIONS_EMULATOR === 'true' || 
                                  process.env.FIREBASE_CONFIG || 
                                  process.env.GCLOUD_PROJECT;
    
    console.log('Environment check:', {
      isFirebaseEnvironment,
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      functionsEmulator: process.env.FUNCTIONS_EMULATOR,
      firebaseConfig: !!process.env.FIREBASE_CONFIG,
      gcloudProject: process.env.GCLOUD_PROJECT
    });

    if (isFirebaseEnvironment) {
      // 在Firebase环境中，使用默认凭据
      console.log('Running in Firebase environment, using default credentials');
      admin.initializeApp();
      console.log('Firebase Admin initialized with default credentials');
    } else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      // 在其他环境中（如Vercel），使用环境变量
      console.log('Using environment variables for Firebase Admin');
      
      // 清理和格式化私钥
      let privateKey: string;
      try {
        privateKey = cleanPrivateKey(process.env.FIREBASE_PRIVATE_KEY);
        console.log('Private key cleaned and formatted successfully');
      } catch (keyError) {
        console.error('Private key formatting error:', keyError);
        throw new Error(`Private key format error: ${keyError instanceof Error ? keyError.message : 'Unknown error'}`);
      }

      const credential = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      };

      console.log('Credential check:', {
        projectId: credential.projectId,
        clientEmail: credential.clientEmail,
        privateKeyStart: credential.privateKey.substring(0, 50) + '...',
        privateKeyEnd: '...' + credential.privateKey.substring(credential.privateKey.length - 50),
        privateKeyLines: credential.privateKey.split('\n').length
      });

      admin.initializeApp({
        credential: admin.credential.cert(credential),
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
      // 生产环境必须使用环境变量或默认凭据
      const missingVars = [];
      if (!process.env.FIREBASE_PROJECT_ID) missingVars.push('FIREBASE_PROJECT_ID');
      if (!process.env.FIREBASE_CLIENT_EMAIL) missingVars.push('FIREBASE_CLIENT_EMAIL');
      if (!process.env.FIREBASE_PRIVATE_KEY) missingVars.push('FIREBASE_PRIVATE_KEY');
      
      throw new Error(`Firebase environment variables are required in production. Missing: ${missingVars.join(', ')}`);
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