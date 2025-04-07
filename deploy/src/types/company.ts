export interface Company {
  id: string;
  name: string;
  verified?: boolean;
  location: string;
  description: string;
  logo: string;
  teamSize?: string;
  hourlyRate?: string;
  services: string[];
  industry?: string;
  abn?: string; // Australian Business Number
  founded?: number;
  employeeCount?: string;
  website?: string;
  email?: string;
  phone?: string;
  portfolio?: {
    title: string;
    image: string;
    description: string;
  }[];
  reviews?: {
    author: string;
    company: string;
    rating: number;
    text: string;
    date: string;
  }[];
  social?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  certifications?: string[];
  clients?: {
    name: string;
    logo: string;
  }[];
  minimumProjectSize?: string;
  avgProjectLength?: string;
  industries?: string[];
}
