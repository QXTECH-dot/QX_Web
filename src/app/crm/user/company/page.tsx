"use client";

import React, { useState, useCallback } from 'react';
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

// Placeholder data - replace with actual data fetching and state management
const initialCompanyData = {
  logo: '/placeholder-logo.png',
  name: 'Incrementors Web Solutions',
  verified: true,
  location: 'Delhi, India',
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
      title: 'Search Engine Optimization (SEO)',
      description: 'Data-driven SEO strategies to improve your website\'s visibility in search engines, drive organic traffic, and increase conversions.'
    },
    {
      title: 'Pay Per Click (PPC)',
      description: 'Targeted PPC campaign management to maximize your advertising ROI across Google, Bing, and social media platforms.'
    },
    {
      title: 'Social Media Marketing',
      description: 'Strategic social media marketing to build your brand presence, engage with customers, and drive traffic and sales.'
    },
    {
      title: 'Content Marketing',
      description: 'High-quality content creation and strategic distribution to attract, engage, and convert your target audience.'
    }
  ]
};

interface Service {
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

export default function CompanyManagementPage() {
  const [companyData, setCompanyData] = useState(initialCompanyData);
  const [services, setServices] = useState<Service[]>(initialCompanyData.initialServices);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([
    { year: '2012', event: 'Company founded in Delhi, India' },
    { year: '2015', event: 'Expanded business to Asian market, team grew to 25 employees' },
    { year: '2018', event: 'Received Best Digital Marketing Agency Award' },
    { year: '2020', event: 'Launched remote marketing services during pandemic, helping clients adapt to the new normal' }
  ]);
  const [newEventYear, setNewEventYear] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  const [offices, setOffices] = useState<Office[]>(initialCompanyData.offices);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddService = () => {
    if (!newServiceTitle.trim() || !newServiceDesc.trim()) return;

    const newService: Service = {
      title: newServiceTitle.trim(),
      description: newServiceDesc.trim(),
    };

    setServices([...services, newService]);
    setNewServiceTitle('');
    setNewServiceDesc('');
  };

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
                  <div key={index} className="relative flex items-start">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#E4BF2D]/10 border-4 border-white z-10">
                      <Clock className="w-5 h-5 text-[#E4BF2D]" />
                    </div>
                    
                    <div className="ml-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xl font-bold text-[#E4BF2D]">{event.year}</span>
                          <p className="mt-2 text-gray-700">{event.event}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteEvent(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Logo</span>
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
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {companyData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> {companyData.industry}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 max-w-3xl">{companyData.description}</p>
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

              <div className="flex-shrink-0 flex flex-col gap-3 md:w-48">
                <button className="w-full px-4 py-2 bg-[#E4BF2D] text-white rounded-md font-semibold text-sm hover:bg-[#c7a625] transition-colors">
                  Get in Touch
                </button>
                <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Visit Website
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-200 flex flex-wrap gap-x-8 gap-y-4 justify-start">
            <div className="flex items-center gap-2 text-sm">
              <Languages className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-gray-500 block">Languages</span>
                <span className="font-medium text-gray-900">{companyData.languages}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-gray-500 block">Team Size</span>
                <span className="font-medium text-gray-900">{companyData.teamSize}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-gray-500 block">Founded</span>
                <span className="font-medium text-gray-900">{companyData.founded}</span>
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