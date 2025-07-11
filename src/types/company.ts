export interface Company {
  id: string;
  slug?: string;  // 新增slug字段用于URL友好链接
  name_en: string;
  name_cn?: string;
  name?: string;
  description?: string;
  shortDescription?: string;
  fullDescription?: string;
  logo?: string;
  website?: string;
  location?: string;
  services?: string[] | CompanyService[];
  teamSize?: string | number;
  industry?: string[];
  industries?: string[];
  abn?: string;
  rating?: number;
  offices?: Office[];
  languages?: string[];
  hourlyRate?: number;
  founded?: number;
  foundedYear?: number;
  minimumProjectSize?: number;
  avgProjectLength?: number;
  second_industry?: string;
  third_industry?: string;
  verified?: boolean;
  social?: string;
  createdAt?: any;
  updatedAt?: any;
  history?: CompanyHistory[];
  email?: string;
  phone?: string;
  // Additional fields for CRM
  role?: string;
  bindingId?: string;
  userEmail?: string;
  verifiedEmail?: string;
  companyId?: string;
}

// Define related interfaces if they don't exist or need updating

export interface Office {
  id?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  isHeadquarter?: boolean;
  contactPerson?: string;
  companyId?: string;
}

export interface CompanyService {
  id?: string;
  title?: string;
  description?: string;
  serviceId?: string;
  companyId?: string;
}

export interface PortfolioItem {
  title: string;
  image: string;
  description: string;
}

export interface Review {
  author: string;
  company?: string;
  rating: number;
  text: string;
  date: string;
}

export interface Client {
  name: string;
  logo: string;
}

export interface HistoryEvent {
  year: number;
  event: string;
}

export interface CompanyHistory {
  id?: string;
  companyId?: string;
  year?: string | number;
  event?: string;
  createdAt?: any;
  updatedAt?: any;
}
