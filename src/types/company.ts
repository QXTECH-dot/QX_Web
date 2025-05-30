export interface Company {
  id: string;
  name_en: string;
  name_cn?: string;
  name?: string;
  description?: string;
  shortDescription?: string;
  fullDescription?: string;
  logo?: string;
  website?: string;
  location?: string;
  services?: string[];
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
}

// Define related interfaces if they don't exist or need updating

export interface Office {
  id: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
  isHeadquarters?: boolean;
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
  historyId: string;
  companyId: string;
  year: number;
  event: string;
}
