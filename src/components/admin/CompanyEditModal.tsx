import CompanyEditModalRefactored from "./CompanyEditModal/CompanyEditModalRefactored";
import { CompanyEditModalProps } from "./CompanyEditModal/types";

export default function CompanyEditModal({
  isOpen,
  onClose,
  company,
  isCreating,
  onSave,
}: CompanyEditModalProps) {
  return (
    <CompanyEditModalRefactored
      isOpen={isOpen}
      onClose={onClose}
      company={company}
      isCreating={isCreating}
      onSave={onSave}
    />
  );
}
