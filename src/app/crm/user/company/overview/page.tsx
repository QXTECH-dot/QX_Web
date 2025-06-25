'use client';
import React from 'react';
import Sidebar from '@/components/crm/shared/layout/Sidebar';

// Mock company data for demo
const company = {
  name_en: 'QIXIN CO PTY LTD',
  abn: '75671782540',
  industry: 'IT Services',
  foundedYear: '2020',
  verified: true,
  website: 'https://qxnet.com.au',
  email: 'info@qxnet.com.au',
  phone: '+61 1234 5678',
  completionPercent: 80,
  offices: [
    { address: 'Level 1, 123 Main St', city: 'Sydney', state: 'NSW', isHeadquarter: true, contactPerson: 'Alex', phone: '+61 1234 5678', email: 'alex@qxnet.com.au' },
    { address: 'Suite 2, 456 George St', city: 'Melbourne', state: 'VIC', contactPerson: 'Jane', phone: '+61 8765 4321', email: 'jane@qxnet.com.au' }
  ],
  services: [
    { title: 'Web Development', description: 'Custom web application development.' },
    { title: 'Cloud Solutions', description: 'Cloud migration and management.' }
  ],
  history: [
    { year: '2020', event: 'Company founded' },
    { year: '2021', event: 'Opened Melbourne office' }
  ]
};

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {/* 顶部：欢迎标题+进度条 */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to QX Web, {company.name_en}!</h1>
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">Profile Completion</label>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-primary h-4 rounded-full"
                  style={{ width: `${company.completionPercent || 0}%` }}
                />
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {company.completionPercent || 0}%
              </div>
            </div>
          </div>

          {/* Company Info 卡片 */}
          <div className="bg-white rounded shadow p-6 relative">
            <button className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded" onClick={() => {}}>
              Edit Company Info
            </button>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Company Info</h2>
              <span className={`px-2 py-1 rounded text-xs ${company.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {company.verified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><b>Name:</b> {company.name_en}</div>
              <div><b>ABN:</b> {company.abn}</div>
              <div><b>Industry:</b> {company.industry}</div>
              <div><b>Founded Year:</b> {company.foundedYear}</div>
              <div><b>Website:</b> {company.website}</div>
              <div><b>Email:</b> {company.email}</div>
              <div><b>Phone:</b> {company.phone}</div>
            </div>
          </div>

          {/* Office Locations 卡片 */}
          <div className="bg-white rounded shadow p-6 relative">
            <button className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded" onClick={() => {}}>
              Edit Offices
            </button>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Office Locations</h2>
            </div>
            {company.offices && company.offices.length > 0 ? (
              <ul>
                {company.offices.map((office, idx) => (
                  <li key={idx} className="border-b py-2 flex justify-between items-center">
                    <div>
                      <b>{office.isHeadquarter ? 'Headquarter' : 'Office'}:</b> {office.address}, {office.city}, {office.state}
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
          </div>

          {/* Services 卡片 */}
          <div className="bg-white rounded shadow p-6 relative">
            <button className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded" onClick={() => {}}>
              Edit Services
            </button>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Services</h2>
            </div>
            {company.services && company.services.length > 0 ? (
              <ul>
                {company.services.map((service, idx) => (
                  <li key={idx} className="border-b py-2 flex justify-between items-center">
                    <div>
                      <b>{service.title}</b>: {service.description}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No services added yet.</div>
            )}
          </div>

          {/* Company History 卡片 */}
          <div className="bg-white rounded shadow p-6 relative">
            <button className="absolute top-6 right-6 bg-primary text-white px-4 py-2 rounded" onClick={() => {}}>
              Edit History
            </button>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Company History</h2>
            </div>
            {company.history && company.history.length > 0 ? (
              <ul>
                {company.history.map((item, idx) => (
                  <li key={idx} className="border-b py-2 flex items-center gap-4">
                    <span className="font-semibold text-primary">{item.year}</span>
                    <span>{item.event}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No history events added yet.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 