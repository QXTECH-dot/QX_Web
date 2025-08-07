export interface Company {
  id?: string;
  name: string;
  trading_name?: string;
  slug?: string;
  abn: string;
  industry: string;
  industry_1?: string;
  industry_2?: string;
  industry_3?: string;
  status: "active" | "pending" | "suspended";
  foundedYear: number;
  website?: string;
  email?: string;
  phone?: string;
  logo?: string;
  employeeCount: string;
  shortDescription?: string;
  fullDescription?: string;
  languages?: string[];
  offices?: Office[];
  services?: Service[];
  history?: HistoryEvent[];
}

export interface Office {
  id?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  isHeadquarter: boolean;
}

export interface Service {
  id?: string;
  title: string;
  description: string;
}

export interface HistoryEvent {
  id?: string;
  year: string;
  event: string;
}

export interface CompanyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  isCreating: boolean;
  onSave: (company: Company) => Promise<void>;
}

export type TabType = "basic" | "offices" | "services" | "history";
