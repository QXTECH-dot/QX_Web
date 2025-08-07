// 公司资料相关类型定义
import { Company } from "@/types/company";
import { Office } from "@/types/office";

export interface CompanyProfileProps {
  id: string;
  initialData?: Company;
}

export interface ServiceType {
  name: string;
  description: string;
}

export interface ReviewType {
  author: string;
  company?: string;
  rating: number;
  text: string;
  date: string;
}

export interface OfficeType extends Office {
  officeId: string;
}

export interface HistoryEventType {
  id?: string;
  year: number | string;
  event: string;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

// Re-export the Company type from the main types
export type { Company } from "@/types/company";
