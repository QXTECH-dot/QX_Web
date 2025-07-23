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
import IndustrySelector from './IndustrySelector';

interface Company {
  id?: string;
  name: string;
  trading_name?: string; // 添加trading_name字段
  slug?: string; // 添加slug字段
  abn: string;
  industry: string;
  industry_1?: string; // 一级行业
  industry_2?: string; // 二级行业
  industry_3?: string; // 三级行业
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
    trading_name: '',
    abn: '',
    industry: '',
    industry_1: '',
    industry_2: '',
    industry_3: '',
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
  const [abnLookupLoading, setAbnLookupLoading] = useState(false);
  const [abnLookupError, setAbnLookupError] = useState<string | null>(null);
  const [abnLookupSuccess, setAbnLookupSuccess] = useState<string | null>(null);

  // ABN格式化工具函数
  const formatABN = (abn: string): string => {
    // 移除所有非数字字符
    const digits = abn.replace(/\D/g, '');
    
    // 限制为最多11位数字
    const limitedDigits = digits.slice(0, 11);
    
    // 格式化为 "11 222 333 444" 格式
    if (limitedDigits.length <= 2) {
      return limitedDigits;
    } else if (limitedDigits.length <= 5) {
      return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2)}`;
    } else if (limitedDigits.length <= 8) {
      return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2, 5)} ${limitedDigits.slice(5)}`;
    } else {
      return `${limitedDigits.slice(0, 2)} ${limitedDigits.slice(2, 5)} ${limitedDigits.slice(5, 8)} ${limitedDigits.slice(8)}`;
    }
  };

  // 获取纯数字的ABN（用于存储和验证）
  const getCleanABN = (abn: string): string => {
    return abn.replace(/\D/g, '');
  };

  // 生成URL友好的slug
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格替换为横杠
      .replace(/-+/g, '-') // 多个横杠替换为一个
      .replace(/^-|-$/g, '') // 移除开头和结尾的横杠
      .trim();
  };

  // 检查slug是否唯一
  const isSlugUnique = async (slug: string, excludeCompanyId?: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/companies/check-slug?slug=${encodeURIComponent(slug)}&excludeId=${excludeCompanyId || ''}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        console.error('Failed to check slug uniqueness');
        return false;
      }
      
      const result = await response.json();
      return result.isUnique;
    } catch (error) {
      console.error('Error checking slug uniqueness:', error);
      return false;
    }
  };

  // 生成唯一slug
  const generateUniqueSlug = async (name: string, excludeCompanyId?: string): Promise<string> => {
    let baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;
    
    while (!(await isSlugUnique(slug, excludeCompanyId))) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  };

  // 重置表单为空状态的函数
  const resetFormToEmpty = () => {
    setFormData({
      name: '',
      trading_name: '',
      slug: '',
      abn: '',
      industry: '',
      industry_1: '',
      industry_2: '',
      industry_3: '',
      status: 'pending',
      foundedYear: new Date().getFullYear(),
      employeeCount: '1-10',
      offices: [],
      services: [],
      history: [],
      languages: [],
    });
    
    // 清除所有状态
    setErrors({});
    setSaveSuccess(false);
    setAbnLookupError(null);
    setAbnLookupSuccess(null);
    setAbnLookupLoading(false);
    setActiveTab('basic'); // 重置到基本信息标签页
    
    console.log('表单已重置为空状态');
  };

  useEffect(() => {
    if (company && !isCreating) {
      // 编辑现有公司：格式化现有公司的ABN进行显示，并初始化行业字段
      const formattedCompany = {
        ...company,
        abn: company.abn ? formatABN(company.abn) : '',
        industry_1: company.industry_1 || '',
        industry_2: company.industry_2 || '',
        industry_3: company.industry_3 || ''
      };
      setFormData(formattedCompany);
      setErrors({}); // 清除之前的错误
      console.log('加载现有公司数据进行编辑:', company.name);
    } else if (isCreating) {
      // 创建新公司：完全重置表单
      resetFormToEmpty();
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

  // 专门处理ABN输入的函数
  const handleABNChange = (value: string) => {
    const formattedABN = formatABN(value);
    handleInputChange('abn', formattedABN);
    // 清除之前的lookup状态
    setAbnLookupError(null);
    setAbnLookupSuccess(null);
  };

  // 处理行业选择的函数
  const handleIndustrySelection = async (level1: string, level2: string, level3: string) => {
    // 更新行业信息
    const updatedFormData = {
      ...formData,
      industry_1: level1,
      industry_2: level2,
      industry_3: level3,
      // 将主要行业设置为最具体的层级
      industry: level3 || level2 || level1
    };
    
    setFormData(updatedFormData);
    
    // 清除行业相关的错误
    if (errors.industry) {
      setErrors({ ...errors, industry: '' });
    }
    
    // 重置保存成功状态
    if (saveSuccess) {
      setSaveSuccess(false);
    }
    
    // 自动生成对应的服务项目
    await generateServicesForIndustry(level3 || level2 || level1);
  };

  // 根据选择的行业自动生成服务项目
  const generateServicesForIndustry = async (selectedIndustry: string) => {
    if (!selectedIndustry) {
      console.log('❌ 未选择行业，取消生成服务');
      return;
    }
    
    try {
      console.log(`🔄 为行业 "${selectedIndustry}" 生成服务项目...`);
      
      // 调用API获取对应的服务项目
      const apiUrl = `/api/services-by-industry/?popular_name=${encodeURIComponent(selectedIndustry)}`;
      console.log('📡 API调用URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('📡 API响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📡 API返回结果:', result);
      
      if (result.success && result.data && result.data.length > 0) {
        // 将获取到的服务项目转换为公司服务格式
        const generatedServices = result.data.map((service: any) => ({
          id: undefined, // 新生成的服务不需要ID
          title: service.service_name,
          description: service.service_description || ''
        }));
        
        console.log('🔄 生成的服务项目:', generatedServices);
        
        // 合并现有服务和新生成的服务（避免重复）
        const existingServices = formData.services || [];
        const existingTitles = existingServices.map(s => s.title.toLowerCase());
        
        console.log('🔄 现有服务标题:', existingTitles);
        
        const newServices = generatedServices.filter((service: any) => 
          !existingTitles.includes(service.title.toLowerCase())
        );
        
        console.log('🔄 新增服务项目:', newServices);
        
        if (newServices.length > 0) {
          const allServices = [...existingServices, ...newServices];
          console.log('🔄 最终服务列表:', allServices);
          
          setFormData(prev => {
            const updated = { ...prev, services: allServices };
            console.log('🔄 更新formData:', updated);
            return updated;
          });
          
          console.log(`✅ 成功生成 ${newServices.length} 个服务项目`);
          
          // 显示成功提示
          setAbnLookupSuccess(`✅ 已为 "${selectedIndustry}" 自动生成 ${newServices.length} 个服务项目`);
          setTimeout(() => setAbnLookupSuccess(null), 5000);
        } else {
          console.log(`ℹ️ 没有找到新的服务项目可以添加（可能已存在）`);
          setAbnLookupSuccess(`ℹ️ 该行业的服务项目已存在，未添加重复项目`);
          setTimeout(() => setAbnLookupSuccess(null), 3000);
        }
      } else {
        console.log(`⚠️ 未找到行业 "${selectedIndustry}" 对应的服务项目`, result);
        setAbnLookupError(`未找到行业 "${selectedIndustry}" 对应的服务项目`);
        setTimeout(() => setAbnLookupError(null), 3000);
      }
    } catch (error) {
      console.error('❌ 生成服务项目失败:', error);
      setAbnLookupError(`生成服务项目失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setTimeout(() => setAbnLookupError(null), 5000);
    }
  };

  // ABN lookup功能 - 直接从ABN Registry API获取
  const handleAbnLookup = async (abn: string) => {
    // 获取纯数字ABN进行验证
    const cleanAbn = getCleanABN(abn);
    
    // 检查ABN格式（11位数字）
    if (!/^\d{11}$/.test(cleanAbn)) {
      setAbnLookupError('ABN must be 11 digits');
      return;
    }

    setAbnLookupLoading(true);
    setAbnLookupError(null);
    setAbnLookupSuccess(null);

    try {
      // 调用 ABN Registry API 通过后端路由
      const response = await fetch(`/api/admin/companies/abn-lookup?abn=${cleanAbn}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data && result.data.EntityName) {
        const abnData = result.data;
        console.log('ABN Lookup result:', abnData);
        
        // 找到匹配的州选项
        const stateMapping: { [key: string]: string } = {
          'NSW': 'NSW', 'New South Wales': 'NSW',
          'VIC': 'VIC', 'Victoria': 'VIC',
          'QLD': 'QLD', 'Queensland': 'QLD',
          'WA': 'WA', 'Western Australia': 'WA',
          'SA': 'SA', 'South Australia': 'SA',
          'TAS': 'TAS', 'Tasmania': 'TAS',
          'ACT': 'ACT', 'Australian Capital Territory': 'ACT',
          'NT': 'NT', 'Northern Territory': 'NT'
        };
        
        const mappedState = abnData.state ? stateMapping[abnData.state] || abnData.state : '';
        
        // 创建一个新的办公室对象（如果有地址信息）
        let newOffices = [...(formData.offices || [])];
        if (abnData.state && !newOffices.length) {
          newOffices = [{
            address: abnData.postcode ? `Postcode: ${abnData.postcode}` : '',
            city: '',
            state: mappedState,
            postalCode: abnData.postcode || '',
            isHeadquarter: true
          }];
        }
        
        // 自动填充公司信息
        const updatedFormData = {
          ...formData,
          name: abnData.EntityName || formData.name, // 使用ABN Registry的公司名
          trading_name: abnData.tradingName || formData.trading_name, // 自动填充交易名称
          abn: formatABN(cleanAbn), // 格式化显示ABN
          foundedYear: abnData.foundedYear || formData.foundedYear, // 自动填充成立年份
          offices: newOffices // 自动创建办公室信息
        };
        
        setFormData(updatedFormData);
        
        // 显示成功消息，包含更多信息
        const successDetails = [];
        if (abnData.EntityName) successDetails.push(`Company: ${abnData.EntityName}`);
        if (abnData.tradingName) successDetails.push(`Trading Name: ${abnData.tradingName}`);
        if (abnData.foundedYear) successDetails.push(`Founded: ${abnData.foundedYear}`);
        if (abnData.state) successDetails.push(`State: ${abnData.state}`);
        
        setAbnLookupError(null);
        setAbnLookupSuccess(`✅ Auto-filled: ${successDetails.join(', ')}`);
        console.log(`Successfully found and filled company data:`, updatedFormData);
      } else {
        setAbnLookupError(result.message || 'No active company found with this ABN in ABN Registry');
      }
    } catch (error) {
      console.error('ABN lookup error:', error);
      setAbnLookupError('Failed to lookup ABN from ABN Registry. Please try again.');
    } finally {
      setAbnLookupLoading(false);
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
    
    // Industry字段改为非必填
    // const industryValue = Array.isArray(formData.industry) ? formData.industry[0] : formData.industry;
    // if (!industryValue) newErrors.industry = 'Industry is required';

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      setSaving(true);
      setSaveSuccess(false);
      
      try {
        // 决定用于生成slug的名称：优先使用trading_name，否则使用name
        const nameForSlug = formData.trading_name?.trim() || formData.name?.trim();
        
        // 生成唯一的slug
        let slug = formData.slug; // 保留现有slug（如果有）
        
        // 如果是新建公司，或者公司名/交易名发生了变化，重新生成slug
        const shouldRegenerateSlug = isCreating || 
          (nameForSlug && (!company || 
            (company.name !== formData.name || company.trading_name !== formData.trading_name)));
        
        if (shouldRegenerateSlug && nameForSlug) {
          console.log(`Generating slug from name: "${nameForSlug}"`);
          slug = await generateUniqueSlug(nameForSlug, company?.id);
          console.log(`Generated slug: "${slug}"`);
        }
        
        // 确保数据格式正确
        const cleanFormData = {
          ...formData,
          slug, // 设置生成的slug
          industry: Array.isArray(formData.industry) ? formData.industry[0] : formData.industry,
          industry_1: formData.industry_1 || '',
          industry_2: formData.industry_2 || '',
          industry_3: formData.industry_3 || '',
          abn: getCleanABN(formData.abn || ''), // 保存时使用纯数字ABN
          foundedYear: formData.foundedYear || new Date().getFullYear(),
        };
        
        console.log('Saving company data:', cleanFormData);
        await onSave(cleanFormData);
        
        setSaveSuccess(true);
        
        if (isCreating) {
          // 创建模式：显示成功信息后自动重置表单
          setTimeout(() => {
            setSaveSuccess(false);
            resetFormToEmpty(); // 重置表单，准备创建下一个公司
          }, 2000); // 2秒后自动重置
        } else {
          // 编辑模式：更新本地formData以反映新的slug
          setFormData(prev => ({ ...prev, slug }));
          // 3秒后隐藏成功提示
          setTimeout(() => setSaveSuccess(false), 3000);
        }
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
                  {isCreating 
                    ? 'Company created successfully! Form will reset in 2 seconds for next company...' 
                    : 'Company information updated successfully!'
                  }
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
                <div className="flex items-center gap-4 justify-between">
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
                  
                  {/* URL Slug Display */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700 mb-1">URL Slug</div>
                    <div className="text-xs text-gray-500">
                      {formData.slug ? (
                        <span className="bg-gray-100 px-2 py-1 rounded font-mono">
                          {formData.slug}
                        </span>
                      ) : (
                        <span className="text-red-500 italic">Auto-generated on save</span>
                      )}
                    </div>
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
                    Trading Name
                  </label>
                  <input
                    type="text"
                    value={formData.trading_name || ''}
                    onChange={(e) => handleInputChange('trading_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Enter trading name (optional)"
                  />
                </div>

                {/* URL Slug Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug <span className="text-gray-500 text-xs">(Auto-generated from {formData.trading_name?.trim() ? 'Trading Name' : 'Company Name'})</span>
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                    {formData.slug || 'Will be generated when saved'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    URL: qxweb.com.au/company/{formData.slug || 'company-slug'}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ABN
                    <span className="text-xs text-gray-500 ml-2">(Enter ABN and click Auto-Fill to get company name)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.abn || ''}
                      onChange={(e) => handleABNChange(e.target.value)}
                      className={`flex-1 px-3 py-2 border rounded-md focus:ring-primary focus:border-primary ${
                        errors.abn ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter 11-digit ABN, then click Lookup to auto-fill company name"
                    />
                    <button
                      type="button"
                      onClick={() => handleAbnLookup(formData.abn || '')}
                      disabled={abnLookupLoading || !formData.abn}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {abnLookupLoading ? 'Searching...' : 'Auto-Fill'}
                    </button>
                  </div>
                  {errors.abn && (
                    <p className="mt-1 text-sm text-red-600">{errors.abn}</p>
                  )}
                  {abnLookupError && (
                    <p className="mt-1 text-sm text-red-600">{abnLookupError}</p>
                  )}
                  {abnLookupSuccess && (
                    <p className="mt-1 text-sm text-green-600">{abnLookupSuccess}</p>
                  )}
                  {abnLookupLoading && (
                    <p className="mt-1 text-sm text-blue-600">Searching ABN Registry...</p>
                  )}
                </div>

                {/* Industry Selection - New Cascading Selector */}
                <div className="md:col-span-2">
                  <IndustrySelector
                    selectedIndustry1={formData.industry_1 || ''}
                    selectedIndustry2={formData.industry_2 || ''}
                    selectedIndustry3={formData.industry_3 || ''}
                    onSelectionChange={handleIndustrySelection}
                  />
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
                <div>
                  <h3 className="text-lg font-medium">Services</h3>
                  {(formData.industry_3 || formData.industry_2 || formData.industry_1) && (
                    <p className="text-sm text-gray-600 mt-1">
                      Services are auto-generated when you select an industry. You can modify or add more manually.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {(formData.industry_3 || formData.industry_2 || formData.industry_1) && (
                    <button
                      onClick={() => {
                        const industryForServices = formData.industry_3 || formData.industry_2 || formData.industry_1;
                        console.log('Auto-generate button clicked, using industry:', industryForServices);
                        generateServicesForIndustry(industryForServices);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                      <FileText size={16} />
                      Auto-Generate Services
                    </button>
                  )}
                  <button
                    onClick={addService}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 font-medium"
                  >
                    <Plus size={16} />
                    Add Service
                  </button>
                </div>
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