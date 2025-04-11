import admin from 'firebase-admin';
import { config } from 'dotenv';
import { resolve } from 'path';

// 加载环境变量
config({ path: resolve(process.cwd(), '.env.local') });

// 从环境变量获取服务账号信息
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

// 初始化 Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const firestore = admin.firestore();

// 示例服务数据
const servicesData = [
  {
    companyId: 'COMP_00001',
    title: 'SEO',
    description: 'Search Engine Optimization'
  },
  {
    companyId: 'COMP_00001',
    title: 'Web Development',
    description: 'Custom website development and maintenance'
  },
  {
    companyId: 'COMP_00001',
    title: 'Digital Marketing',
    description: 'Comprehensive digital marketing solutions'
  },
  {
    companyId: 'COMP_00001',
    title: 'Content Writing',
    description: 'Professional content creation and copywriting'
  },
  {
    companyId: 'COMP_00001',
    title: 'Social Media Management',
    description: 'Social media strategy and management services'
  }
];

async function createServices() {
  try {
    console.log('Starting to create services...');
    
    for (const service of servicesData) {
      // 生成唯一的服务ID
      const serviceId = `COMP_00001_SERVICES_${Date.now()}`;
      
      // 创建服务文档
      await firestore.collection('services').doc(serviceId).set({
        ...service,
        serviceId: serviceId
      });
      
      console.log(`Created service: ${service.title} with ID: ${serviceId}`);
    }
    
    console.log('All services created successfully!');
  } catch (error) {
    console.error('Error creating services:', error);
  } finally {
    // 关闭 Firebase Admin SDK
    admin.app().delete();
  }
}

// 运行脚本
createServices(); 