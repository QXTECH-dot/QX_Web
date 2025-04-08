"use client";

import React, { useState } from 'react';
import { Users, Mail, Phone, Building2, MapPin, UserPlus, UserMinus } from 'lucide-react';
import Sidebar from '@/components/crm/shared/layout/Sidebar';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  position: string;
  company: string;
  location: string;
  email: string;
  phone: string;
  connectedAt: string;
  isFollowing: boolean;
}

export default function BusinessNetworkPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Ming Zhang',
      avatar: '/avatars/contact1.png',
      position: 'Technical Director',
      company: 'Tech Solutions Australia',
      location: 'Sydney, Australia',
      email: 'ming.zhang@tech-au.com',
      phone: '+61 2 8888 8888',
      connectedAt: '2024-02-15',
      isFollowing: true
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: '/avatars/contact2.png',
      position: 'Business Development Manager',
      company: 'Green Energy New Zealand',
      location: 'Wellington, New Zealand',
      email: 'sarah.j@green-nz.com',
      phone: '+64 4 777 7777',
      connectedAt: '2024-03-01',
      isFollowing: true
    },
    {
      id: '3',
      name: 'David Chen',
      avatar: '/avatars/contact3.png',
      position: 'Marketing Director',
      company: 'Digital Marketing Pro',
      location: 'Melbourne, Australia',
      email: 'david.c@dmp.com.au',
      phone: '+61 3 9999 9999',
      connectedAt: '2024-03-05',
      isFollowing: false
    },
    {
      id: '4',
      name: 'Emma Wilson',
      avatar: '/avatars/contact4.png',
      position: 'Software Engineer',
      company: 'FinTech Solutions Ltd',
      location: 'Singapore',
      email: 'emma.w@fintech.sg',
      phone: '+65 6666 6666',
      connectedAt: '2024-03-08',
      isFollowing: true
    },
    {
      id: '5',
      name: 'Michael Lee',
      avatar: '/avatars/contact5.png',
      position: 'Healthcare Consultant',
      company: 'Healthcare Innovations',
      location: 'Brisbane, Australia',
      email: 'michael.l@healthcare.com.au',
      phone: '+61 7 7777 7777',
      connectedAt: '2024-03-10',
      isFollowing: false
    },
    {
      id: '6',
      name: 'Sophie Taylor',
      avatar: '/avatars/contact6.png',
      position: 'Education Specialist',
      company: 'Education Tech Systems',
      location: 'Auckland, New Zealand',
      email: 'sophie.t@edutech.co.nz',
      phone: '+64 9 888 8888',
      connectedAt: '2024-03-12',
      isFollowing: true
    },
    {
      id: '7',
      name: 'James Anderson',
      avatar: '/avatars/contact7.png',
      position: 'Sales Director',
      company: 'Cloud Solutions Hub',
      location: 'Perth, Australia',
      email: 'james.a@cloudsolutions.com.au',
      phone: '+61 8 6666 6666',
      connectedAt: '2024-03-15',
      isFollowing: true
    },
    {
      id: '8',
      name: 'Linda Wang',
      avatar: '/avatars/contact8.png',
      position: 'UX Designer',
      company: 'Creative Digital Studio',
      location: 'Sydney, Australia',
      email: 'linda.w@creative.studio',
      phone: '+61 2 7777 7777',
      connectedAt: '2024-03-18',
      isFollowing: false
    },
    {
      id: '9',
      name: 'Robert Kim',
      avatar: '/avatars/contact9.png',
      position: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'Melbourne, Australia',
      email: 'robert.k@analytics.pro',
      phone: '+61 3 8888 8888',
      connectedAt: '2024-03-20',
      isFollowing: true
    },
    {
      id: '10',
      name: 'Emily Chang',
      avatar: '/avatars/contact10.png',
      position: 'Product Manager',
      company: 'Tech Innovators',
      location: 'Singapore',
      email: 'emily.c@techinnovators.sg',
      phone: '+65 8888 8888',
      connectedAt: '2024-03-22',
      isFollowing: true
    }
  ]);

  const toggleFollow = (id: string) => {
    setContacts(contacts.map(contact =>
      contact.id === id
        ? { ...contact, isFollowing: !contact.isFollowing }
        : contact
    ));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-64">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Business Network</h1>
              <div className="text-gray-600">
                Total {contacts.length} contacts
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.map(contact => (
                <div key={contact.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                          {contact.avatar ? (
                            <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-full h-full p-2 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.position}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleFollow(contact.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-colors ${
                          contact.isFollowing
                            ? 'border-red-500 text-red-500 hover:bg-red-50'
                            : 'border-[#E4BF2D] text-[#E4BF2D] hover:bg-[#E4BF2D]/10'
                        }`}
                      >
                        {contact.isFollowing ? (
                          <>
                            <UserMinus size={14} />
                            <span>Unfollow</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={14} />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 size={14} className="flex-shrink-0" />
                        <span className="truncate">{contact.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="truncate">{contact.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} className="flex-shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} className="flex-shrink-0" />
                        <span className="truncate">{contact.phone}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                      Connected on {contact.connectedAt}
                    </div>
                  </div>
                </div>
              ))}

              {contacts.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-lg">
                  <Users className="mx-auto text-gray-400 mb-3" size={48} />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Business Contacts</h3>
                  <p className="text-gray-600">Start following other users to build your business network</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 