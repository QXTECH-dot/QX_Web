'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Sidebar from '@/components/crm/shared/layout/Sidebar';
import { getCompanyById, getOfficesByCompanyId, getServicesByCompanyId, getHistoryByCompanyId } from '@/lib/firebase/services/company';
import { syncFirebaseAuth } from '@/lib/firebase/auth';
import { getCompaniesByUser } from '@/lib/firebase/services/userCompany';
import { db, storage } from '@/lib/firebase/config';
import { Company } from '@/types/company';
import LogoCropper from '@/components/LogoCropper';

// 澳洲行业标准选项（从firebase_industry_data.json提取主要分类）
const industryOptions = [
  'Agriculture Forestry and Fishing',
  'Mining',
  'Manufacturing',
  'Electricity Gas Water and Waste Services',
  'Construction',
  'Wholesale Trade',
  'Retail Trade',
  'Accommodation and Food Services',
  'Transport Postal and Warehousing',
  'Information Media and Telecommunications',
  'Financial and Insurance Services',
  'Rental Hiring and Real Estate Services',
  'Professional Scientific and Technical Services',
  'Administrative and Support Services',
  'Public Administration and Safety',
  'Education and Training',
  'Health Care and Social Assistance',
  'Arts and Recreation Services',
  'Other Services'
];

// 语言选项（常用语言）
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'th', label: 'Thai' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'id', label: 'Indonesian' },
  { value: 'ms', label: 'Malay' },
  { value: 'tl', label: 'Filipino' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'ur', label: 'Urdu' },
  { value: 'bn', label: 'Bengali' },
  { value: 'pa', label: 'Punjabi' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'kn', label: 'Kannada' },
  { value: 'gu', label: 'Gujarati' }
];

export default function CompanyOverviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [userCompany, setUserCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'delete' | 'discard' | 'confirm';
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    type: 'confirm',
    onConfirm: () => {},
    onCancel: () => {}
  });
  
  // Logo裁剪相关状态
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string>('');

  // 自定义语言选择组件
  const LanguageSelector = ({ selectedLanguages, onLanguageChange }: {
    selectedLanguages: string[];
    onLanguageChange: (languages: string[]) => void;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭下拉列表
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    const toggleLanguage = (langCode: string) => {
      const newSelection = selectedLanguages.includes(langCode)
        ? selectedLanguages.filter(code => code !== langCode)
        : [...selectedLanguages, langCode];
      
      onLanguageChange(newSelection);
    };

    const getSelectedLanguageNames = () => {
      return selectedLanguages.map(code => {
        const lang = languageOptions.find(l => l.value === code);
        return lang ? lang.label : code;
      });
    };

    return (
      <div className="relative" ref={dropdownRef}>
        <div
          className="w-full border rounded px-3 py-2 bg-white cursor-pointer min-h-[40px] flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-1">
            {selectedLanguages.length > 0 ? (
              selectedLanguages.map((langCode, index) => {
                const lang = languageOptions.find(l => l.value === langCode);
                return (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {lang ? lang.label : langCode}
                    <button
                      className="ml-1 text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLanguage(langCode);
                      }}
                    >
                      ×
                    </button>
                  </span>
                );
              })
            ) : (
              <span className="text-gray-500">Select languages...</span>
            )}
          </div>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {languageOptions.map((lang) => (
              <div
                key={lang.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                  selectedLanguages.includes(lang.value) ? 'bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => toggleLanguage(lang.value)}
              >
                <span>{lang.label}</span>
                {selectedLanguages.includes(lang.value) && (
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!session?.user?.email) {
          setError('User not authenticated');
          return;
        }

        // 获取用户与公司的绑定关系
        const userCompanies = await getCompaniesByUser(session.user.email);
        
        if (!userCompanies || userCompanies.length === 0) {
          setError('No company binding found for this user');
          return;
        }

        const userCompany = userCompanies[0]; // 获取第一个绑定的公司
        setUserCompany(userCompany);

        // 获取公司基本信息
        const companyDetails = await getCompanyById(userCompany.companyId);
        
        if (companyDetails) {
          // 并行获取offices、services、history数据
          const [officesData, servicesData, historyData] = await Promise.all([
            getOfficesByCompanyId(userCompany.companyId),
            getServicesByCompanyId(userCompany.companyId),
            getHistoryByCompanyId(userCompany.companyId)
          ]);

          const updatedCompany = {
            ...companyDetails,
            // 确保name字段正确映射
            name: companyDetails.name_en || companyDetails.name || '',
            role: userCompany.role,
            bindingId: userCompany.id,
            userEmail: userCompany.email,
            offices: officesData.length > 0 ? officesData.map(office => ({
              id: office.officeId,
              address: office.address,
              city: office.city,
              state: office.state,
              postalCode: office.postalCode,
              phone: office.phone,
              email: office.email || '',
              contactPerson: office.contactPerson,
              isHeadquarter: office.isHeadquarter
            })) : [
              {
                id: 'office-001',
                address: 'Level 6, 82 Northbourne Avenue Braddon',
                city: 'Canberra',
                state: 'ACT',
                postalCode: '2612',
                phone: '(02) 6255 0430',
                email: 'contact@example.com',
                contactPerson: 'John Smith',
                isHeadquarter: true
              }
            ],
            services: servicesData.length > 0 ? servicesData.map(service => ({
              id: service.serviceId,
              title: service.title,
              description: service.description
            })) : [
              {
                id: 'service-001',
                title: 'Project Planning',
                description: 'Developing comprehensive property development roadmaps with strategic timelines and resource allocation frameworks.'
              },
              {
                id: 'service-002',
                title: 'Consulting Services',
                description: 'Expert advice and guidance for business strategy and implementation.'
              }
            ],
            history: historyData.length > 0 ? historyData.map(history => ({
              id: history.historyId,
              year: history.date, // 注意：company.ts中使用的是date字段，不是year
              event: history.description // 注意：company.ts中使用的是description字段，不是event
            })) : [
              {
                id: 'history-001',
                year: '2012',
                event: 'VUE project launched'
              },
              {
                id: 'history-002',
                year: '2018',
                event: 'Expanded operations to international markets'
              }
            ]
          };
          setCompany(updatedCompany);
        } else {
          setError('Company information not found');
        }
      } catch (error: any) {
        setError('Failed to load company data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [session]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && confirmDialog.show) {
        closeConfirmDialog();
      }
    };

    if (confirmDialog.show) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [confirmDialog.show]);

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 显示确认对话框
  const showConfirmDialog = (title: string, message: string, onConfirm: () => void, type: 'delete' | 'discard' | 'confirm' = 'confirm') => {
    setConfirmDialog({
      show: true,
      title,
      message,
      type,
      onConfirm,
      onCancel: () => setConfirmDialog(prev => ({ ...prev, show: false }))
    });
  };

  // 关闭确认对话框
  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, show: false }));
  };

  // 保存编辑数据到数据库
  const saveChanges = async (section: string, data: any) => {
    try {
      setSaving(true);
      
      // 如果有name字段，也更新name_en字段
      const updateData = { ...data };
      if (data.name) {
        updateData.name_en = data.name;
      }
      
      const { updateCompany } = await import('@/lib/firebase/services/company');
      await updateCompany(company.companyId, updateData);
      
      // 更新本地状态
      setCompany({ ...company, ...data });
      setEditMode(null);
      setEditData({});
      
      showToast('Changes saved successfully!', 'success');
    } catch (error: any) {
      showToast('Failed to save changes: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // 开始编辑
  const startEdit = (section: string) => {
    setEditMode(section);
    if (section === 'info') {
      setEditData({
        industry: company.industry || '',
        website: company.website || '',
        email: company.email || company.verifiedEmail || '',
        phone: company.phone || '',
        shortDescription: company.shortDescription || '',
        fullDescription: company.fullDescription || '',
        languages: (company as any).languages || [],
        logo: company.logo || ''
      });
    } else if (section === 'offices') {
      setEditData({
        offices: (company as any).offices || [],
        newOffice: {
          address: '',
          city: '',
          state: '',
          postalCode: '',
          phone: '',
          email: '',
          contactPerson: '',
          isHeadquarter: false
        }
      });
    } else if (section === 'services') {
      setEditData({
        services: (company as any).services || [],
        newService: {
          title: '',
          description: ''
        }
      });
    } else if (section === 'history') {
      setEditData({
        history: (company as any).history || [],
        newHistory: {
          year: new Date().getFullYear().toString(),
          event: ''
        }
      });
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    // 检查是否有未保存的修改
    const hasUnsavedChanges = Object.keys(editData).length > 0;
    
    if (hasUnsavedChanges) {
      const handleConfirm = () => {
        setEditMode(null);
        setEditData({});
        closeConfirmDialog();
      };

      showConfirmDialog(
        'Discard changes',
        'Are you sure you want to discard your changes? All unsaved modifications will be lost.',
        handleConfirm,
        'discard'
      );
    } else {
      setEditMode(null);
      setEditData({});
    }
  };

  // 更新编辑数据
  const handleInputChange = (field: string, value: string | string[]) => {
    setEditData({ ...editData, [field]: value });
  };

  // 保存办公室数据
  const saveOffices = async () => {
    try {
      setSaving(true);
      
      const { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp, getDocs, query, where, setDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase/config');
      
      // Delete existing offices for this company
      const officesRef = collection(db, 'offices');
      const q = query(officesRef, where('companyId', '==', company.companyId));
      const querySnapshot = await getDocs(q);
      
      // Delete old offices
      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(docSnapshot.ref);
      }
      
      // Add new offices with formatted document IDs
      // 按州分组计数
      const stateCounters: { [state: string]: number } = {};
      
      for (const office of editData.offices) {
        const state = office.state || 'UNK';
        
        // 为每个州初始化计数器或递增
        if (!stateCounters[state]) {
          stateCounters[state] = 1;
        } else {
          stateCounters[state]++;
        }
        
        const docId = `${company.companyId}_${state}_${String(stateCounters[state]).padStart(2, '0')}`;
        
        await setDoc(doc(db, 'offices', docId), {
          companyId: company.companyId,
          address: office.address || '',
          city: office.city || '',
          state: office.state || '',
          postalCode: office.postalCode || '',
          phone: office.phone || '',
          email: office.email || '',
          contactPerson: office.contactPerson || '',
          isHeadquarter: office.isHeadquarter || false,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
      
      // Update local state
      setCompany({ ...company, offices: editData.offices } as any);
      setEditMode(null);
      setEditData({});
      
      showToast('Office locations updated successfully!', 'success');
    } catch (error: any) {
      showToast('Failed to update offices: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // 保存服务数据
  const saveServices = async () => {
    try {
      setSaving(true);
      
      const { collection, addDoc, deleteDoc, Timestamp, getDocs, query, where, setDoc, doc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase/config');
      
      // Delete existing services for this company
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, where('companyId', '==', company.companyId));
      const querySnapshot = await getDocs(q);
      
      // Delete old services
      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(docSnapshot.ref);
      }
      
      // Add new services with formatted document IDs
      for (let i = 0; i < editData.services.length; i++) {
        const service = editData.services[i];
        const docId = `${company.companyId}_SERVICES_${String(i + 1).padStart(2, '0')}`;
        
        await setDoc(doc(db, 'services', docId), {
          companyId: company.companyId,
          title: service.title || '',
          description: service.description || '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
      
      // Update local state
      setCompany({ ...company, services: editData.services } as any);
      setEditMode(null);
      setEditData({});
      
      showToast('Services updated successfully!', 'success');
    } catch (error: any) {
      showToast('Failed to update services: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // 保存历史数据
  const saveHistory = async () => {
    try {
      setSaving(true);
      
      const { collection, addDoc, deleteDoc, Timestamp, getDocs, query, where, setDoc, doc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase/config');
      
      // Delete existing history for this company
      const historyRef = collection(db, 'history'); // 使用现有的history集合
      const q = query(historyRef, where('companyId', '==', company.companyId));
      const querySnapshot = await getDocs(q);
      
      // Delete old history
      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(docSnapshot.ref);
      }
      
      // Add new history with formatted document IDs
      // 按年份分组计数，支持同一年的多个事件
      const yearCounters: { [year: string]: number } = {};
      
      for (const historyItem of editData.history) {
        const year = historyItem.year || 'UNK';
        
        // 为每年初始化计数器或递增
        if (!yearCounters[year]) {
          yearCounters[year] = 1;
        } else {
          yearCounters[year]++;
        }
        
        const docId = `${company.companyId}_HISTORY_${year}_${String(yearCounters[year]).padStart(2, '0')}`;
        
        await setDoc(doc(db, 'history', docId), {
          companyId: company.companyId,
          date: historyItem.year || '', // 保存为date字段
          description: historyItem.event || '', // 保存为description字段
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }
      
      // Update local state
      setCompany({ ...company, history: editData.history } as any);
      setEditMode(null);
      setEditData({});
      
      showToast('Company history updated successfully!', 'success');
    } catch (error: any) {
      showToast('Failed to update history: ' + error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // 添加新项目
  const addNewItem = (type: string) => {
    if (type === 'office') {
      // 验证必填字段
      if (!editData.newOffice?.address || !editData.newOffice?.city) {
        showToast('Please fill in address and city fields', 'error');
        return;
      }
      
      const newOffice = { ...editData.newOffice, id: Date.now().toString() };
      setEditData({
        ...editData,
        offices: [...editData.offices, newOffice],
        newOffice: {
          address: '',
          city: '',
          state: '',
          postalCode: '',
          phone: '',
          email: '',
          contactPerson: '',
          isHeadquarter: false
        }
      });
    } else if (type === 'service') {
      // 验证必填字段
      if (!editData.newService?.title || !editData.newService?.description) {
        showToast('Please fill in title and description fields', 'error');
        return;
      }
      
      const newService = { ...editData.newService, id: Date.now().toString() };
      setEditData({
        ...editData,
        services: [...editData.services, newService],
        newService: { title: '', description: '' }
      });
    } else if (type === 'history') {
      // 验证必填字段
      if (!editData.newHistory?.year || !editData.newHistory?.event) {
        showToast('Please fill in year and event fields', 'error');
        return;
      }
      
      // 验证年份格式
      const year = parseInt(editData.newHistory.year);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 10) {
        showToast('Please enter a valid year between 1900 and ' + (new Date().getFullYear() + 10), 'error');
        return;
      }
      
      const newHistory = { ...editData.newHistory, id: Date.now().toString() };
      setEditData({
        ...editData,
        history: [...editData.history, newHistory],
        newHistory: { year: new Date().getFullYear().toString(), event: '' }
      });
    }
  };

  // 删除项目
  const removeItem = (type: string, index: number) => {
    const typeLabels = {
      'office': 'office location',
      'service': 'service',
      'history': 'history event'
    };
    
    const itemLabel = typeLabels[type as keyof typeof typeLabels] || 'item';
    
    const handleConfirm = () => {
      if (type === 'office') {
        const newOffices = editData.offices.filter((_: any, i: number) => i !== index);
        setEditData({ ...editData, offices: newOffices });
      } else if (type === 'service') {
        const newServices = editData.services.filter((_: any, i: number) => i !== index);
        setEditData({ ...editData, services: newServices });
      } else if (type === 'history') {
        const newHistory = editData.history.filter((_: any, i: number) => i !== index);
        setEditData({ ...editData, history: newHistory });
      }
      closeConfirmDialog();
    };

    showConfirmDialog(
      `Delete ${itemLabel}`,
      `Are you sure you want to delete this ${itemLabel}? This action cannot be undone.`,
      handleConfirm,
      'delete'
    );
  };

  // 更新项目数据
  const updateItem = (type: string, index: number, field: string, value: any) => {
    if (type === 'office') {
      const newOffices = [...editData.offices];
      newOffices[index] = { ...newOffices[index], [field]: value };
      setEditData({ ...editData, offices: newOffices });
    } else if (type === 'service') {
      const newServices = [...editData.services];
      newServices[index] = { ...newServices[index], [field]: value };
      setEditData({ ...editData, services: newServices });
    } else if (type === 'history') {
      const newHistory = [...editData.history];
      newHistory[index] = { ...newHistory[index], [field]: value };
      setEditData({ ...editData, history: newHistory });
    }
  };

  // 更新新项目数据
  const updateNewItem = (type: string, field: string, value: any) => {
    if (type === 'office') {
      setEditData({
        ...editData,
        newOffice: { ...editData.newOffice, [field]: value }
      });
    } else if (type === 'service') {
      setEditData({
        ...editData,
        newService: { ...editData.newService, [field]: value }
      });
    } else if (type === 'history') {
      setEditData({
        ...editData,
        newHistory: { ...editData.newHistory, [field]: value }
      });
    }
  };

  // 处理Logo上传
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件大小（5MB限制）
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be less than 5MB', 'error');
      return;
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    // 创建图片预览URL，并预处理图片尺寸
    const imageUrl = URL.createObjectURL(file);
    
    // 检查图片尺寸，如果太大就先缩放
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setCropperImageSrc(imageUrl);
        setShowCropper(true);
        return;
      }

      // 如果图片很大，先缩放到合理尺寸以提升性能
      const maxDisplaySize = 1200; // 最大显示尺寸
      let { width, height } = img;
      
      if (width > maxDisplaySize || height > maxDisplaySize) {
        const scale = Math.min(maxDisplaySize / width, maxDisplaySize / height);
        width *= scale;
        height *= scale;
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const scaledImageUrl = URL.createObjectURL(blob);
            // 清理原始URL
            URL.revokeObjectURL(imageUrl);
            setCropperImageSrc(scaledImageUrl);
            setShowCropper(true);
          }
        }, 'image/jpeg', 0.9);
      } else {
        // 图片尺寸合适，直接使用
        setCropperImageSrc(imageUrl);
        setShowCropper(true);
      }
    };
    
    img.onerror = () => {
      showToast('Failed to load image. Please try another file.', 'error');
      URL.revokeObjectURL(imageUrl);
    };
    
    img.src = imageUrl;
    
    // 重置文件输入
    event.target.value = '';
  };

  // 处理裁剪完成
  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      setSaving(true);
      setShowCropper(false);
      showToast('Uploading logo...', 'success');

      // 生成文件名：公司名 + 文件扩展名，空格替换为下划线
      const companyName = company.name || 'Unknown_Company';
      const cleanCompanyName = companyName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const fileName = `${cleanCompanyName}.png`; // 裁剪后统一使用PNG格式

      // 创建Storage引用
      const logoRef = ref(storage, `company-logos/${fileName}`);

      // 上传裁剪后的图片
      const snapshot = await uploadBytes(logoRef, croppedImageBlob);
      
      // 获取下载URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 更新编辑状态
      handleInputChange('logo', downloadURL);
      
      showToast('Logo uploaded successfully!', 'success');
    } catch (error: any) {
      showToast('Failed to upload logo: ' + error.message, 'error');
    } finally {
      setSaving(false);
      // 清理预览URL
      if (cropperImageSrc) {
        URL.revokeObjectURL(cropperImageSrc);
        setCropperImageSrc('');
      }
    }
  };

  // 取消裁剪
  const handleCropCancel = () => {
    setShowCropper(false);
    if (cropperImageSrc) {
      URL.revokeObjectURL(cropperImageSrc);
      setCropperImageSrc('');
    }
  };

  if (loading) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
              <div>Loading company information...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-red-800 mb-4">{error}</div>
              <div className="flex gap-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Refresh Page
                </button>
                <button 
                  onClick={() => router.push('/crm/user/company')} 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Back to Company Binding
                </button>
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
        <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-gray-500">
              <div className="mb-4">No company information found</div>
              <button 
                onClick={() => router.push('/crm/user/company')} 
                className="px-4 py-2 bg-primary text-white rounded hover:bg-yellow-500 transition"
              >
                Bind Company
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 计算完成度（根据已填写的字段）
  const calculateCompletionPercent = (company: any) => {
    const fields = [
      company.name, 
      company.abn, 
      company.industry, 
      company.website, 
      company.email, 
      company.phone, 
      company.shortDescription,
      (company.languages && company.languages.length > 0) ? 'languages' : null, // 检查languages数组是否有内容
      company.logo // 3:2比例的公司logo
    ];
    const filledFields = fields.filter(field => field && field.toString().trim()).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercent = calculateCompletionPercent(company);

  return (
    <div className="min-h-screen bg-gray-50">
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
          {/* 顶部：欢迎标题+进度条 */}
          <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {company.name || 'Your Company'}!</h1>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Profile Completion</label>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full"
                      style={{ width: `${completionPercent}%` }}
                />
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                    {completionPercent}%
              </div>
            </div>
          </div>

          {/* Non-editable Company Info */}
          <div className="bg-gray-50 border-l-4 border-gray-400 rounded shadow p-6 mb-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Company Registration Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Company Name</label>
                <div className="text-base font-semibold text-gray-800">{company.name || 'N/A'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">ABN</label>
                <div className="text-base font-mono text-gray-800">{company.abn || 'N/A'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Founded Year</label>
                <div className="text-base text-gray-800">{company.foundedYear || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Editable Company Info */}
          <div className="bg-white rounded shadow p-6 relative">
                {editMode === 'info' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Edit Company Profile</h2>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => saveChanges('info', editData)}
                          disabled={saving}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save'}
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
                        <label className="block text-sm font-medium mb-1">Industry</label>
                        <select
                          value={editData.industry || ''}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          className="w-full border rounded px-3 py-2 bg-white"
                        >
                          <option value="">Select Industry</option>
                          {industryOptions.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Website</label>
                        <input
                          type="url"
                          value={editData.website || ''}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email"
                          value={editData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                          type="tel"
                          value={editData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Languages Supported</label>
                        <LanguageSelector
                          selectedLanguages={editData.languages || []}
                          onLanguageChange={(languages) => handleInputChange('languages', languages)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Company Logo</label>
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
                                onClick={() => handleInputChange('logo', '')}
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
                              onChange={handleLogoUpload}
                              className="w-full border rounded px-3 py-2"
                              disabled={saving}
                            />
                            <small className="text-gray-500 text-xs mt-1 block">
                              Supported formats: JPG, PNG, GIF. Max size: 5MB. Logo will be cropped to 3:2 ratio (300×200px)
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Company Brief Description</label>
                      <textarea
                        value={editData.shortDescription || ''}
                        onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                        rows={3}
                        className="w-full border rounded px-3 py-2"
                        placeholder="A brief summary of your company..."
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">About Our Company</label>
                      <textarea
                        value={editData.fullDescription || ''}
                        onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                        rows={20}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Provide a detailed description of your company, including history, mission, values, and what makes you unique..."
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <button className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded" onClick={() => startEdit('info')}>
              Edit Company Profile
            </button>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Company Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Industry:</label>
                        <div className="text-base">{company.industry || 'N/A'}</div>
            </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Website:</label>
                        <div className="text-base">{company.website ? (
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {company.website}
                          </a>
                        ) : 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email:</label>
                        <div className="text-base">{company.email || company.verifiedEmail || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Phone:</label>
                        <div className="text-base">{company.phone || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Languages Supported:</label>
                        <div className="text-base">
                          {(company as any).languages && (company as any).languages.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {(company as any).languages.map((langCode: string, index: number) => {
                                const lang = languageOptions.find(l => l.value === langCode);
                                return (
                                  <span 
                                    key={index}
                                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                  >
                                    {lang ? lang.label : langCode}
                                  </span>
                                );
                              })}
                            </div>
                          ) : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Company Logo:</label>
                        <div className="text-base">
                          {company.logo ? (
                            <div className="w-40 h-28 bg-white shadow-sm rounded flex items-center justify-center overflow-hidden">
                              <img 
                                src={company.logo} 
                                alt="Company Logo" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : 'No logo uploaded'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Company Brief Description:</label>
                      <div className="text-base">{company.shortDescription || 'N/A'}</div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-600 mb-1">About Our Company:</label>
                      <div className="text-base whitespace-pre-wrap">{company.fullDescription || 'N/A'}</div>
                    </div>
                  </>
                )}
          </div>

          {/* Office Locations 卡片 */}
          <div className="bg-white rounded shadow p-6 relative">
                {editMode === 'offices' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Edit Office Locations</h2>
                      <div className="flex gap-2">
                        <button 
                          onClick={saveOffices}
                          disabled={saving}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    {/* Existing Offices */}
                    {editData.offices && editData.offices.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">Current Offices</h3>
                        {editData.offices.map((office: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <input
                                  type="text"
                                  value={office.address || ''}
                                  onChange={(e) => updateItem('office', index, 'address', e.target.value)}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">City</label>
                                <input
                                  type="text"
                                  value={office.city || ''}
                                  onChange={(e) => updateItem('office', index, 'city', e.target.value)}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">State</label>
                                <input
                                  type="text"
                                  value={office.state || ''}
                                  onChange={(e) => updateItem('office', index, 'state', e.target.value)}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Postal Code</label>
                                <input
                                  type="text"
                                  value={office.postalCode || ''}
                                  onChange={(e) => updateItem('office', index, 'postalCode', e.target.value)}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                  type="tel"
                                  value={office.phone || ''}
                                  onChange={(e) => updateItem('office', index, 'phone', e.target.value)}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                  type="email"
                                  value={office.email || ''}
                                  onChange={(e) => updateItem('office', index, 'email', e.target.value)}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Contact Person</label>
                                <input
                                  type="text"
                                  value={office.contactPerson || ''}
                                  onChange={(e) => updateItem('office', index, 'contactPerson', e.target.value)}
                                  className="w-full border rounded px-3 py-2"
                                />
                              </div>
                              <div className="flex items-center">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={office.isHeadquarter || false}
                                    onChange={(e) => updateItem('office', index, 'isHeadquarter', e.target.checked)}
                                    className="mr-2"
                                  />
                                  Is Headquarters
                                </label>
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem('office', index)}
                              className="mt-3 text-red-600 hover:text-red-800"
                            >
                              Remove Office
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Office */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-4">Add New Office</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Address</label>
                          <input
                            type="text"
                            value={editData.newOffice?.address || ''}
                            onChange={(e) => updateNewItem('office', 'address', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">City</label>
                          <input
                            type="text"
                            value={editData.newOffice?.city || ''}
                            onChange={(e) => updateNewItem('office', 'city', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">State</label>
                          <input
                            type="text"
                            value={editData.newOffice?.state || ''}
                            onChange={(e) => updateNewItem('office', 'state', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Postal Code</label>
                          <input
                            type="text"
                            value={editData.newOffice?.postalCode || ''}
                            onChange={(e) => updateNewItem('office', 'postalCode', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Phone</label>
                          <input
                            type="tel"
                            value={editData.newOffice?.phone || ''}
                            onChange={(e) => updateNewItem('office', 'phone', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            value={editData.newOffice?.email || ''}
                            onChange={(e) => updateNewItem('office', 'email', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Contact Person</label>
                          <input
                            type="text"
                            value={editData.newOffice?.contactPerson || ''}
                            onChange={(e) => updateNewItem('office', 'contactPerson', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editData.newOffice?.isHeadquarter || false}
                              onChange={(e) => updateNewItem('office', 'isHeadquarter', e.target.checked)}
                              className="mr-2"
                            />
                            Is Headquarters
                          </label>
                        </div>
                      </div>
                      <button
                        onClick={() => addNewItem('office')}
                        disabled={!editData.newOffice?.address || !editData.newOffice?.city}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Office
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded" onClick={() => startEdit('offices')}>
              Edit Offices
            </button>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Office Locations</h2>
            </div>
                    {(company as any).offices && (company as any).offices.length > 0 ? (
              <ul>
                        {(company as any).offices.map((office: any, idx: number) => (
                  <li key={idx} className="border-b py-2 flex justify-between items-center">
                    <div>
                              <b>{office.isHeadquarter ? 'Headquarter' : 'Office'}:</b> {office.address}
                              {office.city && <>, {office.city}</>}
                              {office.state && <>, {office.state}</>}
                      {office.contactPerson && <> | <b>Contact:</b> {office.contactPerson}</>}
                      {office.phone && <> | <b>Phone:</b> {office.phone}</>}
                      {office.email && <> | <b>Email:</b> {office.email}</>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No office locations added yet.</div>
                    )}
                  </>
            )}
          </div>

          {/* Services 卡片 */}
          <div className="bg-white rounded shadow p-6 relative">
                {editMode === 'services' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Edit Services</h2>
                      <div className="flex gap-2">
                        <button 
                          onClick={saveServices}
                          disabled={saving}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    {/* Existing Services */}
                    {editData.services && editData.services.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">Current Services</h3>
                        {editData.services.map((service: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Service Title</label>
                                <input
                                  type="text"
                                  value={service.title || ''}
                                  onChange={(e) => updateItem('service', index, 'title', e.target.value)}
                                  className="w-full border rounded px-3 py-2"
                                  placeholder="e.g., Web Development, Consulting"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                  value={service.description || ''}
                                  onChange={(e) => updateItem('service', index, 'description', e.target.value)}
                                  rows={3}
                                  className="w-full border rounded px-3 py-2"
                                  placeholder="Describe what this service includes..."
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem('service', index)}
                              className="mt-3 text-red-600 hover:text-red-800"
                            >
                              Remove Service
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Service */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-4">Add New Service</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Service Title</label>
                          <input
                            type="text"
                            value={editData.newService?.title || ''}
                            onChange={(e) => updateNewItem('service', 'title', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g., Web Development, Consulting"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={editData.newService?.description || ''}
                            onChange={(e) => updateNewItem('service', 'description', e.target.value)}
                            rows={3}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Describe what this service includes..."
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => addNewItem('service')}
                        disabled={!editData.newService?.title || !editData.newService?.description}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Service
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded" onClick={() => startEdit('services')}>
              Edit Services
            </button>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Services</h2>
            </div>
                    {(company as any).services && (company as any).services.length > 0 ? (
              <ul>
                        {(company as any).services.map((service: any, idx: number) => (
                  <li key={idx} className="border-b py-2 flex justify-between items-center">
                    <div>
                              <b>{service.title || service.name}</b>: {service.description}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No services added yet.</div>
                    )}
                  </>
            )}
          </div>

          {/* Company History 卡片 */}
          <div className="bg-white rounded shadow p-6 relative">
                {editMode === 'history' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Edit Company History</h2>
                      <div className="flex gap-2">
                        <button 
                          onClick={saveHistory}
                          disabled={saving}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    {/* Existing History */}
                    {editData.history && editData.history.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">Current History</h3>
                        {editData.history.map((historyItem: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Year</label>
                                <input
                                  type="number"
                                  value={historyItem.year || ''}
                                  onChange={(e) => updateItem('history', index, 'year', e.target.value)}
                                  className="w-full border rounded px-3 py-2"
                                  placeholder="2024"
                                  min="1900"
                                  max="2030"
                                />
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-sm font-medium mb-1">Event</label>
                                <input
                                  type="text"
                                  value={historyItem.event || ''}
                                  onChange={(e) => updateItem('history', index, 'event', e.target.value)}
                                  className="w-full border rounded px-3 py-2"
                                  placeholder="e.g., Company founded, Product launched, etc."
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem('history', index)}
                              className="mt-3 text-red-600 hover:text-red-800"
                            >
                              Remove Event
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New History */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-4">Add New History Event</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Year</label>
                          <input
                            type="number"
                            value={editData.newHistory?.year || ''}
                            onChange={(e) => updateNewItem('history', 'year', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="2024"
                            min="1900"
                            max="2030"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-sm font-medium mb-1">Event</label>
                          <input
                            type="text"
                            value={editData.newHistory?.event || ''}
                            onChange={(e) => updateNewItem('history', 'event', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="e.g., Company founded, Product launched, etc."
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => addNewItem('history')}
                        disabled={!editData.newHistory?.year || !editData.newHistory?.event}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Event
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded" onClick={() => startEdit('history')}>
              Edit History
            </button>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Company History</h2>
            </div>
                    {(company as any).history && (company as any).history.length > 0 ? (
                      <ul>
                        {(company as any).history.map((historyItem: any, idx: number) => (
                          <li key={idx} className="border-b py-2 flex justify-between items-center">
                            <div>
                              <b>{historyItem.year}:</b> {historyItem.event}
                            </div>
                  </li>
                ))}
              </ul>
            ) : (
                      <div className="text-gray-400">No history added yet.</div>
                    )}
                  </>
            )}
              </div>


          </div>
        </div>
      </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className={`
            max-w-md w-full mx-4 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out pointer-events-auto
            ${toast.type === 'success' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
            }
          `}>
            <div className="flex items-center">
              {toast.type === 'success' ? (
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* 确认对话框 */}
      {confirmDialog.show && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeConfirmDialog();
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all duration-300 animate-scale-in">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    confirmDialog.type === 'delete' ? 'bg-red-100' : 
                    confirmDialog.type === 'discard' ? 'bg-yellow-100' : 
                    'bg-blue-100'
                  }`}>
                    {confirmDialog.type === 'delete' ? (
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    ) : confirmDialog.type === 'discard' ? (
                      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {confirmDialog.title}
                  </h3>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={confirmDialog.onCancel}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 font-medium ${
                    confirmDialog.type === 'delete' ? 'bg-red-600 text-white hover:bg-red-700' :
                    confirmDialog.type === 'discard' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                    'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {confirmDialog.type === 'delete' ? 'Delete' : 
                   confirmDialog.type === 'discard' ? 'Discard' : 
                   'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Logo裁剪界面 */}
      {showCropper && (
        <LogoCropper
          src={cropperImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
} 