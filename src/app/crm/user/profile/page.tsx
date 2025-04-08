"use client";

import React, { useState } from 'react';
import { Camera, Mail, Phone, Briefcase, MapPin, Globe, Linkedin, Twitter } from 'lucide-react';
import Sidebar from '@/components/crm/shared/layout/Sidebar';

interface UserProfile {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  company: string;
  location: string;
  bio: string;
  website: string;
  linkedin: string;
  twitter: string;
  interests: string[];
  expertise: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    avatar: '/placeholder-avatar.png',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    company: '',
    location: '',
    bio: '',
    website: '',
    linkedin: '',
    twitter: '',
    interests: [],
    expertise: []
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">My Profile</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Profile Header */}
            <div className="flex items-start gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-[#E4BF2D] p-2 rounded-full text-white hover:bg-[#E4BF2D]/90">
                  <Camera size={16} />
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                            placeholder="First Name"
                            className="border rounded px-2 py-1"
                          />
                          <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                            placeholder="Last Name"
                            className="border rounded px-2 py-1"
                          />
                        </div>
                      ) : (
                        `${profile.firstName} ${profile.lastName}` || 'Add Your Name'
                      )}
                    </h2>
                    {!isEditing && (
                      <div className="text-gray-600">
                        {profile.position && profile.company ? `${profile.position} at ${profile.company}` : 'Add Position & Company'}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="px-4 py-2 bg-[#E4BF2D] text-white rounded hover:bg-[#E4BF2D]/90"
                  >
                    {isEditing ? 'Save' : 'Edit Profile'}
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="text-gray-400" size={20} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      placeholder="Email Address"
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span>{profile.email || 'Add Email'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-400" size={20} />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="Phone Number"
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span>{profile.phone || 'Add Phone'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="text-gray-400" size={20} />
                  {isEditing ? (
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        value={profile.position}
                        onChange={(e) => setProfile({...profile, position: e.target.value})}
                        placeholder="Position"
                        className="border rounded px-2 py-1 w-1/2"
                      />
                      <input
                        type="text"
                        value={profile.company}
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                        placeholder="Company"
                        className="border rounded px-2 py-1 w-1/2"
                      />
                    </div>
                  ) : (
                    <span>{profile.position && profile.company ? `${profile.position} at ${profile.company}` : 'Add Position & Company'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-gray-400" size={20} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      placeholder="Location"
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span>{profile.location || 'Add Location'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      placeholder="Write a short bio about yourself..."
                      className="border rounded px-3 py-2 w-full h-24"
                    />
                  ) : (
                    <p className="text-gray-600">{profile.bio || 'Add a bio to tell others about yourself'}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Globe className="text-gray-400" size={20} />
                    {isEditing ? (
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile({...profile, website: e.target.value})}
                        placeholder="Website URL"
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span>{profile.website || 'Add Website'}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="text-gray-400" size={20} />
                    {isEditing ? (
                      <input
                        type="url"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                        placeholder="LinkedIn Profile"
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span>{profile.linkedin || 'Add LinkedIn'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Areas of Expertise */}
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Areas of Expertise</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Add expertise (press Enter to add)"
                    className="border rounded px-2 py-1 w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        setProfile({
                          ...profile,
                          expertise: [...profile.expertise, e.currentTarget.value]
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise.map((item, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {item}
                        <button
                          onClick={() => setProfile({
                            ...profile,
                            expertise: profile.expertise.filter((_, i) => i !== index)
                          })}
                          className="text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.expertise.length > 0 ? (
                    profile.expertise.map((item, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">Add your areas of expertise</span>
                  )}
                </div>
              )}
            </div>

            {/* Business Interests */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Business Interests</h3>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Add interests (press Enter to add)"
                    className="border rounded px-2 py-1 w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        setProfile({
                          ...profile,
                          interests: [...profile.interests, e.currentTarget.value]
                        });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((item, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {item}
                        <button
                          onClick={() => setProfile({
                            ...profile,
                            interests: profile.interests.filter((_, i) => i !== index)
                          })}
                          className="text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.length > 0 ? (
                    profile.interests.map((item, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">Add your business interests</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 