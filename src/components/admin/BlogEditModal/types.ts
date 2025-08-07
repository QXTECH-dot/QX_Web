import { Blog, BlogContent } from "@/lib/firebase/services/blog";

export interface BlogEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: Blog | null;
  isCreating: boolean;
  onSave: (blog: Blog) => Promise<void>;
}

export interface ContentType {
  type: BlogContent["type"];
  label: string;
  icon: React.ComponentType<any>;
}

export interface BlogFormState {
  formData: Blog;
  activeTab: "content" | "settings";
  saving: boolean;
  saveSuccess: boolean;
  previewMode: boolean;
}

export interface ContentBlockHandlers {
  addContentBlock: (type: BlogContent["type"]) => void;
  updateContentBlock: (id: string, updates: Partial<BlogContent>) => void;
  removeContentBlock: (id: string) => void;
  moveContentBlock: (id: string, direction: "up" | "down") => void;
  handleImageUpload: (
    blockId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export interface ContentBlockRendererProps {
  block: BlogContent;
  updateContentBlock: (id: string, updates: Partial<BlogContent>) => void;
  handleImageUpload: (
    blockId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export interface BlogSettingsProps {
  formData: Blog;
  handleInputChange: (field: keyof Blog, value: any) => void;
  categories: string[];
}

export interface BlogContentEditorProps {
  formData: Blog;
  activeTab: "content" | "settings";
  setActiveTab: (tab: "content" | "settings") => void;
  contentHandlers: ContentBlockHandlers;
  renderContentBlock: (block: BlogContent) => React.ReactNode;
}

export interface BlogModalFooterProps {
  formData: Blog;
  saving: boolean;
  saveSuccess: boolean;
  onClose: () => void;
  onSave: () => void;
  calculateReadTime: (content: BlogContent[]) => number;
}
