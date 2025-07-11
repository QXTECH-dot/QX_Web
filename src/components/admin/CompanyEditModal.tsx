'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  FileText,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface Company {
  id?: string;
  name: string;
  abn: string;
  industry: string;
  status: 'active' | 'pending' | 'suspended';
  foundedYear: number;
  website?: string;
  email?: string;
  phone?: string;
  logo?: string;
  employeeCount: string;
  shortDescription?: string;
  fullDescription?: string;
  languages?: string[];
  offices?: Office[];
  services?: Service[];
  history?: HistoryEvent[];
}

interface Office {
  id?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  isHeadquarter: boolean;
}

interface Service {
  id?: string;
  title: string;
  description: string;
}

interface HistoryEvent {
  id?: string;
  year: string;
  event: string;
}

interface CompanyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  isCreating: boolean;
  onSave: (company: Company) => Promise<void>;
}

const industryOptions = Array.from(new Set([
  'Agriculture, Forestry and Fishing',
  'Mining',
  'Manufacturing',
  'Electricity, Gas, Water and Waste Services',
  'Construction',
  'Wholesale Trade',
  'Retail Trade',
  'Accommodation and Food Services',
  'Transport, Postal and Warehousing',
  'Information Media and Telecommunications',
  'Financial and Insurance Services',
  'Rental, Hiring and Real Estate Services',
  'Professional, Scientific and Technical Services',
  'Administrative and Support Services',
  'Public Administration and Safety',
  'Education and Training',
  'Health Care and Social Assistance',
  'Arts and Recreation Services',
  'Other Services',
]));


const employeeCountOptions = [
  '1-10',
  '11-50',
  '51-100',
  '101-200',
  '201-500',
  '500+',
];

const stateOptions = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

export default function CompanyEditModal({
  isOpen,
  onClose,
  company,
  isCreating,
  onSave,
}: CompanyEditModalProps) {
  const [formData, setFormData] = useState<Company>({
    name: '',
    abn: '',
    industry: '',
    status: 'pending',
    foundedYear: new Date().getFullYear(),
    employeeCount: '1-10',
    offices: [],
    services: [],
    history: [],
    languages: [],
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData(company);
    } else if (isCreating) {
      setFormData({
        name: '',
        abn: '',
        industry: '',
        status: 'pending',
        foundedYear: new Date().getFullYear(),
        employeeCount: '1-10',
        offices: [],
        services: [],
        history: [],
        languages: [],
      });
    }
  }, [company, isCreating]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
    // 重置保存成功状态，当用户做出新的修改时
    if (saveSuccess) {
      setSaveSuccess(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addOffice = () => {
    const newOffice: Office = {
      address: '',
      city: '',
      state: 'NSW',
      postalCode: '',
      isHeadquarter: formData.offices?.length === 0,
    };
    handleInputChange('offices', [...(formData.offices || []), newOffice]);
  };

  const updateOffice = (index: number, field: string, value: any) => {
    const offices = [...(formData.offices || [])];
    offices[index] = { ...offices[index], [field]: value };
    handleInputChange('offices', offices);
  };

  const removeOffice = (index: number) => {
    const offices = (formData.offices || []).filter((_, i) => i !== index);
    handleInputChange('offices', offices);
  };

  const addService = () => {
    const newService: Service = {
      title: '',
      description: '',
    };
    handleInputChange('services', [...(formData.services || []), newService]);
  };

  const updateService = (index: number, field: string, value: string) => {
    const services = [...(formData.services || [])];
    services[index] = { ...services[index], [field]: value };
    handleInputChange('services', services);
  };

  const removeService = (index: number) => {
    const services = (formData.services || []).filter((_, i) => i !== index);
    handleInputChange('services', services);
  };

  const addHistory = () => {
    const newHistory: HistoryEvent = {
      year: new Date().getFullYear().toString(),
      event: '',
    };
    handleInputChange('history', [...(formData.history || []), newHistory]);
  };

  const updateHistory = (index: number, field: string, value: string) => {
    const history = [...(formData.history || [])];
    history[index] = { ...history[index], [field]: value };
    handleInputChange('history', history);
  };

  const removeHistory = (index: number) => {
    const history = (formData.history || []).filter((_, i) => i !== index);
    handleInputChange('history', history);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    console.log('Validating form data:', formData);
    
    if (!formData.name) newErrors.name = 'Company name is required';
    // 暂时不要求ABN为必填字段
    // if (!formData.abn) newErrors.abn = 'ABN is required';
    
    // 检查industry字段，支持数组和字符串
    const industryValue = Array.isArray(formData.industry) ? formData.industry[0] : formData.industry;
    if (!industryValue) newErrors.industry = 'Industry is required';

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      setSaving(true);
      setSaveSuccess(false);
      
      // 确保数据格式正确
      const cleanFormData = {
        ...formData,
        industry: Array.isArray(formData.industry) ? formData.industry[0] : formData.industry,
        abn: formData.abn || '',
        foundedYear: formData.foundedYear || new Date().getFullYear(),
      };
      
      console.log('Saving company data:', cleanFormData);
      try {
        await onSave(cleanFormData);
        setSaveSuccess(true);
        // 3秒后隐藏成功提示
        setTimeout(() => setSaveSuccess(false), 3000);
        // 不关闭模态框，让用户继续编辑
      } catch (error) {
        console.error('Error in modal save:', error);
      } finally {
        setSaving(false);
      }
    } else {
      console.log('Validation failed:', errors);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'offices', label: 'Offices', icon: MapPin },
    { id: 'services', label: 'Services', icon: FileText },
    { id: 'history', label: 'History', icon: Calendar },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isCreating ? 'Create New Company' : `Edit ${formData.name}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Company information saved successfully!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                    ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                <div className="flex items-center gap-4">
                  {formData.logo ? (
                    <img
                      src={formData.logo}
                      alt="Company logo"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 size={30} className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Upload size={16} />
                      Upload Logo
                    </label>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ABN
                  </label>
                  <input
                    type="text"
                    value={formData.abn || ''}
                    onChange={(e) => handleInputChange('abn', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary ${
                      errors.abn ? 'border-red-300' : 'border-gray-300'
                    }`}
                    maxLength={11}
                    placeholder="Enter ABN if available"
                  />
                  {errors.abn && (
                    <p className="mt-1 text-sm text-red-600">{errors.abn}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry *
                  </label>
                  <select
                    value={Array.isArray(formData.industry) ? formData.industry[0] : formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary ${
                      errors.industry ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Industry</option>
                    {industryOptions.map((industry, index) => (
                      <option key={`industry-${index}`} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Founded Year
                  </label>
                  <input
                    type="number"
                    value={formData.foundedYear}
                    onChange={(e) => handleInputChange('foundedYear', parseInt(e.target.value) || new Date().getFullYear())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Count
                  </label>
                  <select
                    value={formData.employeeCount}
                    onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    {employeeCountOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Languages
                  </label>
                  <LanguageSelector
                    selectedLanguages={formData.languages || []}
                    onChange={(languages) => handleInputChange('languages', languages)}
                    placeholder="Select languages supported by your company..."
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  value={formData.shortDescription || ''}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief company description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description
                </label>
                <textarea
                  value={formData.fullDescription || ''}
                  onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed company description..."
                />
              </div>
            </div>
          )}

          {activeTab === 'offices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Office Locations</h3>
                <button
                  onClick={addOffice}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 font-medium"
                >
                  <Plus size={16} />
                  Add Office
                </button>
              </div>

              {formData.offices?.map((office, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">
                      Office {index + 1}
                      {office.isHeadquarter && (
                        <span className="ml-2 text-sm text-blue-600">(Headquarters)</span>
                      )}
                    </h4>
                    <button
                      onClick={() => removeOffice(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={office.address}
                        onChange={(e) => updateOffice(index, 'address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={office.city}
                        onChange={(e) => updateOffice(index, 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <select
                        value={office.state}
                        onChange={(e) => updateOffice(index, 'state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      >
                        {stateOptions.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={office.postalCode}
                        onChange={(e) => updateOffice(index, 'postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={office.phone || ''}
                        onChange={(e) => updateOffice(index, 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={office.email || ''}
                        onChange={(e) => updateOffice(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        value={office.contactPerson || ''}
                        onChange={(e) => updateOffice(index, 'contactPerson', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={office.isHeadquarter}
                          onChange={(e) => {
                            // If setting as headquarter, unset all others
                            if (e.target.checked) {
                              const offices = formData.offices?.map((o, i) => ({
                                ...o,
                                isHeadquarter: i === index,
                              }));
                              handleInputChange('offices', offices);
                            } else {
                              updateOffice(index, 'isHeadquarter', false);
                            }
                          }}
                          className="mr-2"
                        />
                        Set as Headquarters
                      </label>
                    </div>
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

          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Services</h3>
                <button
                  onClick={addService}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 font-medium"
                >
                  <Plus size={16} />
                  Add Service
                </button>
              </div>

              {formData.services?.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Service {index + 1}</h4>
                    <button
                      onClick={() => removeService(index)}
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
                      onChange={(e) => updateService(index, 'title', e.target.value)}
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
                      onChange={(e) => updateService(index, 'description', e.target.value)}
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

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Company History</h3>
                <button
                  onClick={addHistory}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 font-medium"
                >
                  <Plus size={16} />
                  Add Event
                </button>
              </div>

              {formData.history?.map((event, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Event {index + 1}</h4>
                    <button
                      onClick={() => removeHistory(index)}
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
                        onChange={(e) => updateHistory(index, 'year', e.target.value)}
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
                        onChange={(e) => updateHistory(index, 'event', e.target.value)}
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
            onClick={(e) => {
              e.preventDefault();
              console.log('Save button clicked!');
              console.log('Current saving state:', saving);
              console.log('Current formData:', formData);
              handleSave();
            }}
            disabled={saving}
            className="px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 font-medium disabled:opacity-50 cursor-pointer"
            type="button"
          >
            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : isCreating ? 'Create Company' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}