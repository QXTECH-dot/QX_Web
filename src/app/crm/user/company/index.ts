// Export main component
export { default as CompanyManagementRefactored } from "./CompanyManagementRefactored";

// Export hooks
export { useCompanyManagement } from "./hooks/useCompanyManagement";

// Export components
export { StepProgress } from "./components/StepProgress";
export { TabWizardNav } from "./components/TabWizardNav";
export { CompanyBindABN } from "./components/CompanyBindABN";

// Export constants
export { initialCompanyData, stepLabels, stepDescriptions } from "./constants";

// Export utils
export { generateId } from "./utils/generateId";

// Export types
export type {
  Service,
  HistoryEvent,
  Office,
  CompanyData,
  CompanyBindABNProps,
  StepProgressProps,
  TabWizardNavProps,
  StepComponentProps,
  SortableOfficeItemProps,
  ABNStatus,
  CompanyManagementState,
} from "./types";
