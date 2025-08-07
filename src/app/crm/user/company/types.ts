export interface Service {
  id: string;
  title: string;
  description: string;
}

export interface HistoryEvent {
  year: string;
  event: string;
}

export interface Office {
  id: string;
  name: string;
  address: string;
}

export interface CompanyData {
  logo: string;
  name: string;
  verified: boolean;
  abn: string;
  city: string;
  state: string;
  industry: string;
  description: string;
  tags: string[];
  languages: string;
  teamSize: string;
  founded: number;
  about: string;
  offices: Office[];
  contact: {
    website: string;
    email: string;
    phone: string;
  };
  initialServices: Service[];
}

export interface CompanyBindABNProps {
  onBind: (company: any) => void;
}

export interface StepProgressProps {
  currentStep: number;
}

export interface TabWizardNavProps {
  currentStep: number;
  completedSteps: boolean[];
  onTabClick: (idx: number) => void;
}

export interface StepComponentProps {
  data: any;
  onChange: (data: any) => void;
  onValidate: (valid: boolean) => void;
}

export interface SortableOfficeItemProps {
  office: Office;
  onDelete: (id: string) => void;
}

export type ABNStatus = "idle" | "checking" | "found" | "notfound" | "error";

export interface CompanyManagementState {
  boundCompany: any;
  loading: boolean;
  error: string | null;
  timeout: boolean;
  isCheckingBind: boolean;
  hasInitialized: boolean;
}
