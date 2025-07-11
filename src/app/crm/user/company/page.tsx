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
import { getCompanyById, updateCompany } from '@/lib/firebase/services/company';
import { useSession, signOut } from 'next-auth/react';
import { getCompaniesByUser } from '@/lib/firebase/services/userCompany';
import { syncFirebaseAuth, waitForFirebaseAuth, testFirestoreConnection, getCurrentFirebaseUser } from '@/lib/firebase/auth';

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

// Australian industry classification (A-Z sorted)
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

// Extract office form as independent component
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

// Add option data
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

  // Mock AI summary
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
  const [services, setServices] = useState<any[]>(data.services || []);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    onChange && onChange({ ...data, services });
    onValidate && onValidate(true);
  }, [services]);

  const resetForm = () => setForm({ title: '', description: '' });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAddOrUpdate = () => {
    if (!form.title || !form.description) {
      setError('Title and Description are required');
      return;
    }
    setError('');
    let newServices = [...services];
    if (editing !== null) {
      newServices[editing] = { ...form };
    } else {
      newServices.push({ ...form });
    }
    setServices(newServices);
    setEditing(null);
    resetForm();
  };

  const handleEdit = (idx: number) => {
    setEditing(idx);
    setForm({ ...services[idx] });
  };

  const handleDelete = (idx: number) => {
    setServices(services.filter((_, i) => i !== idx));
    if (editing === idx) {
      setEditing(null);
      resetForm();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Services</h2>
      <div className="mb-6">
        {services.length === 0 && <div className="text-gray-400">No services added yet.</div>}
        {services.map((service, idx) => (
          <div key={idx} className="border rounded p-4 mb-2 flex flex-col md:flex-row md:items-center gap-2">
            <div className="flex-1">
              <div><b>Title:</b> {service.title}</div>
              <div><b>Description:</b> {service.description}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600 underline" onClick={() => handleEdit(idx)}>Edit</button>
              <button className="text-red-600 underline" onClick={() => handleDelete(idx)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="border rounded p-4 mb-4 bg-gray-50">
        <h3 className="font-semibold mb-2">{editing !== null ? 'Edit Service' : 'Add New Service'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={form.title} onChange={handleInput} placeholder="Title*" className="border rounded p-2" />
          <textarea name="description" value={form.description} onChange={handleInput} placeholder="Description*" className="border rounded p-2 md:col-span-2" />
        </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="mt-4 flex gap-2">
          <button type="button" className="bg-primary text-white px-4 py-2 rounded" onClick={handleAddOrUpdate}>{editing !== null ? 'Save Changes' : 'Add Service'}</button>
          {editing !== null && <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={() => { setEditing(null); resetForm(); }}>Cancel</button>}
        </div>
      </div>
    </div>
  );
}

function StepCompanyHistory({ data, onChange, onValidate }: any) {
  const [history, setHistory] = useState<any[]>(data.history || []);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ year: '', event: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    onChange && onChange({ ...data, history });
    onValidate && onValidate(true);
  }, [history]);

  const resetForm = () => setForm({ year: '', event: '' });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAddOrUpdate = () => {
    if (!form.year || !form.event) {
      setError('Year and Event are required');
      return;
    }
    setError('');
    let newHistory = [...history];
    if (editing !== null) {
      newHistory[editing] = { ...form };
    } else {
      newHistory.push({ ...form });
    }
    setHistory(newHistory);
    setEditing(null);
    resetForm();
  };

  const handleEdit = (idx: number) => {
    setEditing(idx);
    setForm({ ...history[idx] });
  };

  const handleDelete = (idx: number) => {
    setHistory(history.filter((_, i) => i !== idx));
    if (editing === idx) {
      setEditing(null);
      resetForm();
    }
  };

  return (
              <div>
      <h2 className="text-xl font-bold mb-4">Company History</h2>
      <div className="mb-6">
        {history.length === 0 && <div className="text-gray-400">No history events added yet.</div>}
        {history.map((item, idx) => (
          <div key={idx} className="border rounded p-4 mb-2 flex flex-col md:flex-row md:items-center gap-2">
            <div className="flex-1">
              <div><b>Year:</b> {item.year}</div>
              <div><b>Event:</b> {item.event}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600 underline" onClick={() => handleEdit(idx)}>Edit</button>
              <button className="text-red-600 underline" onClick={() => handleDelete(idx)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      <div className="border rounded p-4 mb-4 bg-gray-50">
        <h3 className="font-semibold mb-2">{editing !== null ? 'Edit Event' : 'Add New Event'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="year" value={form.year} onChange={handleInput} placeholder="Year*" className="border rounded p-2" />
          <input name="event" value={form.event} onChange={handleInput} placeholder="Event*" className="border rounded p-2" />
            </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="mt-4 flex gap-2">
          <button type="button" className="bg-primary text-white px-4 py-2 rounded" onClick={handleAddOrUpdate}>{editing !== null ? 'Save Changes' : 'Add Event'}</button>
          {editing !== null && <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={() => { setEditing(null); resetForm(); }}>Cancel</button>}
            </div>
          </div>
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
              // Save company info to localStorage for email verification page
              localStorage.setItem('pendingCompanyVerification', JSON.stringify(company));
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
            <button className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-yellow-500 transition" onClick={() => {
              const newCompany = { abn, name: `Company with ABN ${abn}`, industry: '' };
              // Save company info to localStorage for email verification page
              localStorage.setItem('pendingCompanyVerification', JSON.stringify(newCompany));
              onBind(newCompany);
              router.push('/crm/user/company/email-verify');
            }}>
              Create New Company Profile
          </button>
        </div>
                  )}
                </div>
              </div>
  );
}

// Universal unique ID generation function to avoid SSR/CSR inconsistency
const generateId = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
};

function StepOfficeLocations({ data, onChange, onValidate }: any) {
  const [offices, setOffices] = useState<any[]>(data.offices || []);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    address: '', city: '', contactPerson: '', email: '', phone: '', postalCode: '', state: '', isHeadquarter: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    onChange && onChange({ ...data, offices });
    onValidate && onValidate(true);
  }, [offices]);

  const resetForm = () => setForm({ address: '', city: '', contactPerson: '', email: '', phone: '', postalCode: '', state: '', isHeadquarter: false });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddOrUpdate = () => {
    if (!form.address || !form.city) {
      setError('Address and City are required');
      return;
    }
    setError('');
    let newOffices = [...offices];
    if (form.isHeadquarter) {
      newOffices = newOffices.map(o => ({ ...o, isHeadquarter: false }));
    }
    if (editing !== null) {
      newOffices[editing] = { ...form };
    } else {
      newOffices.push({ ...form });
    }
    setOffices(newOffices);
    setEditing(null);
    resetForm();
  };

  const handleEdit = (idx: number) => {
    setEditing(idx);
    setForm({ ...offices[idx] });
  };

  const handleDelete = (idx: number) => {
    setOffices(offices.filter((_, i) => i !== idx));
    if (editing === idx) {
      setEditing(null);
      resetForm();
    }
  };

  const handleSetHeadquarter = (idx: number) => {
    setOffices(offices.map((o, i) => ({ ...o, isHeadquarter: i === idx })));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Office Locations</h2>
      <div className="mb-6">
        {offices.length === 0 && <div className="text-gray-400">No office locations. Please add one.</div>}
        {offices.map((office, idx) => (
          <div key={idx} className={`border rounded p-4 mb-2 flex flex-col md:flex-row md:items-center gap-2 ${office.isHeadquarter ? 'border-primary' : ''}`}>
              <div className="flex-1">
              <div><b>Address:</b> {office.address}</div>
              <div><b>City:</b> {office.city}</div>
              <div><b>Contact Person:</b> {office.contactPerson}</div>
              <div><b>Email:</b> {office.email}</div>
              <div><b>Phone:</b> {office.phone}</div>
              <div><b>Postal Code:</b> {office.postalCode}</div>
              <div><b>State:</b> {office.state}</div>
              {office.isHeadquarter && <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs ml-2">Headquarter</span>}
                </div>
            <div className="flex gap-2">
              <button className="text-blue-600 underline" onClick={() => handleEdit(idx)}>Edit</button>
              <button className="text-red-600 underline" onClick={() => handleDelete(idx)}>Delete</button>
              {!office.isHeadquarter && <button className="text-yellow-600 underline" onClick={() => handleSetHeadquarter(idx)}>Set as Headquarter</button>}
                    </div>
                  </div>
        ))}
                </div>
      <div className="border rounded p-4 mb-4 bg-gray-50">
        <h3 className="font-semibold mb-2">{editing !== null ? 'Edit Office' : 'Add New Office'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="address" value={form.address} onChange={handleInput} placeholder="Address*" className="border rounded p-2" />
          <input name="city" value={form.city} onChange={handleInput} placeholder="City*" className="border rounded p-2" />
          <input name="contactPerson" value={form.contactPerson} onChange={handleInput} placeholder="Contact Person" className="border rounded p-2" />
          <input name="email" value={form.email} onChange={handleInput} placeholder="Email" className="border rounded p-2" />
          <input name="phone" value={form.phone} onChange={handleInput} placeholder="Phone" className="border rounded p-2" />
          <input name="postalCode" value={form.postalCode} onChange={handleInput} placeholder="Postal Code" className="border rounded p-2" />
          <input name="state" value={form.state} onChange={handleInput} placeholder="State" className="border rounded p-2" />
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="isHeadquarter" checked={form.isHeadquarter} onChange={handleInput} /> Set as Headquarter
          </label>
              </div>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <div className="mt-4 flex gap-2">
          <button type="button" className="bg-primary text-white px-4 py-2 rounded" onClick={handleAddOrUpdate}>{editing !== null ? 'Save Changes' : 'Add Office'}</button>
          {editing !== null && <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={() => { setEditing(null); resetForm(); }}>Cancel</button>}
            </div>
          </div>
              </div>
  );
}



export default function CompanyManagementPage() {
  const { data: session, status } = useSession();
  const [boundCompany, setBoundCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeout, setTimeoutFlag] = useState(false);
  const [isCheckingBind, setIsCheckingBind] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setTimeout(() => setTimeoutFlag(true), 3000);
    } else {
      setTimeoutFlag(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const checkBind = async () => {
      // Prevent duplicate calls
      if (isCheckingBind) {
        console.log('[Company Management] Already checking, skipping...');
        return;
      }
      
      console.log('[Company Management] Starting checkBind...');
      setIsCheckingBind(true);
      setError(null);
      
      // Get user email
      const userAny = session?.user as any;
      const userEmail = userAny?.email;
      const idToken = (session as any)?.idToken;
      

      
      try {
        if (status === 'loading') {
          setLoading(true);
          setIsCheckingBind(false);
          return;
        }
        if (status === 'unauthenticated') {
          setLoading(false);
          setError('Please log in first.');
          setIsCheckingBind(false);
          return;
        }
        if (status === 'authenticated') {
          if (!userEmail) {
            setLoading(false);
            setError('User email missing, please re-login.');
            setIsCheckingBind(false);
            return;
          }
          
          // Try Firebase Auth sync, but don't require success
          if (idToken) {
            console.log('[Company Management] Attempting Firebase Auth sync...');
            try {
              const firebaseUser = await syncFirebaseAuth(idToken);
              if (firebaseUser) {
                console.log('[Company Management] Firebase Auth sync successful:', firebaseUser.uid);
              } else {
                console.warn('[Company Management] Firebase Auth sync failed, but continuing...');
              }
            } catch (error) {
              console.warn('[Company Management] Firebase Auth error, but continuing:', error);
            }
          } else {
            console.warn('[Company Management] No idToken available, but continuing...');
          }
          
          // Brief wait
          await new Promise(resolve => setTimeout(resolve, 300));
          
          console.log('[Company Management] Checking company binding...');
          try {
            const list = await getCompaniesByUser(userEmail);
            console.log('[Company Management] Company list:', list);
            
            if (list.length > 0) {
              console.log('[Company Management] Found bound companies, redirecting to overview...');
              router.push('/crm/user/company/overview');
            } else {
              console.log('[Company Management] No bound companies, showing bind form...');
              setLoading(false);
            }
          } catch (queryError: any) {
            console.error('[Company Management] Query error:', queryError);
            if (queryError.code === 'permission-denied') {
              setError('Database permission denied. Authentication may still be in progress. Please wait a moment and refresh.');
            } else {
              setError(`Database query failed: ${queryError.message}`);
            }
            setLoading(false);
            return;
          }
        }
      } catch (e: any) {
        console.error('[Company Management] Error:', e);
        setError('Failed to check company binding. ' + (e?.message || JSON.stringify(e)));
        setLoading(false);
      } finally {
        setIsCheckingBind(false);
      }
    }
    
    // Only run when session status changes to avoid infinite loop
    if (!hasInitialized && status !== 'loading') {
      setHasInitialized(true);
      checkBind();
    }
  }, [session, status, hasInitialized, router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">

        {(loading || isCheckingBind) && !timeout && <div>Loading...</div>}
        {loading && timeout && <div className="text-red-500 mb-4">Session timeout, please refresh or log in again.</div>}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="text-red-800 mb-2">{error}</div>
            <div className="flex gap-2">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Refresh Page
                </button>
              {error.includes('login session has expired') && (
                <button 
                  onClick={async () => {
                    try {
                      // Properly sign out NextAuth session
                      await signOut({ 
                        callbackUrl: '/',
                        redirect: true 
                      });
                    } catch (error) {
                      console.error('Error signing out:', error);
                      // Use fallback method if signOut fails
                      if (typeof window !== 'undefined') {
                        localStorage.clear();
                        sessionStorage.clear();
                        window.location.href = '/login';
                      }
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Re-login
                </button>
              )}
              </div>
          </div>
        )}
        {!loading && !error && !isCheckingBind && (
          <CompanyBindABN onBind={setBoundCompany} />
        )}
      </main>
    </div>
  );
} 