import { db } from '../config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  setDoc
} from 'firebase/firestore';

// 集合名
const USER_COMPANY_COLLECTION = 'user_company';

export interface UserCompany {
  id?: string;
  companyId: string;  // 改回companyId以保持一致性
  email: string;      // 使用email而不是userId
  role: 'owner' | 'admin' | 'viewer';
  createdAt?: any;
}

// 创建绑定 - 按照一致的格式
export const bindUserToCompany = async (email: string, companyId: string, role: 'owner' | 'admin' | 'viewer' = 'owner'): Promise<string> => {
  // 检查该公司是否已被owner绑定
  const q = query(collection(db, USER_COMPANY_COLLECTION), where('companyId', '==', companyId), where('role', '==', 'owner'));
  const snapshot = await getDocs(q);
  if (!snapshot.empty && role === 'owner') {
    throw new Error('该公司已被其他账号绑定');
  }
  
  // 生成标准格式的文档ID: COMP_XXXXX_USER
  const docId = `${companyId}_USER`;
  
  // 生成内部ID格式: COMP_XXXXX_USER01
  const internalId = `${companyId}_USER01`;
  
  const docData = {
    companyId: companyId,  // 使用companyId字段名
    email: email,
    id: internalId,        // 内部ID字段
    role: role,
    createdAt: Timestamp.now()
  };
  
  // 使用标准格式的文档ID创建文档
  await setDoc(doc(db, USER_COMPANY_COLLECTION, docId), docData);
  return docId;
};

// 查询公司owner
export const getCompanyOwner = async (companyId: string): Promise<UserCompany | null> => {
  const q = query(collection(db, USER_COMPANY_COLLECTION), where('companyId', '==', companyId), where('role', '==', 'owner'));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docData = snapshot.docs[0].data();
  return { id: snapshot.docs[0].id, ...docData } as UserCompany;
};

// 查询用户管理的公司 - 修改为通过email查询
export const getCompaniesByUser = async (userEmail: string): Promise<UserCompany[]> => {
  try {
    console.log('[UserCompany] Querying companies for user email:', userEmail);
    const q = query(collection(db, USER_COMPANY_COLLECTION), where('email', '==', userEmail));
    console.log('[UserCompany] Query created, executing getDocs...');
    
    const snapshot = await getDocs(q);
    console.log('[UserCompany] Query executed, snapshot size:', snapshot.size);
    
    const companies = snapshot.docs.map(doc => {
      const data = { id: doc.id, ...doc.data() } as UserCompany;
      console.log('[UserCompany] Found company binding:', data);
      return data;
    });
    
    console.log('[UserCompany] Returning companies:', companies);
    return companies;
  } catch (error: any) {
    console.error('[UserCompany] Error querying companies:', error);
    console.error('[UserCompany] Error code:', error.code);
    console.error('[UserCompany] Error message:', error.message);
    throw error;
  }
};

// 通过userId查询（兼容旧方法）- 但实际上查找email匹配的记录
export const getCompaniesByUserId = async (userId: string): Promise<UserCompany[]> => {
  // 这里需要通过某种方式将userId转换为email
  // 暂时返回空数组，建议使用email版本
  console.warn('[UserCompany] getCompaniesByUserId is deprecated, use getCompaniesByUser with email instead');
  return [];
};

// 解绑
export const unbindUserFromCompany = async (userCompanyId: string): Promise<void> => {
  const docRef = doc(db, USER_COMPANY_COLLECTION, userCompanyId);
  await deleteDoc(docRef);
}; 