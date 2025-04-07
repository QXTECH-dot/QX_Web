"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Save, User, Lock, Bell, Globe, Shield, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'QX Net',
    siteDescription: 'Australia\'s premier business directory',
    timezone: 'Australia/Sydney',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    language: 'en-AU',
  });

  const [emailSettings, setEmailSettings] = useState({
    fromName: 'QX Net',
    fromEmail: 'noreply@qxnet.com.au',
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpEncryption: 'tls',
    smtpUsername: 'smtp_user',
    smtpPassword: '********',
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    strongPasswords: true,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    ipWhitelisting: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newUserNotification: true,
    newEventNotification: true,
    systemUpdates: true,
    marketingEmails: false,
    weeklyDigest: true,
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Manage your application settings and preferences.</p>
        </div>

        {/* Settings tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex border-b">
            <button
              className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'general'
                  ? 'border-b-2 border-qxnet text-qxnet'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('general')}
            >
              <Globe className="h-4 w-4 inline-block mr-2" />
              General
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'email'
                  ? 'border-b-2 border-qxnet text-qxnet'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('email')}
            >
              <Mail className="h-4 w-4 inline-block mr-2" />
              Email
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'security'
                  ? 'border-b-2 border-qxnet text-qxnet'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('security')}
            >
              <Shield className="h-4 w-4 inline-block mr-2" />
              Security
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'notifications'
                  ? 'border-b-2 border-qxnet text-qxnet'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="h-4 w-4 inline-block mr-2" />
              Notifications
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm focus:outline-none ${
                activeTab === 'account'
                  ? 'border-b-2 border-qxnet text-qxnet'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('account')}
            >
              <User className="h-4 w-4 inline-block mr-2" />
              Account
            </button>
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
                  <input
                    type="text"
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  >
                    <option value="Australia/Sydney">Australia/Sydney</option>
                    <option value="Australia/Melbourne">Australia/Melbourne</option>
                    <option value="Australia/Brisbane">Australia/Brisbane</option>
                    <option value="Australia/Perth">Australia/Perth</option>
                    <option value="Australia/Adelaide">Australia/Adelaide</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                  <select
                    value={generalSettings.dateFormat}
                    onChange={(e) => setGeneralSettings({...generalSettings, dateFormat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
                  <select
                    value={generalSettings.timeFormat}
                    onChange={(e) => setGeneralSettings({...generalSettings, timeFormat: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  >
                    <option value="24h">24-hour (13:30)</option>
                    <option value="12h">12-hour (1:30 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  >
                    <option value="en-AU">English (Australia)</option>
                    <option value="en-US">English (United States)</option>
                    <option value="en-GB">English (United Kingdom)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                  <input
                    type="text"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                  <input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                  <input
                    type="text"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                  <input
                    type="text"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Encryption</label>
                  <select
                    value={emailSettings.smtpEncryption}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpEncryption: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  >
                    <option value="none">None</option>
                    <option value="ssl">SSL</option>
                    <option value="tls">TLS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
                  <input
                    type="text"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
                  <input
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Test Email Connection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Require users to confirm their identity with a second authentication method.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id="twoFactorToggle"
                      checked={securitySettings.twoFactorAuth}
                      onChange={() => setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth})}
                    />
                    <span
                      className={`block w-6 h-6 rounded-full transform transition-transform ${
                        securitySettings.twoFactorAuth ? 'translate-x-6 bg-qxnet' : 'translate-x-0 bg-white'
                      } shadow-md`}
                    ></span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Strong Passwords</h3>
                    <p className="text-sm text-gray-500">Require users to create passwords with a mix of letters, numbers, and symbols.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id="strongPasswordsToggle"
                      checked={securitySettings.strongPasswords}
                      onChange={() => setSecuritySettings({...securitySettings, strongPasswords: !securitySettings.strongPasswords})}
                    />
                    <span
                      className={`block w-6 h-6 rounded-full transform transition-transform ${
                        securitySettings.strongPasswords ? 'translate-x-6 bg-qxnet' : 'translate-x-0 bg-white'
                      } shadow-md`}
                    ></span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                    min="5"
                    max="240"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
                  <input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
                    min="3"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">IP Whitelisting</h3>
                    <p className="text-sm text-gray-500">Restrict admin access to specific IP addresses.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id="ipWhitelistingToggle"
                      checked={securitySettings.ipWhitelisting}
                      onChange={() => setSecuritySettings({...securitySettings, ipWhitelisting: !securitySettings.ipWhitelisting})}
                    />
                    <span
                      className={`block w-6 h-6 rounded-full transform transition-transform ${
                        securitySettings.ipWhitelisting ? 'translate-x-6 bg-qxnet' : 'translate-x-0 bg-white'
                      } shadow-md`}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New User Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications when new users register.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id="newUserToggle"
                      checked={notificationSettings.newUserNotification}
                      onChange={() => setNotificationSettings({...notificationSettings, newUserNotification: !notificationSettings.newUserNotification})}
                    />
                    <span
                      className={`block w-6 h-6 rounded-full transform transition-transform ${
                        notificationSettings.newUserNotification ? 'translate-x-6 bg-qxnet' : 'translate-x-0 bg-white'
                      } shadow-md`}
                    ></span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">New Event Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications when new events are created.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id="newEventToggle"
                      checked={notificationSettings.newEventNotification}
                      onChange={() => setNotificationSettings({...notificationSettings, newEventNotification: !notificationSettings.newEventNotification})}
                    />
                    <span
                      className={`block w-6 h-6 rounded-full transform transition-transform ${
                        notificationSettings.newEventNotification ? 'translate-x-6 bg-qxnet' : 'translate-x-0 bg-white'
                      } shadow-md`}
                    ></span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">System Updates</h3>
                    <p className="text-sm text-gray-500">Receive notifications about system updates and maintenance.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id="systemUpdatesToggle"
                      checked={notificationSettings.systemUpdates}
                      onChange={() => setNotificationSettings({...notificationSettings, systemUpdates: !notificationSettings.systemUpdates})}
                    />
                    <span
                      className={`block w-6 h-6 rounded-full transform transition-transform ${
                        notificationSettings.systemUpdates ? 'translate-x-6 bg-qxnet' : 'translate-x-0 bg-white'
                      } shadow-md`}
                    ></span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-sm text-gray-500">Receive emails about new features and promotions.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id="marketingToggle"
                      checked={notificationSettings.marketingEmails}
                      onChange={() => setNotificationSettings({...notificationSettings, marketingEmails: !notificationSettings.marketingEmails})}
                    />
                    <span
                      className={`block w-6 h-6 rounded-full transform transition-transform ${
                        notificationSettings.marketingEmails ? 'translate-x-6 bg-qxnet' : 'translate-x-0 bg-white'
                      } shadow-md`}
                    ></span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Weekly Digest</h3>
                    <p className="text-sm text-gray-500">Receive a weekly summary of site activity.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                    <input
                      type="checkbox"
                      className="sr-only"
                      id="weeklyDigestToggle"
                      checked={notificationSettings.weeklyDigest}
                      onChange={() => setNotificationSettings({...notificationSettings, weeklyDigest: !notificationSettings.weeklyDigest})}
                    />
                    <span
                      className={`block w-6 h-6 rounded-full transform transition-transform ${
                        notificationSettings.weeklyDigest ? 'translate-x-6 bg-qxnet' : 'translate-x-0 bg-white'
                      } shadow-md`}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Settings */}
          {activeTab === 'account' && (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value="Admin User"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value="admin@qxnet.com.au"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        placeholder="Enter your current password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                      />
                    </div>
                    <button className="bg-qxnet hover:bg-qxnet-600 text-black font-medium py-2 px-4 rounded-md transition-colors flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              className="bg-qxnet hover:bg-qxnet-600 text-black font-medium py-2 px-4 rounded-md transition-colors flex items-center"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
