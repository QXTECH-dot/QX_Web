"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { ToastState, ConfirmDialogState } from "../types";

export function useCompanyActions() {
  const [saving, setSaving] = useState(false);

  // Show toast notification
  const showToast = (
    setToast: (toast: ToastState | null) => void,
    message: string,
    type: "success" | "error"
  ) => {
    setToast({ message, type });
  };

  // Show confirm dialog
  const showConfirmDialog = (
    setConfirmDialog: (
      dialog:
        | ConfirmDialogState
        | ((prev: ConfirmDialogState) => ConfirmDialogState)
    ) => void,
    title: string,
    message: string,
    onConfirm: () => void,
    type: "delete" | "discard" | "confirm" = "confirm"
  ) => {
    setConfirmDialog({
      show: true,
      title,
      message,
      type,
      onConfirm,
      onCancel: () => setConfirmDialog((prev) => ({ ...prev, show: false })),
    });
  };

  // Save changes to database
  const saveChanges = async (
    section: string,
    data: any,
    company: any,
    setCompany: (company: any) => void,
    setEditMode: (mode: string | null) => void,
    setToast: (toast: ToastState | null) => void
  ) => {
    try {
      setSaving(true);

      // 如果有name字段，也更新name_en字段
      const updateData = { ...data };
      if (updateData.name) {
        updateData.name_en = updateData.name;
      }

      console.log(
        "[CompanyOverview] Saving changes for section:",
        section,
        "Data:",
        updateData
      );

      // 更新到Firestore
      const companyRef = doc(db, "companies", company.id);
      await updateDoc(companyRef, updateData);

      // 更新本地状态
      setCompany((prev: any) => ({
        ...prev,
        ...updateData,
      }));

      // 退出编辑模式
      setEditMode(null);

      showToast(setToast, "Changes saved successfully!", "success");
    } catch (error: any) {
      console.error("[CompanyOverview] Error saving changes:", error);
      showToast(setToast, "Failed to save changes: " + error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setEditData: (data: any) => void,
    setShowCropper: (show: boolean) => void,
    setCropperImageSrc: (src: string) => void,
    setToast: (toast: ToastState | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      showToast(setToast, "Please select a valid image file", "error");
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast(setToast, "File size must be less than 5MB", "error");
      return;
    }

    try {
      // 读取文件并显示裁剪器
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setCropperImageSrc(imageSrc);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      showToast(setToast, "Failed to process image: " + error.message, "error");
    }
  };

  // Handle cropped image
  const handleCroppedImage = async (
    croppedImageBlob: Blob,
    company: any,
    setEditData: (data: any) => void,
    setShowCropper: (show: boolean) => void,
    setToast: (toast: ToastState | null) => void
  ) => {
    try {
      setSaving(true);

      // 上传到Firebase Storage
      const timestamp = Date.now();
      const fileName = `company-logos/${company.id}_${timestamp}.jpg`;
      const logoRef = ref(storage, fileName);

      await uploadBytes(logoRef, croppedImageBlob);
      const logoURL = await getDownloadURL(logoRef);

      // 更新编辑数据
      setEditData((prev: any) => ({
        ...prev,
        logo: logoURL,
      }));

      setShowCropper(false);
      showToast(setToast, "Logo uploaded successfully!", "success");
    } catch (error: any) {
      console.error("[CompanyOverview] Error uploading logo:", error);
      showToast(setToast, "Failed to upload logo: " + error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    setSaving,
    showToast,
    showConfirmDialog,
    saveChanges,
    handleLogoUpload,
    handleCroppedImage,
  };
}
