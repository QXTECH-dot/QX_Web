export interface Company {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  location: string;
  services: string[];
  teamSize: string;
  industry?: string;
  abn?: string;
  rating?: number;
  offices?: Office[];
  languages?: string[];
  shortDescription?: string;
  name_en?: string;
  hourlyRate?: number;
  founded?: number;
  minimumProjectSize?: number;
  avgProjectLength?: number;
  second_industry?: string;
  third_industry?: string;
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
