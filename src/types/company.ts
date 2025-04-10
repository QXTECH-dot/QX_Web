export interface Company {
  id: string;
  name: string;
  abn?: string;
  logo: string;
  foundedYear?: number;
  industry: string;
  teamSize?: string;
  website?: string;
  email?: string;
  phone?: string;
  languages?: string | string[];
  shortDescription: string;
  fullDescription?: string;
  social?: { [platform: string]: string };
  verified?: boolean | string;
  services?: string[];
  offices?: Array<{
    city: string;
    address: string;
    state?: string;
    isHeadquarters?: boolean;
  }>;
  reviews?: Array<{
    author: string;
    company?: string;
    rating: number;
    text: string;
    date: string;
  }>;
}

// Define related interfaces if they don't exist or need updating

export interface Office {
  city: string;
  address: string;
  state: string;
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
