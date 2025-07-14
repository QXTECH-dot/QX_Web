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
  Firestore,
  DocumentData,
  setDoc
} from 'firebase/firestore';

// Collection names
const COMPANIES_COLLECTION = 'companies';
const OFFICES_COLLECTION = 'offices';
const SERVICES_COLLECTION = 'services';
const HISTORY_COLLECTION = 'history';

// Interfaces
export interface Company {
  companyId?: string;
  name: string;
  name_en?: string; // 数据库中的英文名称字段
  trading_name?: string; // 交易名称字段
  slug?: string; // URL slug 字段
  abn: string;
  logo: string;
  shortDescription: string;
  fullDescription: string;
  foundedYear: string;
  industry: string;
  industry_1?: string; // 一级行业
  industry_2?: string; // 二级行业  
  industry_3?: string; // 三级行业
  state: string;
  website: string;
  email: string;
  phone: string;
  size: string;
  languages?: string[];
}

export interface Office {
  officeId?: string;
  companyId: string;
  state: string;
  city: string;
  address: string;
  postalCode?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  isHeadquarter: boolean;
}

export interface Service {
  serviceId?: string;
  companyId: string;
  title: string;
  description: string;
}

export interface CompanyHistory {
  historyId?: string;
  companyId: string;
  date: string;
  description: string;
}

// Company CRUD operations
export const getCompanies = async (): Promise<Company[]> => {
  const companiesCol = collection(db, COMPANIES_COLLECTION);
  const companySnapshot = await getDocs(companiesCol);
  return companySnapshot.docs.map(doc => ({
    companyId: doc.id,
    ...doc.data()
  } as Company));
};

export const getCompanyById = async (companyId: string): Promise<Company | null> => {
  const docRef = doc(db, COMPANIES_COLLECTION, companyId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      companyId: docSnap.id,
      ...docSnap.data()
    } as Company;
  }
  return null;
};

export const createCompany = async (company: Company): Promise<string> => {
  // 自动生成唯一slug
  const slug = await generateUniqueSlug(company.name);
  
  // 生成下一个COMP_XXXXX编号
  const companyId = await generateNextCompanyId();
  
  const companyWithSlug = {
    ...company,
    slug,
    companyId // 设置companyId字段
  };
  
  // 使用指定的ID创建文档
  await setDoc(doc(db, COMPANIES_COLLECTION, companyId), companyWithSlug);
  return companyId;
};

export const updateCompany = async (companyId: string, company: Partial<Company>): Promise<string> => {
  // 检查并修复Company ID格式
  let currentCompanyId = companyId;
  if (!isValidCompanyId(companyId)) {
    console.log(`[Update Company] Invalid company ID detected: ${companyId}, fixing...`);
    currentCompanyId = await fixCompanyId(companyId);
  }
  
  // 如果更新了公司名称，需要重新生成slug
  if (company.name) {
    const slug = await generateUniqueSlug(company.name, currentCompanyId);
    company.slug = slug;
  }
  
  const docRef = doc(db, COMPANIES_COLLECTION, currentCompanyId);
  await updateDoc(docRef, company);
  
  return currentCompanyId; // 返回可能已经修复的ID
};

export const deleteCompany = async (companyId: string): Promise<void> => {
  const docRef = doc(db, COMPANIES_COLLECTION, companyId);
  await deleteDoc(docRef);
};

// Office operations
export const getOfficesByCompanyId = async (companyId: string): Promise<Office[]> => {
  const officesCol = collection(db, OFFICES_COLLECTION);
  const q = query(officesCol, where("companyId", "==", companyId));
  const officeSnapshot = await getDocs(q);
  return officeSnapshot.docs.map(doc => ({
    officeId: doc.id,
    ...doc.data()
  } as Office));
};

export const createOffice = async (office: Office): Promise<string> => {
  const docRef = await addDoc(collection(db, OFFICES_COLLECTION), office);
  return docRef.id;
};

export const updateOffice = async (officeId: string, office: Partial<Office>): Promise<void> => {
  const docRef = doc(db, OFFICES_COLLECTION, officeId);
  await updateDoc(docRef, office);
};

export const deleteOffice = async (officeId: string): Promise<void> => {
  const docRef = doc(db, OFFICES_COLLECTION, officeId);
  await deleteDoc(docRef);
};

// Service operations
export const getServicesByCompanyId = async (companyId: string): Promise<Service[]> => {
  const servicesCol = collection(db, SERVICES_COLLECTION);
  const q = query(servicesCol, where("companyId", "==", companyId));
  const serviceSnapshot = await getDocs(q);
  return serviceSnapshot.docs.map(doc => ({
    serviceId: doc.id,
    ...doc.data()
  } as Service));
};

export const createService = async (service: Service): Promise<string> => {
  const docRef = await addDoc(collection(db, SERVICES_COLLECTION), service);
  return docRef.id;
};

export const updateService = async (serviceId: string, service: Partial<Service>): Promise<void> => {
  const docRef = doc(db, SERVICES_COLLECTION, serviceId);
  await updateDoc(docRef, service);
};

export const deleteService = async (serviceId: string): Promise<void> => {
  const docRef = doc(db, SERVICES_COLLECTION, serviceId);
  await deleteDoc(docRef);
};

// History operations
export const getHistoryByCompanyId = async (companyId: string): Promise<CompanyHistory[]> => {
  const historyCol = collection(db, HISTORY_COLLECTION);
  const q = query(historyCol, where('companyId', '==', companyId));
  const historySnapshot = await getDocs(q);
  return historySnapshot.docs.map(doc => ({
    historyId: doc.id,
    ...doc.data()
  } as CompanyHistory));
};

export const createHistory = async (companyId: string, data: Omit<CompanyHistory, 'historyId' | 'companyId'>): Promise<CompanyHistory> => {
  const historyCol = collection(db, HISTORY_COLLECTION);
  const docRef = await addDoc(historyCol, {
    companyId,
    ...data
  });
  return {
    historyId: docRef.id,
    companyId,
    ...data
  };
};

export const updateHistory = async (historyId: string, data: Partial<Omit<CompanyHistory, 'historyId' | 'companyId'>>): Promise<void> => {
  const historyRef = doc(db, HISTORY_COLLECTION, historyId);
  await updateDoc(historyRef, data);
};

export const deleteHistory = async (historyId: string): Promise<void> => {
  const historyRef = doc(db, HISTORY_COLLECTION, historyId);
  await deleteDoc(historyRef);
};

// ========== Company ID 生成函数 ==========

// 检查Company ID是否符合COMP_XXXXX格式
export const isValidCompanyId = (companyId: string): boolean => {
  return /^COMP_\d{5}$/.test(companyId);
};

// 生成下一个COMP_XXXXX编号
export const generateNextCompanyId = async (): Promise<string> => {
  const companiesCol = collection(db, COMPANIES_COLLECTION);
  const snapshot = await getDocs(companiesCol);
  
  let maxNumber = 0;
  
  snapshot.docs.forEach(doc => {
    const companyId = doc.id;
    // 检查是否符合 COMP_XXXXX 格式（5位数字）
    const match = companyId.match(/^COMP_(\d{5})$/);
    if (match) {
      const number = parseInt(match[1], 10);
      if (!isNaN(number) && number > maxNumber) {
        maxNumber = number;
      }
    }
  });
  
  // 生成新的编号
  const nextNumber = maxNumber + 1;
  return `COMP_${String(nextNumber).padStart(5, '0')}`;
};

// 修复公司ID - 将乱码ID替换为标准格式
export const fixCompanyId = async (oldCompanyId: string): Promise<string> => {
  // 如果ID已经是正确格式，直接返回
  if (isValidCompanyId(oldCompanyId)) {
    return oldCompanyId;
  }
  
  console.log(`[Company ID Fix] Detected invalid company ID: ${oldCompanyId}`);
  
  // 生成新的标准ID
  const newCompanyId = await generateNextCompanyId();
  
  try {
    // 获取旧文档数据
    const oldDocRef = doc(db, COMPANIES_COLLECTION, oldCompanyId);
    const oldDocSnap = await getDoc(oldDocRef);
    
    if (!oldDocSnap.exists()) {
      throw new Error(`Company ${oldCompanyId} not found`);
    }
    
    const companyData = oldDocSnap.data();
    
    // 更新companyId字段
    const updatedData = {
      ...companyData,
      companyId: newCompanyId
    };
    
    // 创建新文档
    const newDocRef = doc(db, COMPANIES_COLLECTION, newCompanyId);
    await setDoc(newDocRef, updatedData);
    
    // 更新关联的办公室、服务和历史记录
    await updateRelatedCollections(oldCompanyId, newCompanyId);
    
    // 删除旧文档
    await deleteDoc(oldDocRef);
    
    console.log(`[Company ID Fix] Successfully migrated ${oldCompanyId} to ${newCompanyId}`);
    return newCompanyId;
    
  } catch (error) {
    console.error(`[Company ID Fix] Error migrating ${oldCompanyId}:`, error);
    throw error;
  }
};

// 更新关联集合中的companyId引用
const updateRelatedCollections = async (oldCompanyId: string, newCompanyId: string) => {
  const collections = [
    { name: 'offices', field: 'companyId' },
    { name: 'services', field: 'companyId' },
    { name: 'history', field: 'companyId' }
  ];
  
  for (const collectionInfo of collections) {
    const collectionRef = collection(db, collectionInfo.name);
    const q = query(collectionRef, where(collectionInfo.field, '==', oldCompanyId));
    const querySnapshot = await getDocs(q);
    
    for (const docSnapshot of querySnapshot.docs) {
      const docRef = doc(db, collectionInfo.name, docSnapshot.id);
      await updateDoc(docRef, {
        [collectionInfo.field]: newCompanyId
      });
    }
  }
};

// ========== Slug 生成和查询函数 ==========

// 生成URL slug
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // 移除特殊字符，只保留字母、数字、空格和横杠
    .replace(/\s+/g, '-') // 将空格替换为横杠
    .replace(/-+/g, '-') // 将多个连续横杠替换为一个
    .replace(/^-|-$/g, '') // 移除开头和结尾的横杠
    .trim();
};

// 检查slug是否唯一
export const isSlugUnique = async (slug: string, excludeCompanyId?: string): Promise<boolean> => {
  const companiesCol = collection(db, COMPANIES_COLLECTION);
  const q = query(companiesCol, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return true;
  }
  
  // 如果提供了excludeCompanyId，检查是否是同一个公司（用于更新时）
  if (excludeCompanyId) {
    const docs = querySnapshot.docs;
    return docs.length === 1 && docs[0].id === excludeCompanyId;
  }
  
  return false;
};

// 生成唯一slug
export const generateUniqueSlug = async (name: string, excludeCompanyId?: string): Promise<string> => {
  let baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;
  
  while (!(await isSlugUnique(slug, excludeCompanyId))) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

// 根据slug查询公司
export const getCompanyBySlug = async (slug: string): Promise<Company | null> => {
  const companiesCol = collection(db, COMPANIES_COLLECTION);
  const q = query(companiesCol, where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return {
      companyId: doc.id,
      ...doc.data()
    } as Company;
  }
  
  return null;
}; 