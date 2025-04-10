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
  where
} from 'firebase/firestore';

// Collection names
const COMPANIES_COLLECTION = 'companies';
const BRANCHES_COLLECTION = 'branches';
const SERVICES_COLLECTION = 'services';
const HISTORY_COLLECTION = 'history';

// Interfaces
export interface Company {
  companyId?: string;
  name: string;
  abn: string;
  shortDescription: string;
  fullDescription: string;
  foundedYear: string;
  industry: string;
  state: string;
  website: string;
  email: string;
  phone: string;
  size: string;
}

export interface Branch {
  branchId?: string;
  companyId: string;
  address: string;
  state: string;
  phone: string;
  email: string;
}

export interface Service {
  serviceId?: string;
  companyId: string;
  title: string;
  description: string;
}

export interface History {
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
  const docRef = await addDoc(collection(db, COMPANIES_COLLECTION), company);
  return docRef.id;
};

export const updateCompany = async (companyId: string, company: Partial<Company>): Promise<void> => {
  const docRef = doc(db, COMPANIES_COLLECTION, companyId);
  await updateDoc(docRef, company);
};

export const deleteCompany = async (companyId: string): Promise<void> => {
  const docRef = doc(db, COMPANIES_COLLECTION, companyId);
  await deleteDoc(docRef);
};

// Branch operations
export const getBranchesByCompanyId = async (companyId: string): Promise<Branch[]> => {
  const branchesCol = collection(db, BRANCHES_COLLECTION);
  const q = query(branchesCol, where("companyId", "==", companyId));
  const branchSnapshot = await getDocs(q);
  return branchSnapshot.docs.map(doc => ({
    branchId: doc.id,
    ...doc.data()
  } as Branch));
};

export const createBranch = async (branch: Branch): Promise<string> => {
  const docRef = await addDoc(collection(db, BRANCHES_COLLECTION), branch);
  return docRef.id;
};

export const updateBranch = async (branchId: string, branch: Partial<Branch>): Promise<void> => {
  const docRef = doc(db, BRANCHES_COLLECTION, branchId);
  await updateDoc(docRef, branch);
};

export const deleteBranch = async (branchId: string): Promise<void> => {
  const docRef = doc(db, BRANCHES_COLLECTION, branchId);
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
export const getHistoryByCompanyId = async (companyId: string): Promise<History[]> => {
  const historyCol = collection(db, HISTORY_COLLECTION);
  const q = query(historyCol, where("companyId", "==", companyId));
  const historySnapshot = await getDocs(q);
  return historySnapshot.docs.map(doc => ({
    historyId: doc.id,
    ...doc.data()
  } as History));
};

export const createHistory = async (history: History): Promise<string> => {
  const docRef = await addDoc(collection(db, HISTORY_COLLECTION), history);
  return docRef.id;
};

export const updateHistory = async (historyId: string, history: Partial<History>): Promise<void> => {
  const docRef = doc(db, HISTORY_COLLECTION, historyId);
  await updateDoc(docRef, history);
};

export const deleteHistory = async (historyId: string): Promise<void> => {
  const docRef = doc(db, HISTORY_COLLECTION, historyId);
  await deleteDoc(docRef);
}; 