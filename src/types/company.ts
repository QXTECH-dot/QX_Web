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
  offices?: Array<Office>;
  reviews?: Array<Review>;
}

// Define related interfaces if they don't exist or need updating

export interface Office {
  companyId: string;        // 如 COMP_00001
  officeId: string;         // 如 COMP_00001_SYDNEY_01
  state: string;            // 州/省，如 NSW, VIC, QLD 等
  city: string;             // 如 Sydney, Melbourne
  address: string;          // 详细地址
  postalCode?: string;      // 邮政编码
  contactPerson?: string;   // 联系人
  phone?: string;           // 办公室电话
  isHeadquarter: boolean;   // 是否为总部
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
