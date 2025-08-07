// Export main component
export { default as CompanyEditModalRefactored } from "./CompanyEditModalRefactored";

// Export hooks
export { useCompanyEditForm } from "./hooks/useCompanyEditForm";
export { useCompanyActions } from "./hooks/useCompanyActions";

// Export components
export { TabNavigation } from "./components/TabNavigation";
export { BasicInfoTab } from "./components/BasicInfoTab";

// Export constants
export {
  industryOptions,
  employeeCountOptions,
  statusOptions,
} from "./constants";

// Export utils
export { formatABN, getCleanABN, validateABN } from "./utils/abnUtils";
export {
  generateSlug,
  isSlugUnique,
  generateUniqueSlug,
} from "./utils/slugUtils";

// Export types
export type {
  Company,
  Office,
  Service,
  HistoryEvent,
  CompanyEditModalProps,
  TabType,
} from "./types";
