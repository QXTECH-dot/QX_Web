"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
  ShieldCheck,
  Building2,
  Star,
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Sidebar from "@/components/crm/shared/layout/Sidebar";
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import ISO6391 from 'iso-639-1';

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

// 澳大利亚官方行业分类（A-Z排序）
const industryOptions = [
  'Accommodation and Food Services',
  'Administrative and Support Services',
  'Agriculture, Forestry and Fishing',
  'Arts and Recreation Services',
  'Construction',
  'Education and Training',
  'Electricity, Gas, Water and Waste Services',
  'Financial and Insurance Services',
  'Health Care and Social Assistance',
  'Information Media and Telecommunications',
  'Manufacturing',
  'Mining',
  'Other Services',
  'Professional, Scientific and Technical Services',
  'Public Administration and Safety',
  'Rental, Hiring and Real Estate Services',
  'Retail Trade',
  'Transport, Postal and Warehousing',
  'Wholesale Trade'
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
const languageOptions = ISO6391.getAllCodes().map(code => ({
  value: code,
  label: ISO6391.getName(code)
}));

const teamSizeOptions = [
  { value: '1-10', label: '1-10' },
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

const steps = [
  'About Company',
  'Office Locations',
  'Services',
  'Company History'
];

function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full flex items-center mb-8">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className={`flex-1 flex flex-col items-center ${idx <= currentStep ? 'text-primary' : 'text-gray-300'}`}> 
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${idx <= currentStep ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white'}`}>{idx + 1}</div>
            <span className="text-xs mt-2 text-center whitespace-nowrap">{step}</span>
          </div>
          {idx < steps.length - 1 && <div className={`flex-1 h-1 ${idx < currentStep ? 'bg-primary' : 'bg-gray-200'}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

function TabWizardNav({ currentStep, completedSteps, onTabClick }: { currentStep: number, completedSteps: boolean[], onTabClick: (idx: number) => void }) {
  return (
    <div className="flex gap-2 mb-8 border-b border-gray-200">
      {steps.map((step, idx) => (
        <button
          key={step}
          className={`flex items-center gap-1 px-4 py-2 -mb-px border-b-2 transition font-medium text-sm
            ${currentStep === idx ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-gray-500 hover:text-primary hover:bg-primary/10'}
            ${completedSteps[idx] ? 'font-bold' : ''}
          `}
          onClick={() => onTabClick(idx)}
          type="button"
        >
          {completedSteps[idx] && <Check className="w-4 h-4 text-green-500" />}
          <span>{step}</span>
        </button>
      ))}
    </div>
  );
}

function StepAboutCompany({ data, onChange, onValidate }: any) {
  const [touched, setTouched] = useState(false);
  const [logoPreview, setLogoPreview] = useState(data.logo || '');
  const [loadingShort, setLoadingShort] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === 'logo' && e.target instanceof HTMLInputElement && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        onChange({ ...data, logo: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      onChange({ ...data, [e.target.name]: e.target.value });
    }
    setTouched(true);
  };

  // mock AI摘要
  const handleAutoGenerateShort = () => {
    setLoadingShort(true);
    setTimeout(() => {
      const desc = data.fullDescription || '';
      const summary = desc.length > 80 ? desc.slice(0, 80) + '...' : desc;
      onChange({ ...data, shortDescription: summary });
      setLoadingShort(false);
    }, 800);
  };

  const isValid = data.fullDescription && data.industry && Array.isArray(data.languages) && data.languages.length > 0 && data.logo && data.shortDescription && data.teamSize && data.website;
  React.useEffect(() => { onValidate(isValid); }, [isValid, onValidate]);
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <label className="block font-medium mb-1">Company Description <span className="text-red-500">*</span></label>
        <textarea name="fullDescription" value={data.fullDescription || ''} onChange={handleInput} className="w-full border rounded px-3 py-2 min-h-[80px]" required />
              </div>
              <div>
        <label className="block font-medium mb-1 flex items-center">Short Description <span className="text-red-500 ml-1">*</span>
          <button type="button" onClick={handleAutoGenerateShort} className="ml-3 px-2 py-1 text-xs bg-primary text-white rounded" disabled={loadingShort}>
            {loadingShort ? 'Generating...' : 'Auto-generate'}
          </button>
        </label>
        <input name="shortDescription" value={data.shortDescription || ''} onChange={handleInput} className="w-full border rounded px-3 py-2" required />
              </div>
      <div>
        <label className="block font-medium mb-1">Industry <span className="text-red-500">*</span></label>
        <select name="industry" value={data.industry || ''} onChange={handleInput} className="w-full border rounded px-3 py-2 bg-white" required>
          <option value="" disabled>Select industry</option>
          {industryOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        </div>
            <div>
        <label className="block font-medium mb-1">Languages Supported <span className="text-red-500">*</span></label>
        <Select
          isMulti
          name="languages"
          options={languageOptions}
          value={languageOptions.filter(opt => (data.languages || []).includes(opt.value))}
          onChange={selected => onChange({ ...data, languages: selected.map((opt: any) => opt.value) })}
          className="w-full"
          placeholder="Select supported languages..."
              />
            </div>
            <div>
        <label className="block font-medium mb-1">Logo <span className="text-red-500">*</span></label>
        <input name="logo" type="file" accept="image/*" onChange={handleInput} className="w-full border rounded px-3 py-2 bg-white" required={true} />
        {logoPreview && (
          <div className="mt-2 flex items-center gap-4">
            <img src={logoPreview} alt="Logo Preview" className="h-16 w-16 object-contain border rounded bg-white" />
            <span className="text-xs text-gray-500">Preview</span>
          </div>
        )}
      </div>
      <div>
        <label className="block font-medium mb-1">Team Size <span className="text-red-500">*</span></label>
        <select name="teamSize" value={data.teamSize || ''} onChange={handleInput} className="w-full border rounded px-3 py-2 bg-white" required>
          <option value="" disabled>Select team size</option>
          {teamSizeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        </div>
      <div>
        <label className="block font-medium mb-1">Website <span className="text-red-500">*</span></label>
        <input name="website" value={data.website || ''} onChange={handleInput} className="w-full border rounded px-3 py-2" required />
    </div>
    </div>
  );
}

const serviceTitleOptions = [
  'Web Development', 'Consulting', 'Digital Marketing', 'Accounting', 'Legal Services',
  'IT Support', 'Design', 'Training', 'Logistics', 'HR Services', 'Cloud Solutions',
  'E-commerce', 'App Development', 'SEO', 'Content Writing', 'Cybersecurity',
  'Business Analysis', 'Project Management', 'Branding', 'Data Analytics', 'Customer Support'
];
const historyEventOptions = [
  'Founded', 'Expanded to new market', 'Launched new product', 'Reached 100 employees',
  'Received award', 'Merged with another company', 'Opened new office', 'IPO',
  'Rebranded', 'Acquired by another company', 'Launched website', 'Secured funding',
  'International expansion', 'Leadership change', 'Strategic partnership'
];
const yearOptions = Array.from({length: 60}, (_, i) => (currentYear - i).toString());

function StepServices({ data, onChange, onValidate }: any) {
  const [services, setServices] = useState(data.services || []);
  const [newService, setNewService] = useState({ title: '', description: '' });
  const [showModal, setShowModal] = useState(false);
  const [loadingDesc, setLoadingDesc] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    onChange({ ...data, services });
    onValidate(services.length > 0);
  }, [services]);

  const handleAddService = () => {
    if (!newService.title.trim() || !newService.description.trim()) {
      setError('Service title and description are required.');
      return;
    }
    setServices(prev => [...prev, { ...newService, id: generateId() }]);
    setShowModal(false);
    setNewService({ title: '', description: '' });
    setError('');
  };
  const handleDelete = (id: string) => setServices(prev => prev.filter(s => s.id !== id));
  const handleAutoDesc = () => {
    setLoadingDesc(true);
    setTimeout(() => {
      setNewService(s => ({ ...s, description: `Professional ${s.title} services for businesses of all sizes.` }));
      setLoadingDesc(false);
    }, 700);
  };
  // 自动补全下拉
  const filteredTitles = useMemo(() =>
    newService.title
      ? serviceTitleOptions.filter(opt => opt.toLowerCase().includes(newService.title.toLowerCase()))
      : serviceTitleOptions,
    [newService.title]
  );
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Services</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded shadow hover:bg-yellow-500 transition">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>
      <div className="space-y-4">
        {services.length === 0 && <div className="text-gray-400 text-center py-8">No services added yet.</div>}
        {services.map(service => (
          <div key={service.id} className="flex items-start gap-4 p-4 rounded-lg border bg-white border-gray-200">
            <div className="flex-1">
              <div className="font-bold text-lg">{service.title}</div>
              <div className="text-gray-700 text-sm mt-1">{service.description}</div>
            </div>
            <button onClick={() => handleDelete(service.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete" type="button">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      {/* Add Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h3 className="text-lg font-bold mb-4">Add Service</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Service Title <span className="text-red-500">*</span></label>
                <input
                  name="title"
                  value={newService.title}
                  onChange={e => setNewService(s => ({ ...s, title: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  list="service-title-list"
                  required
                />
                <datalist id="service-title-list">
                  {filteredTitles.map(opt => <option key={opt} value={opt} />)}
                </datalist>
              </div>
              <div>
                <label className="block font-medium mb-1 flex items-center">Service Description <span className="text-red-500 ml-1">*</span>
                  <button type="button" onClick={handleAutoDesc} className="ml-3 px-2 py-1 text-xs bg-primary text-white rounded" disabled={loadingDesc}>
                    {loadingDesc ? 'Generating...' : 'Auto-generate'}
                  </button>
                </label>
                <input
                  name="description"
                  value={newService.description}
                  onChange={e => setNewService(s => ({ ...s, description: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <button type="button" onClick={handleAddService} className="w-full mt-2 px-4 py-2 bg-primary text-white rounded font-semibold shadow hover:bg-yellow-500 transition">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepCompanyHistory({ data, onChange, onValidate }: any) {
  const [history, setHistory] = useState(data.history || []);
  const [newEvent, setNewEvent] = useState({ year: '', event: '' });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    onChange({ ...data, history });
    onValidate(history.length > 0);
  }, [history]);

  const handleAddEvent = () => {
    if (!newEvent.year || !newEvent.event.trim()) {
      setError('Year and event are required.');
      return;
    }
    setHistory(prev => [...prev, { ...newEvent, id: generateId() }]);
    setShowModal(false);
    setNewEvent({ year: '', event: '' });
    setError('');
  };
  const handleDelete = (id: string) => setHistory(prev => prev.filter(h => h.id !== id));
  // 自动补全下拉
  const filteredEvents = useMemo(() =>
    newEvent.event
      ? historyEventOptions.filter(opt => opt.toLowerCase().includes(newEvent.event.toLowerCase()))
      : historyEventOptions,
    [newEvent.event]
  );
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Company History</h2>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded shadow hover:bg-yellow-500 transition">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>
      <div className="space-y-4">
        {history.length === 0 && <div className="text-gray-400 text-center py-8">No history events added yet.</div>}
        {history.map(item => (
          <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border bg-white border-gray-200">
            <div className="flex-1">
              <div className="font-bold text-lg">{item.year}</div>
              <div className="text-gray-700 text-sm mt-1">{item.event}</div>
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete" type="button">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h3 className="text-lg font-bold mb-4">Add History Event</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Year <span className="text-red-500">*</span></label>
                <select name="year" value={newEvent.year} onChange={e => setNewEvent(ev => ({ ...ev, year: e.target.value }))} className="w-full border rounded px-3 py-2 bg-white" required>
                  <option value="" disabled>Select year</option>
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Event <span className="text-red-500">*</span></label>
                <input
                  name="event"
                  value={newEvent.event}
                  onChange={e => setNewEvent(ev => ({ ...ev, event: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  list="history-event-list"
                  required
                />
                <datalist id="history-event-list">
                  {filteredEvents.map(opt => <option key={opt} value={opt} />)}
                </datalist>
              </div>
              {error && <div className="text-red-600 text-sm text-center">{error}</div>}
              <button type="button" onClick={handleAddEvent} className="w-full mt-2 px-4 py-2 bg-primary text-white rounded font-semibold shadow hover:bg-yellow-500 transition">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Company ABN Verification UI ---
function CompanyBindABN({ onBind }: { onBind: (company: any) => void }) {
  const [abn, setAbn] = useState("");
  const [status, setStatus] = useState<"idle"|"checking"|"found"|"notfound"|"error">("idle");
  const [company, setCompany] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCheckAbn = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("checking");
    setError("");
    setCompany(null);
    try {
      const res = await fetch(`/api/companies?abn=${abn}`);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const found = data.data[0];
        setCompany({
          name: found.name || found.name_en || found.EntityName,
          abn: found.abn,
          industry: found.industry || found.MainBusinessLocation || "",
        });
        setStatus("found");
      } else {
        setStatus("notfound");
      }
    } catch (err) {
      setStatus("error");
      setError("ABN lookup failed, please try again.");
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 p-0 md:p-8">
      <div className="flex flex-col items-center mb-8">
        <ShieldCheck className="w-16 h-16 text-primary mb-2" />
        <h1 className="text-3xl font-bold mb-2 text-center">Company Verification</h1>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">Step 1 of 2</span>
        </div>
        <p className="text-gray-600 text-center max-w-xl mb-2">ABN verification helps us ensure your company's authenticity and protect your account security. Please enter your company's Australian Business Number (ABN) to continue.</p>
        <p className="text-gray-400 text-xs text-center mb-2">ABN must be 11 digits. Example: <span className="font-mono">12345678901</span></p>
                        </div>
      <form onSubmit={handleCheckAbn} className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div>
          <label className="block font-medium mb-2 text-lg">ABN <span className="text-red-500">*</span></label>
          <div className="relative">
                        <input
                          type="text"
              value={abn}
              onChange={e => setAbn(e.target.value.replace(/\D/g, ""))}
              maxLength={11}
              className="w-full border-2 border-primary/40 focus:border-primary rounded-lg px-5 py-4 text-xl font-mono tracking-widest pr-14"
              placeholder="Enter 11-digit ABN"
              required
                          autoFocus
                        />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
              <Building2 className="w-7 h-7" />
            </span>
            </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-bold text-lg shadow-md hover:bg-yellow-500 transition disabled:opacity-50"
          disabled={status === "checking" || abn.length !== 11}
        >
          <Search className="w-5 h-5 mr-1" />
          {status === "checking" ? "Checking..." : "Verify ABN"}
        </button>
        {error && status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800 text-center">{error}</div>
        )}
      </form>
      <div className="w-full max-w-xl mt-8">
        {status === "found" && company && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-green-800 text-center shadow">
            <div className="flex flex-col items-center mb-2">
              <Building2 className="w-10 h-10 mb-2 text-green-600" />
              <div className="font-semibold text-lg mb-1">Company Found</div>
            </div>
            <div className="mb-1">Name: <span className="font-bold">{company.name}</span></div>
            <div className="mb-1">ABN: <span className="font-mono">{company.abn}</span></div>
            <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-yellow-500 transition" onClick={() => {
              onBind(company);
              router.push('/crm/user/company/email-verify');
            }}>
              This is my business
            </button>
          </div>
        )}
        {status === "notfound" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-yellow-800 text-center shadow">
            <div className="font-semibold text-lg mb-2">No company found for this ABN.</div>
            <button className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-yellow-500 transition" onClick={() => onBind({ abn })}>
              Create New Company Profile
          </button>
        </div>
        )}
      </div>
    </div>
  );
}

// 通用唯一ID生成函数，避免SSR/CSR不一致
const generateId = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
};

export default function CompanyManagementPage() {
  // TODO: Replace with real user/company binding check
  const [boundCompany, setBoundCompany] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [canNext, setCanNext] = useState(false);
  const [completed, setCompleted] = useState([false, false, false, false, false]);

  // 自动检测localStorage companyBound
  React.useEffect(() => {
    if (!boundCompany && typeof window !== 'undefined') {
      if (localStorage.getItem('companyBound') === '1') {
        setBoundCompany({});
      }
    }
  }, [boundCompany]);

  // If not bound, show ABN bind UI first
  if (!boundCompany) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
          <CompanyBindABN onBind={setBoundCompany} />
        </main>
      </div>
    );
  }

  // Tab切换时自动保存当前数据
  const handleTabClick = (idx: number) => {
    // 可在此处做自动保存逻辑
    setStep(idx);
  };

  // 保存并进入下一步
  const handleNext = () => {
    if (canNext) {
      const newCompleted = [...completed];
      newCompleted[step] = true;
      setCompleted(newCompleted);
      setStep(s => Math.min(s + 1, steps.length - 1));
    }
  };

  // 上一步
  const handlePrev = () => { setStep(s => Math.max(0, s - 1)); };
  const handleChange = (data: any) => setFormData(data);
  const handleValidate = (valid: boolean) => setCanNext(valid);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Step-by-Step Company Profile Wizard</h1>
          <StepProgress currentStep={step} />
          <TabWizardNav currentStep={step} completedSteps={completed} onTabClick={handleTabClick} />
          <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-8">
            {step === 0 && (
              <StepAboutCompany data={formData} onChange={handleChange} onValidate={handleValidate} />
            )}
            {step === 1 && (
              <StepOfficeLocations data={formData} onChange={handleChange} onValidate={handleValidate} />
            )}
            {step === 2 && (
              <StepServices data={formData} onChange={handleChange} onValidate={handleValidate} />
            )}
            {step === 3 && (
              <StepCompanyHistory data={formData} onChange={handleChange} onValidate={handleValidate} />
            )}
            {/* Placeholder for other steps */}
            {step > 3 && <div className="text-center text-gray-400 py-20">More steps coming soon…</div>}
          </div>
          <div className="flex justify-between">
            <button onClick={handlePrev} disabled={step === 0} className="px-6 py-2 rounded bg-gray-200 text-gray-600 disabled:opacity-50">Previous</button>
            <button onClick={handleNext} disabled={!canNext} className="px-6 py-2 rounded bg-primary text-white disabled:opacity-50">{step === steps.length - 1 ? 'Finish' : 'Save & Continue'}</button>
          </div>
        </div>
      </main>
    </div>
  );
} 