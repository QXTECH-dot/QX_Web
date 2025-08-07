"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/crm/shared/layout/Sidebar";
import LogoCropper from "@/components/LogoCropper";

// Import refactored components
import { useCompanyOverview } from "./hooks/useCompanyOverview";
import { useCompanyActions } from "./hooks/useCompanyActions";
import { ToastNotification } from "./components/ToastNotification";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { CompanyInfoSection } from "./components/CompanyInfoSection";
import { ProgressBar } from "./components/ProgressBar";
import { LanguageSelector } from "./components/LanguageSelector";
import { industryOptions } from "./constants";

export default function CompanyOverviewRefactored() {
  const router = useRouter();
  const {
    company,
    setCompany,
    userCompany,
    loading,
    error,
    editMode,
    setEditMode,
    editData,
    setEditData,
    toast,
    setToast,
    confirmDialog,
    setConfirmDialog,
    showCropper,
    setShowCropper,
    cropperImageSrc,
    setCropperImageSrc,
  } = useCompanyOverview();

  const {
    saving,
    showToast,
    showConfirmDialog,
    saveChanges,
    handleLogoUpload,
    handleCroppedImage,
  } = useCompanyActions();

  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Start editing
  const startEdit = (section: string) => {
    setEditMode(section);
    setEditData({ ...company });
  };

  // Cancel edit
  const cancelEdit = () => {
    if (JSON.stringify(editData) !== JSON.stringify(company)) {
      showConfirmDialog(
        setConfirmDialog,
        "Discard Changes?",
        "You have unsaved changes. Are you sure you want to discard them?",
        () => {
          setEditMode(null);
          setEditData({});
        },
        "discard"
      );
    } else {
      setEditMode(null);
      setEditData({});
    }
  };

  // Handle save
  const handleSave = (section: string) => {
    saveChanges(section, editData, company, setCompany, setEditMode, setToast);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading company information...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Loading Company Data
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => router.push("/crm/user/company")}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Go to Company Management
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <p className="text-gray-600">No company data available.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>

      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
              {/* Welcome Header */}
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {company.name || "Your Company"}!
                </h1>
                <ProgressBar company={company} />
              </div>

              {/* Company Registration Details */}
              <CompanyInfoSection company={company} />

              {/* Editable Company Info */}
              <div className="bg-white rounded shadow p-6 relative">
                {editMode === "info" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Edit Company Profile
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave("info")}
                          disabled={saving}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Industry
                        </label>
                        <select
                          value={editData.industry || ""}
                          onChange={(e) =>
                            handleInputChange("industry", e.target.value)
                          }
                          className="w-full border rounded px-3 py-2 bg-white"
                        >
                          <option value="">Select Industry</option>
                          {industryOptions.map((industry) => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          value={editData.website || ""}
                          onChange={(e) =>
                            handleInputChange("website", e.target.value)
                          }
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editData.email || ""}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={editData.phone || ""}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Languages Supported
                        </label>
                        <LanguageSelector
                          selectedLanguages={editData.languages || []}
                          onLanguageChange={(languages) =>
                            handleInputChange("languages", languages)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Company Logo
                        </label>
                        <div className="space-y-2">
                          {/* Current Logo Display */}
                          {(editData.logo || company.logo) && (
                            <div className="flex items-center space-x-3">
                              <div className="w-28 h-20 bg-white shadow-sm rounded flex items-center justify-center overflow-hidden">
                                <img
                                  src={editData.logo || company.logo}
                                  alt="Company Logo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleInputChange("logo", "")}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove Logo
                              </button>
                            </div>
                          )}

                          {/* Logo Upload */}
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleLogoUpload(
                                  e,
                                  setEditData,
                                  setShowCropper,
                                  setCropperImageSrc,
                                  setToast
                                )
                              }
                              className="w-full border rounded px-3 py-2"
                              disabled={saving}
                            />
                            <small className="text-gray-500 text-xs mt-1 block">
                              Supported formats: JPG, PNG, GIF. Max size: 5MB.
                              Logo will be cropped to 3:2 ratio (300×200px)
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">
                        Company Brief Description
                      </label>
                      <textarea
                        value={editData.shortDescription || ""}
                        onChange={(e) =>
                          handleInputChange("shortDescription", e.target.value)
                        }
                        rows={3}
                        className="w-full border rounded px-3 py-2"
                        placeholder="A brief summary of your company..."
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">
                        About Our Company
                      </label>
                      <textarea
                        value={editData.fullDescription || ""}
                        onChange={(e) =>
                          handleInputChange("fullDescription", e.target.value)
                        }
                        rows={20}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Provide a detailed description of your company, including history, mission, values, and what makes you unique..."
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold">Company Profile</h2>
                      <button
                        onClick={() => startEdit("info")}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Edit Profile
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Industry
                        </label>
                        <div className="text-base text-gray-800">
                          {company.industry || "Not specified"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Website
                        </label>
                        <div className="text-base text-gray-800">
                          {company.website ? (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {company.website}
                            </a>
                          ) : (
                            "Not specified"
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Email
                        </label>
                        <div className="text-base text-gray-800">
                          {company.email || "Not specified"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Phone
                        </label>
                        <div className="text-base text-gray-800">
                          {company.phone || "Not specified"}
                        </div>
                      </div>
                    </div>

                    {company.logo && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Company Logo
                        </label>
                        <div className="w-32 h-24 bg-white shadow-sm rounded flex items-center justify-center overflow-hidden">
                          <img
                            src={company.logo}
                            alt="Company Logo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {company.shortDescription && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          Brief Description
                        </label>
                        <p className="text-gray-800">
                          {company.shortDescription}
                        </p>
                      </div>
                    )}

                    {company.fullDescription && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-500 mb-2">
                          About Our Company
                        </label>
                        <div className="text-gray-800 whitespace-pre-wrap">
                          {company.fullDescription}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Logo Cropper Modal */}
      {showCropper && (
        <LogoCropper
          src={cropperImageSrc}
          onCropComplete={(croppedImageBlob) =>
            handleCroppedImage(
              croppedImageBlob,
              company,
              setEditData,
              setShowCropper,
              setToast
            )
          }
          onCancel={() => setShowCropper(false)}
        />
      )}

      {/* Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Confirm Dialog */}
      <ConfirmDialog
        dialog={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
}
