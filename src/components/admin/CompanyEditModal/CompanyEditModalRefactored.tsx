"use client";

import React from "react";
import { X, Plus, Trash2, FileText } from "lucide-react";
import { CompanyEditModalProps } from "./types";
import { useCompanyEditForm } from "./hooks/useCompanyEditForm";
import { useCompanyActions } from "./hooks/useCompanyActions";
import { TabNavigation } from "./components/TabNavigation";
import { BasicInfoTab } from "./components/BasicInfoTab";

export default function CompanyEditModalRefactored({
  isOpen,
  onClose,
  company,
  isCreating,
  onSave,
}: CompanyEditModalProps) {
  const {
    formData,
    setFormData,
    saving,
    setSaving,
    saveSuccess,
    setSaveSuccess,
    activeTab,
    setActiveTab,
    handleInputChange,
    handleABNChange,
    handleNameChange,
  } = useCompanyEditForm(company, isCreating);

  const {
    abnLookupLoading,
    handleAbnLookup,
    handleIndustrySelection,
    generateServicesForIndustry,
    addOffice,
    updateOffice,
    removeOffice,
    addService,
    updateService,
    removeService,
    addHistory,
    updateHistory,
    removeHistory,
  } = useCompanyActions();

  // Validation
  const validate = () => {
    if (!formData.name.trim()) {
      alert("Company name is required");
      return false;
    }
    if (!formData.abn.trim()) {
      alert("ABN is required");
      return false;
    }
    if (formData.abn.replace(/\D/g, "").length !== 11) {
      alert("ABN must be 11 digits");
      return false;
    }
    return true;
  };

  // Save handler
  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      // Clean ABN before saving
      const cleanABN = formData.abn.replace(/\D/g, "");
      const companyToSave = {
        ...formData,
        abn: cleanABN,
      };

      await onSave(companyToSave);
      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error saving company:", error);
      alert("Failed to save company. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleInputChange("logo", result);
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isCreating ? "Create New Company" : "Edit Company"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-4">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          {activeTab === "basic" && (
            <BasicInfoTab
              formData={formData}
              onInputChange={handleInputChange}
              onABNChange={handleABNChange}
              onNameChange={handleNameChange}
              onIndustrySelection={(level1, level2, level3) =>
                handleIndustrySelection(level1, level2, level3, setFormData)
              }
              abnLookupLoading={abnLookupLoading}
              onAbnLookup={handleAbnLookup}
            />
          )}

          {activeTab === "offices" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Office Locations</h3>
                <button
                  onClick={() => addOffice(setFormData)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 font-medium"
                >
                  <Plus size={16} />
                  Add Office
                </button>
              </div>

              {formData.offices?.map((office, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Office {index + 1}</h4>
                    <button
                      onClick={() => removeOffice(index, setFormData)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={office.address}
                        onChange={(e) =>
                          updateOffice(
                            index,
                            "address",
                            e.target.value,
                            setFormData
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Street address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={office.city}
                        onChange={(e) =>
                          updateOffice(
                            index,
                            "city",
                            e.target.value,
                            setFormData
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="City"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={office.state}
                        onChange={(e) =>
                          updateOffice(
                            index,
                            "state",
                            e.target.value,
                            setFormData
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="State"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={office.postalCode}
                        onChange={(e) =>
                          updateOffice(
                            index,
                            "postalCode",
                            e.target.value,
                            setFormData
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Postal code"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={office.phone || ""}
                        onChange={(e) =>
                          updateOffice(
                            index,
                            "phone",
                            e.target.value,
                            setFormData
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={office.email || ""}
                        onChange={(e) =>
                          updateOffice(
                            index,
                            "email",
                            e.target.value,
                            setFormData
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        value={office.contactPerson || ""}
                        onChange={(e) =>
                          updateOffice(
                            index,
                            "contactPerson",
                            e.target.value,
                            setFormData
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="Contact person name"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={office.isHeadquarter}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const offices = formData.offices?.map((o, i) => ({
                              ...o,
                              isHeadquarter: i === index,
                            }));
                            handleInputChange("offices", offices);
                          } else {
                            updateOffice(
                              index,
                              "isHeadquarter",
                              false,
                              setFormData
                            );
                          }
                        }}
                        className="mr-2"
                      />
                      Set as Headquarters
                    </label>
                  </div>
                </div>
              ))}

              {(!formData.offices || formData.offices.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No offices added yet. Click "Add Office" to add one.
                </div>
              )}
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">Services</h3>
                  {(formData.industry_3 ||
                    formData.industry_2 ||
                    formData.industry_1) && (
                    <p className="text-sm text-gray-600 mt-1">
                      Services are auto-generated when you select an industry.
                      You can modify or add more manually.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {(formData.industry_3 ||
                    formData.industry_2 ||
                    formData.industry_1) && (
                    <button
                      onClick={() => {
                        const industryForServices =
                          formData.industry_3 ||
                          formData.industry_2 ||
                          formData.industry_1;
                        if (industryForServices) {
                          generateServicesForIndustry(
                            industryForServices,
                            setFormData
                          );
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                      <FileText size={16} />
                      Auto-Generate Services
                    </button>
                  )}
                  <button
                    onClick={() => addService(setFormData)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 font-medium"
                  >
                    <Plus size={16} />
                    Add Service
                  </button>
                </div>
              </div>

              {formData.services?.map((service, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Service {index + 1}</h4>
                    <button
                      onClick={() => removeService(index, setFormData)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) =>
                        updateService(
                          index,
                          "title",
                          e.target.value,
                          setFormData
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="e.g., Web Development"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={service.description}
                      onChange={(e) =>
                        updateService(
                          index,
                          "description",
                          e.target.value,
                          setFormData
                        )
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      placeholder="Describe this service..."
                    />
                  </div>
                </div>
              ))}

              {(!formData.services || formData.services.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No services added yet. Click "Add Service" to add one.
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Company History</h3>
                <button
                  onClick={() => addHistory(setFormData)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 font-medium"
                >
                  <Plus size={16} />
                  Add Event
                </button>
              </div>

              {formData.history?.map((event, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Event {index + 1}</h4>
                    <button
                      onClick={() => removeHistory(index, setFormData)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        value={event.year}
                        onChange={(e) =>
                          updateHistory(
                            index,
                            "year",
                            e.target.value,
                            setFormData
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        min="1800"
                        max={new Date().getFullYear()}
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Description
                      </label>
                      <input
                        type="text"
                        value={event.event}
                        onChange={(e) =>
                          updateHistory(
                            index,
                            "event",
                            e.target.value,
                            setFormData
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                        placeholder="e.g., Company founded, Launched new product"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(!formData.history || formData.history.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No history events added yet. Click "Add Event" to add one.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 font-medium disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : saveSuccess
              ? "Saved!"
              : isCreating
              ? "Create Company"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
