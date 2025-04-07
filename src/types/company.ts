export interface Company {
  id: string;
  name: string;
  verified?: boolean;
  location: string;
  description: string;
  logo: string;
  teamSize?: string;
  languages?: string[]; // Changed from hourlyRate to languages
  services: string[];
  industries?: string[]; // Changed from industry (singular) to industries (plural array)
  abn?: string; // Australian Business Number
  founded?: number;
  employeeCount?: string;
  website?: string;
  email?: string;
  phone?: string;
  longDescription?: string;
  offices?: {
    city: string;
    address: string;
  }[];
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
    xiaohongshu?: string;
    youtube?: string;
    tiktok?: string;
  };
  certifications?: string[];
  clients?: {
    name: string;
    logo: string;
  }[];
  minimumProjectSize?: string;
  avgProjectLength?: string;
  // industry field removed and replaced with industries above
}
