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
const HISTORY_COLLECTION = 'companyHistories';

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

export interface Office {
  officeId?: string;
  companyId: string;
  state: string;
  city: string;
  address: string;
  postalCode?: string;
  contactPerson?: string;
  phone?: string;
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