// Export main component
export { CompanyProfileRefactored } from "./CompanyProfileRefactored";

// Export types
export type {
  CompanyProfileProps,
  Company,
  ServiceType,
  ReviewType,
  OfficeType,
  HistoryEventType,
  SocialLinks,
} from "./types";

// Export hooks
export { useServiceData } from "./hooks/useServiceData";
export { useOfficeData } from "./hooks/useOfficeData";
export { useCompanyData } from "./hooks/useCompanyData";
export { useCompanyHistory } from "./hooks/useCompanyHistory";
export { useSimilarCompanies } from "./hooks/useSimilarCompanies";

// Export constants and utilities
export {
  languageOptions,
  getLanguageDisplayName,
  formatLanguages,
} from "./constants";
