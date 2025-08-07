// Export main component
export { default as CompanyOverviewRefactored } from "./CompanyOverviewRefactored";

// Export hooks
export { useCompanyOverview } from "./hooks/useCompanyOverview";
export { useCompanyActions } from "./hooks/useCompanyActions";

// Export components
export { LanguageSelector } from "./components/LanguageSelector";
export { ToastNotification } from "./components/ToastNotification";
export { ConfirmDialog } from "./components/ConfirmDialog";
export { CompanyInfoSection } from "./components/CompanyInfoSection";
export { ProgressBar } from "./components/ProgressBar";

// Export constants
export { industryOptions, languageOptions } from "./constants";

// Export types
export type {
  ToastState,
  ConfirmDialogState,
  CompanyOverviewState,
  LanguageSelectorProps,
} from "./types";
