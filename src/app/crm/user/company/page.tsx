"use client";

import React, { useState, useCallback, useEffect } from 'react';
import {
  MapPin,
  Briefcase,
  Globe,
  Languages,
  Users,
  Calendar,
  Phone,
  Mail,
  Plus,
  Search,
  CheckCircle,
  ExternalLink,
  Check,
  Clock,
  Trash2,
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Sidebar from "@/components/crm/shared/layout/Sidebar";
import Select from 'react-select';

// Placeholder data - replace with actual data fetching and state management
const initialCompanyData = {
  logo: '/placeholder-logo.png',
  name: 'Incrementors Web Solutions',
  verified: true,
  abn: '51 824 753 556',
  city: 'Delhi',
  state: 'India',
  industry: 'Digital Marketing',
  description: 'Incrementors Web Solutions is a digital marketing agency that focuses on providing innovative solutions and creative strategies for helping businesses upgrade their customer base and foster growth.',
  tags: [
    'Search Engine Optimization (SEO)',
    'Pay Per Click (PPC)',
    'Social Media Marketing',
    'Content Marketing',
    'Web Design',
    'Web Development',
  ],
  languages: 'English, Hindi, Punjabi',
  teamSize: '50-100',
  founded: 2012,
  about: 'Our focus on quality and innovation helps our clients stay ahead in the ever-evolving digital landscape. We provide end-to-end solutions for all your online marketing needs while ensuring complete transparency and effective communication throughout the project. Our team of experienced professionals specializes in SEO, PPC, content marketing, social media marketing, web design, and development. We work closely with our clients to understand their business goals and create customized strategies that deliver measurable results.',
  offices: [
    { id: '1', name: 'Delhi Office', address: '123 Main St, Delhi, India' },
  ],
  contact: {
    website: 'www.incrementors.com',
    email: 'info@incrementors.com',
    phone: '+91 9876543210',
  },
  initialServices: [
    {
      id: '1',
      title: 'Search Engine Optimization (SEO)',
      description: 'Data-driven SEO strategies to improve your website\'s visibility in search engines, drive organic traffic, and increase conversions.'
    },
    {
      id: '2',
      title: 'Pay Per Click (PPC)',
      description: 'Targeted PPC campaign management to maximize your advertising ROI across Google, Bing, and social media platforms.'
    },
    {
      id: '3',
      title: 'Social Media Marketing',
      description: 'Strategic social media marketing to build your brand presence, engage with customers, and drive traffic and sales.'
    },
    {
      id: '4',
      title: 'Content Marketing',
      description: 'High-quality content creation and strategic distribution to attract, engage, and convert your target audience.'
    }
  ]
};

interface Service {
  id: string;
  title: string;
  description: string;
}

interface HistoryEvent {
  year: string;
  event: string;
}

interface Office {
  id: string;
  name: string;
  address: string;
}

interface CompanyData {
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

// 添加行业选项
const industryOptions = [
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Software Development', label: 'Software Development' },
  { value: 'IT Services', label: 'IT Services' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'Web Design', label: 'Web Design' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Mobile Development', label: 'Mobile Development' },
  { value: 'Cloud Services', label: 'Cloud Services' },
];

const SortableOfficeItem = ({ office, onDelete }: { office: Office; onDelete: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: office.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(office.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${
        isDragging ? 'shadow-lg ring-2 ring-[#E4BF2D]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div 
          className="flex items-start gap-3 flex-1 cursor-grab"
          {...listeners}
        >
          <MapPin className="w-5 h-5 text-[#E4BF2D] mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{office.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{office.address}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          type="button"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const OfficeList = React.memo(({ offices, onDelete }: { offices: Office[]; onDelete: (id: string) => void }) => {
  return (
    <div className="space-y-4 mb-6">
      {offices.map((office) => (
        <SortableOfficeItem key={office.id} office={office} onDelete={onDelete} />
      ))}
    </div>
  );
});

// 将添加办公室表单提取为独立组件
const AddOfficeForm = React.memo(({ onAdd }: { onAdd: (name: string, address: string) => void }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !address.trim()) return;
    onAdd(name.trim(), address.trim());
    setName('');
    setAddress('');
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Office</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="officeName" className="block text-sm font-medium text-gray-700 mb-1">
            Office Name
          </label>
          <input
            type="text"
            id="officeName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Headquarters, Regional Office"
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#E4BF2D] focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="officeAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Office Address
          </label>
          <input
            type="text"
            id="officeAddress"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter complete office address"
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#E4BF2D] focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-[#E4BF2D] text-white rounded-md text-sm font-medium hover:bg-[#c7a625] transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Office
        </button>
      </div>
    </div>
  );
});

// 添加选项数据
const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Punjabi', label: 'Punjabi' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
];

const teamSizeOptions = [
  { value: '0-10', label: '0-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-100', label: '51-100' },
  { value: '101-200', label: '101-200' },
  { value: '200+', label: '200+' },
];

const currentYear = new Date().getFullYear();
const foundedYearOptions = Array.from({ length: currentYear - 1990 + 1 }, (_, index) => {
  const year = currentYear - index;
  return { value: year.toString(), label: year.toString() };
});

export default function CompanyManagementPage() {
  const [companyData, setCompanyData] = useState<CompanyData>(initialCompanyData);
  const [services, setServices] = useState<Service[]>(initialCompanyData.initialServices);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([
    { year: '2020', event: 'Launched remote marketing services during pandemic, helping clients adapt to the new normal' },
    { year: '2018', event: 'Received Best Digital Marketing Agency Award' },
    { year: '2015', event: 'Expanded business to Asian market, team grew to 25 employees' },
    { year: '2012', event: 'Company founded in Delhi, India' }
  ]);
  const [newEventYear, setNewEventYear] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [editingEvent, setEditingEvent] = useState<{index: number, field: 'year' | 'event'} | null>(null);
  const [editValue, setEditValue] = useState('');

  const [offices, setOffices] = useState<Office[]>(initialCompanyData.offices);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [selectedLanguages, setSelectedLanguages] = useState(() => {
    const initialLanguages = initialCompanyData.languages.split(', ').map(lang => ({
      value: lang,
      label: lang
    }));
    return initialLanguages;
  });

  const [selectedTeamSize, setSelectedTeamSize] = useState(() => ({
    value: initialCompanyData.teamSize,
    label: initialCompanyData.teamSize
  }));

  const [selectedFoundedYear, setSelectedFoundedYear] = useState(() => ({
    value: initialCompanyData.founded.toString(),
    label: initialCompanyData.founded.toString()
  }));

  const [selectedIndustry, setSelectedIndustry] = useState(() => ({
    value: initialCompanyData.industry,
    label: initialCompanyData.industry
  }));

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyData(prev => ({
          ...prev,
          logo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 自定义 Select 样式以匹配现有样式
  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      border: 'none',
      boxShadow: 'none',
      background: 'transparent',
      minHeight: 'unset',
      '&:hover': {
        border: 'none'
      }
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '0',
    }),
    input: (base: any) => ({
      ...base,
      margin: '0',
      padding: '0',
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      height: '20px',
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: '0 4px',
    }),
    menu: (base: any) => ({
      ...base,
      width: 'max-content',
      minWidth: '100%',
    })
  };

  // 同步 services 到 tags
  const syncServicesToTags = (updatedServices: Service[]) => {
    setCompanyData(prev => ({
      ...prev,
      tags: updatedServices.map(service => service.title)
    }));
  };

  const handleAddService = () => {
    if (!newServiceTitle.trim() || !newServiceDesc.trim()) return;

    const newService = {
      id: Date.now().toString(),
      title: newServiceTitle.trim(),
      description: newServiceDesc.trim()
    };

    const updatedServices = [...services, newService];
    setServices(updatedServices);
    // 同步到 tags
    syncServicesToTags(updatedServices);
    
    setNewServiceTitle('');
    setNewServiceDesc('');
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = services.filter(service => service.id !== serviceId);
    setServices(updatedServices);
    // 同步到 tags
    syncServicesToTags(updatedServices);
  };

  // 初始化时同步一次
  useEffect(() => {
    syncServicesToTags(services);
  }, []);

  const handleAddEvent = () => {
    if (!newEventYear.trim() || !newEventDesc.trim()) return;

    const newEvent: HistoryEvent = {
      year: newEventYear.trim(),
      event: newEventDesc.trim()
    };

    const updatedEvents = [...historyEvents, newEvent].sort((a, b) => parseInt(b.year) - parseInt(a.year));
    
    setHistoryEvents(updatedEvents);
    setNewEventYear('');
    setNewEventDesc('');
  };

  const handleDeleteEvent = (index: number) => {
    const updatedEvents = [...historyEvents];
    updatedEvents.splice(index, 1);
    setHistoryEvents(updatedEvents);
  };

  const handleAddOffice = useCallback((name: string, address: string) => {
    const newOffice: Office = {
      id: `office-${Date.now()}`,
      name,
      address
    };
    setOffices(prev => [...prev, newOffice]);
  }, []);

  const handleDeleteOffice = useCallback((id: string) => {
    setOffices(prev => prev.filter(office => office.id !== id));
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setOffices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleEditStart = (index: number, field: 'year' | 'event', value: string) => {
    setEditingEvent({ index, field });
    setEditValue(value);
  };

  const handleEditSave = () => {
    if (editingEvent) {
      const newEvents = [...historyEvents];
      newEvents[editingEvent.index] = {
        ...newEvents[editingEvent.index],
        [editingEvent.field]: editValue
      };
      
      // Sort events by year in descending order
      newEvents.sort((a, b) => parseInt(b.year) - parseInt(a.year));
      
      setHistoryEvents(newEvents);
      setEditingEvent(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    }
  };

  const ServicesContent = () => (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Services Offered</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex gap-4 items-start">
              <div className="w-10 h-10 bg-yellow-50 rounded flex-shrink-0 flex items-center justify-center mt-1">
                <Check className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{service.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Service</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="serviceTitle" className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
              <input
                type="text"
                id="serviceTitle"
                value={newServiceTitle}
                onChange={(e) => setNewServiceTitle(e.target.value)}
                placeholder="e.g., Web Development"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#E4BF2D] focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="serviceDesc" className="block text-sm font-medium text-gray-700 mb-1">Service Description</label>
              <textarea
                id="serviceDesc"
                value={newServiceDesc}
                onChange={(e) => setNewServiceDesc(e.target.value)}
                rows={3}
                placeholder="Describe the service briefly..."
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#E4BF2D] focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAddService}
              className="flex items-center gap-2 px-4 py-2 bg-[#E4BF2D] text-white rounded-md text-sm font-medium hover:bg-[#c7a625] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  const CompanyDetailsContent = () => (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">About Company</h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#E4BF2D] focus:border-transparent min-h-[150px]"
          value={companyData.about}
          onChange={(e) => setCompanyData(prev => ({...prev, about: e.target.value}))}
          placeholder="Enter company description"
        />
      </section>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Offices</h2>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={offices.map(office => office.id)}
            strategy={verticalListSortingStrategy}
          >
            <OfficeList offices={offices} onDelete={handleDeleteOffice} />
          </SortableContext>
        </DndContext>

        <AddOfficeForm onAdd={handleAddOffice} />
      </section>
    </div>
  );

  const CompanyHistoryContent = () => (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Company History</h2>
        
        <div className="mb-8">
          {historyEvents.length > 0 ? (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="space-y-8">
                {historyEvents.map((event, index) => (
                  <div key={index} className="relative pl-8 pb-6">
                    <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-[#E4BF2D] border-2 border-[#E4BF2D]"></div>
                    <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-[#E4BF2D]"></div>
                    <div className="bg-white rounded-lg shadow-sm p-4">
                      {editingEvent?.index === index && editingEvent.field === 'year' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleEditSave}
                          onKeyDown={handleKeyDown}
                          className="text-sm font-medium text-[#E4BF2D] bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="text-sm font-medium text-[#E4BF2D]"
                          onDoubleClick={() => handleEditStart(index, 'year', event.year)}
                        >
                          {event.year}
                        </div>
                      )}
                      {editingEvent?.index === index && editingEvent.field === 'event' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleEditSave}
                          onKeyDown={handleKeyDown}
                          className="text-gray-600 mt-1 bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="text-gray-600 mt-1"
                          onDoubleClick={() => handleEditStart(index, 'event', event.event)}
                        >
                          {event.event}
                      </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No company history events added yet</p>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Historical Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label htmlFor="eventYear" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="text"
                id="eventYear"
                value={newEventYear}
                onChange={(e) => setNewEventYear(e.target.value)}
                placeholder="e.g., 2022"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#E4BF2D] focus:border-transparent"
              />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="eventDesc" className="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
              <input
                type="text"
                id="eventDesc"
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                placeholder="Describe the milestone or significant event..."
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#E4BF2D] focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={handleAddEvent}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#E4BF2D] text-white rounded-md text-sm font-medium hover:bg-[#c7a625] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Historical Event
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64">
        <div className="bg-white shadow-sm mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative overflow-hidden"
                  onClick={handleLogoClick}
                >
                  {companyData.logo === '/placeholder-logo.png' ? (
                    <span className="text-gray-400 text-sm">Click to Upload Logo</span>
                  ) : (
                    <img 
                      src={companyData.logo} 
                      alt="Company Logo" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{companyData.name}</h1>
                  {companyData.verified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <CheckCircle className="w-3 h-3 mr-1" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center text-gray-500 text-sm gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">ABN</span>
                      <input
                        type="text"
                        value={companyData.abn}
                        onChange={(e) => setCompanyData(prev => ({...prev, abn: e.target.value}))}
                        placeholder="Enter ABN"
                        className="text-sm border-b border-transparent hover:border-gray-300 focus:border-gray-300 focus:outline-none bg-transparent w-32"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <input
                        type="text"
                        value={companyData.city}
                        onChange={(e) => setCompanyData(prev => ({...prev, city: e.target.value}))}
                        placeholder="City"
                        className="text-sm border-b border-transparent hover:border-gray-300 focus:border-gray-300 focus:outline-none bg-transparent w-24"
                      />
                      <input
                        type="text"
                        value={companyData.state}
                        onChange={(e) => setCompanyData(prev => ({...prev, state: e.target.value}))}
                        placeholder="State"
                        className="text-sm border-b border-transparent hover:border-gray-300 focus:border-gray-300 focus:outline-none bg-transparent w-24"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <Select
                      value={selectedIndustry}
                      onChange={(newValue: any) => {
                        setSelectedIndustry(newValue);
                        setCompanyData(prev => ({...prev, industry: newValue.value}));
                      }}
                      options={industryOptions}
                      styles={customSelectStyles}
                      className="text-sm min-w-[150px]"
                    />
                  </div>
                </div>
                <textarea
                  value={companyData.description}
                  onChange={(e) => setCompanyData(prev => ({...prev, description: e.target.value}))}
                  placeholder="Enter company brief description"
                  className="text-gray-600 text-sm mb-4 max-w-3xl w-full mt-2 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-300 focus:outline-none resize-none"
                  rows={3}
                />
                <div className="flex flex-wrap gap-2">
                  {companyData.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    +2 more
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-200 flex flex-wrap gap-x-8 gap-y-4 justify-start">
            <div className="flex items-center gap-2 text-sm">
              <Languages className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Languages</div>
                <Select
                  isMulti
                  value={selectedLanguages}
                  onChange={(newValue: any) => setSelectedLanguages(newValue)}
                  options={languageOptions}
                  styles={customSelectStyles}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Team Size</div>
                <Select
                  value={selectedTeamSize}
                  onChange={(newValue: any) => setSelectedTeamSize(newValue)}
                  options={teamSizeOptions}
                  styles={customSelectStyles}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Founded</div>
                <Select
                  value={selectedFoundedYear}
                  onChange={(newValue: any) => setSelectedFoundedYear(newValue)}
                  options={foundedYearOptions}
                  styles={customSelectStyles}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('details'); }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-[#E4BF2D] text-[#E4BF2D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Company Details
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('services'); }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-[#E4BF2D] text-[#E4BF2D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Services
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('history'); }}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-[#E4BF2D] text-[#E4BF2D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Company History
              </a>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'details' && <CompanyDetailsContent />}
              {activeTab === 'services' && <ServicesContent />}
              {activeTab === 'history' && <CompanyHistoryContent />}
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Website</label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="url"
                      className="w-full text-sm border-b border-transparent focus:border-gray-300 focus:outline-none"
                      value={companyData.contact.website}
                      onChange={(e) => setCompanyData({
                        ...companyData,
                        contact: {...companyData.contact, website: e.target.value}
                      })}
                      placeholder="www.example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="email"
                      className="w-full text-sm border-b border-transparent focus:border-gray-300 focus:outline-none"
                      value={companyData.contact.email}
                      onChange={(e) => setCompanyData({
                        ...companyData,
                        contact: {...companyData.contact, email: e.target.value}
                      })}
                      placeholder="info@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="tel"
                      className="w-full text-sm border-b border-transparent focus:border-gray-300 focus:outline-none"
                      value={companyData.contact.phone}
                      onChange={(e) => setCompanyData({
                        ...companyData,
                        contact: {...companyData.contact, phone: e.target.value}
                      })}
                      placeholder="+1 123-456-7890"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full px-6 py-3 bg-[#E4BF2D] text-white rounded-md hover:bg-[#c7a625] transition-colors font-semibold">
                  Save Company Information
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
} 