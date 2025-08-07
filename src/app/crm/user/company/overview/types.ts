export interface ToastState {
  message: string;
  type: "success" | "error";
}

export interface ConfirmDialogState {
  show: boolean;
  title: string;
  message: string;
  type: "delete" | "discard" | "confirm";
  onConfirm: () => void;
  onCancel: () => void;
}

export interface CompanyOverviewState {
  company: any;
  userCompany: any;
  loading: boolean;
  error: string | null;
  editMode: string | null;
  editData: any;
  saving: boolean;
  toast: ToastState | null;
  confirmDialog: ConfirmDialogState;
  showCropper: boolean;
  cropperImageSrc: string;
}

export interface LanguageSelectorProps {
  selectedLanguages: string[];
  onLanguageChange: (languages: string[]) => void;
}
