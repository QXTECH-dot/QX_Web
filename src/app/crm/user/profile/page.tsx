"use client";

import React, { useState, useEffect } from 'react';
import { Camera, Mail, Phone, Briefcase, Building, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/crm/shared/layout/Sidebar';
import AvatarCropper from '@/components/AvatarCropper';
import { User, getUserByEmail, createOrUpdateUser, updateUser } from '@/lib/firebase/services/user';
import { uploadUserAvatar, generateUserId } from '@/lib/firebase/services/storage';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<User>({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    position: '',
    company: '',
    avatar: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Avatar upload states
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (status === 'loading') return;
      
      if (status === 'unauthenticated') {
        setError('Please log in first');
        setLoading(false);
        return;
      }

      if (!session?.user?.email) {
        setError('Unable to get user email');
        setLoading(false);
        return;
      }

      try {
        console.log('[ProfilePage] Loading user data for:', session.user.email);
        const userData = await getUserByEmail(session.user.email);
        
        if (userData) {
          setProfile(userData);
          console.log('[ProfilePage] User data loaded:', userData);
        } else {
          // If user doesn't exist, create default data
          const defaultProfile: User = {
            email: session.user.email,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            position: '',
            company: '',
            avatar: ''
          };
          setProfile(defaultProfile);
          console.log('[ProfilePage] No user data found, using default');
        }
      } catch (error: any) {
        console.error('[ProfilePage] Error loading user data:', error);
        setError('Failed to load user data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [session, status]);

  // Save user data
  const handleSave = async () => {
    if (!session?.user?.email) {
      setError('Unable to get user email');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Ensure email field is correct
      const profileData = {
        ...profile,
        email: session.user.email
      };

      console.log('[ProfilePage] Saving user data:', profileData);
      await createOrUpdateUser(profileData);
      
      setIsEditing(false);
      console.log('[ProfilePage] User data saved successfully');
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded z-50';
      successMessage.textContent = 'Profile saved successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
      
    } catch (error: any) {
      console.error('[ProfilePage] Error saving user data:', error);
      setError('Save failed: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = async () => {
    if (!session?.user?.email) return;
    
    try {
      // Reload original data
      const userData = await getUserByEmail(session.user.email);
      if (userData) {
        setProfile(userData);
      }
    setIsEditing(false);
      setError(null);
    } catch (error: any) {
      console.error('[ProfilePage] Error reloading user data:', error);
    }
  };

  // Handle avatar file selection
  const handleAvatarFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file must be less than 5MB');
      return;
    }
    
    // Clear any previous errors
    setError(null);

    // Create preview URL
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setSelectedImage(result);
        setShowAvatarCropper(true);
      } else {
        setError('Failed to read image file');
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    
    reader.readAsDataURL(file);
    
    // Reset file input
    event.target.value = '';
  };

  // Handle cropped avatar upload
  const handleAvatarCropComplete = async (croppedImageBlob: Blob) => {
    if (!session?.user?.email) {
      setError('User email not found');
      return;
    }

    try {
      setUploadingAvatar(true);
      setShowAvatarCropper(false);
      setError(null);

      // Generate user ID for storage
      const userId = generateUserId(session.user.email);
      
      // Upload to Firebase Storage
      const avatarUrl = await uploadUserAvatar(croppedImageBlob, userId);
      
      // Update profile with new avatar URL
      const updatedProfile = { ...profile, avatar: avatarUrl };
      setProfile(updatedProfile);
      
      // Save to database
      await createOrUpdateUser(updatedProfile);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded z-50';
      successMessage.textContent = 'Avatar updated successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);

    } catch (error: any) {
      console.error('[ProfilePage] Error uploading avatar:', error);
      setError('Failed to upload avatar: ' + error.message);
    } finally {
      setUploadingAvatar(false);
      setSelectedImage('');
    }
  };

  // Handle avatar cropper cancel
  const handleAvatarCropCancel = () => {
    setShowAvatarCropper(false);
    setSelectedImage('');
  };

  if (loading) {
  return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#FFD600]" />
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">My Profile</h1>
          
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-red-800">{error}</div>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Profile Header */}
            <div className="flex items-start gap-6 mb-8">
              <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-200">
                    {uploadingAvatar ? (
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-[#FFD600]" />
                        <span className="text-xs text-gray-500 mt-1">Uploading...</span>
                      </div>
                    ) : profile.avatar ? (
                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileSelect}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label 
                      htmlFor="avatar-upload"
                      className="bg-[#FFD600] p-2 rounded-full text-white hover:bg-[#FFD600]/90 cursor-pointer transition-colors inline-block"
                      title="Upload new avatar"
                    >
                      <Camera size={16} />
                    </label>
                  </div>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
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
                          `${profile.firstName} ${profile.lastName}`.trim() || 'Add Your Name'
                      )}
                    </h2>
                    {!isEditing && (
                      <div className="text-gray-600">
                        {profile.position && profile.company ? `${profile.position} at ${profile.company}` : 'Add Position & Company'}
                      </div>
                    )}
                  </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            disabled={saving}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-[#FFD600] text-white rounded hover:bg-[#FFD600]/90 flex items-center gap-2"
                            disabled={saving}
                          >
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                        </>
                      ) : (
                  <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-[#FFD600] text-white rounded hover:bg-[#FFD600]/90"
                  >
                          Edit Profile
                  </button>
                      )}
                    </div>
                  </div>
              </div>
            </div>

            {/* Contact Information */}
              <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-2">
                  <Mail className="text-gray-400" size={20} />
                    <span>{profile.email || 'No Email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-400" size={20} />
                  {isEditing ? (
                    <input
                      type="tel"
                        value={profile.phoneNumber}
                        onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                      placeholder="Phone Number"
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                      <span>{profile.phoneNumber || 'Add Phone'}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="text-gray-400" size={20} />
                  {isEditing ? (
                      <input
                        type="text"
                        value={profile.position}
                        onChange={(e) => setProfile({...profile, position: e.target.value})}
                        placeholder="Position"
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span>{profile.position || 'Add Position'}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="text-gray-400" size={20} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.company}
                        onChange={(e) => setProfile({...profile, company: e.target.value})}
                        placeholder="Company"
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span>{profile.company || 'Add Company'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Avatar Cropper Modal */}
      {showAvatarCropper && selectedImage && (
        <AvatarCropper
          src={selectedImage}
          onCropComplete={handleAvatarCropComplete}
          onCancel={handleAvatarCropCancel}
        />
      )}
    </>
  );
} 