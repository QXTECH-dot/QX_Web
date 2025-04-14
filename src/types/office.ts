export interface Office {
  id: string;
  officeId: string;
  companyId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  isHeadquarter: boolean;
  createdAt?: string;
  updatedAt?: string;
} 