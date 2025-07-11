'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Building2,
  Phone,
  Mail,
  Clock,
  X,
  Save
} from 'lucide-react';

// Mock data - replace with actual data fetching
const mockOffices = [
  {
    id: 1,
    companyId: 1,
    companyName: 'Tech Solutions Pty Ltd',
    type: 'Head Office',
    address: '123 George Street',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    country: 'Australia',
    phone: '(02) 1234 5678',
    email: 'sydney@techsolutions.com',
    isHeadOffice: true,
    isActive: true,
    businessHours: '9:00 AM - 5:00 PM',
    createdAt: '2023-01-15'
  },
  {
    id: 2,
    companyId: 1,
    companyName: 'Tech Solutions Pty Ltd',
    type: 'Branch Office',
    address: '456 Collins Street',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
    country: 'Australia',
    phone: '(03) 2345 6789',
    email: 'melbourne@techsolutions.com',
    isHeadOffice: false,
    isActive: true,
    businessHours: '9:00 AM - 5:00 PM',
    createdAt: '2023-03-20'
  },
  {
    id: 3,
    companyId: 2,
    companyName: 'Innovation Corp',
    type: 'Head Office',
    address: '789 Bourke Street',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: '3001',
    country: 'Australia',
    phone: '(03) 3456 7890',
    email: 'head@innovationcorp.com',
    isHeadOffice: true,
    isActive: true,
    businessHours: '8:30 AM - 5:30 PM',
    createdAt: '2023-02-10'
  }
];

export default function CompanyOfficesManagement() {
  const [offices, setOffices] = useState(mockOffices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOffice, setEditingOffice] = useState<any>(null);
  const [newOffice, setNewOffice] = useState({
    companyId: '',
    type: 'Branch Office',
    address: '',
    suburb: '',
    state: '',
    postcode: '',
    country: 'Australia',
    phone: '',
    email: '',
    isHeadOffice: false,
    businessHours: '9:00 AM - 5:00 PM'
  });

  const companies = [
    { id: 1, name: 'Tech Solutions Pty Ltd' },
    { id: 2, name: 'Innovation Corp' },
    { id: 3, name: 'Digital Agency' },
    { id: 4, name: 'Green Energy Solutions' },
    { id: 5, name: 'Healthcare Plus' }
  ];

  const officeTypes = [
    'Head Office',
    'Branch Office',
    'Regional Office',
    'Warehouse',
    'Manufacturing Plant',
    'Sales Office',
    'Service Center'
  ];

  const filteredOffices = offices.filter(office => {
    const matchesSearch = office.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         office.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         office.suburb.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany === 'all' || office.companyId.toString() === selectedCompany;
    const matchesState = selectedState === 'all' || office.state === selectedState;
    
    return matchesSearch && matchesCompany && matchesState;
  });

  const handleAddOffice = () => {
    const company = companies.find(c => c.id.toString() === newOffice.companyId);
    if (company) {
      const office = {
        id: Date.now(),
        companyName: company.name,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
        ...newOffice,
        companyId: parseInt(newOffice.companyId)
      };
      setOffices([...offices, office]);
      setNewOffice({
        companyId: '',
        type: 'Branch Office',
        address: '',
        suburb: '',
        state: '',
        postcode: '',
        country: 'Australia',
        phone: '',
        email: '',
        isHeadOffice: false,
        businessHours: '9:00 AM - 5:00 PM'
      });
      setShowAddModal(false);
    }
  };

  const handleEditOffice = (office: any) => {
    setEditingOffice({...office});
  };

  const handleUpdateOffice = () => {
    if (editingOffice) {
      setOffices(offices.map(office => 
        office.id === editingOffice.id ? editingOffice : office
      ));
      setEditingOffice(null);
    }
  };

  const handleDeleteOffice = (id: number) => {
    setOffices(offices.filter(office => office.id !== id));
  };

  const getOfficeBadge = (office: any) => {
    if (office.isHeadOffice) {
      return <Badge className="bg-blue-100 text-blue-800">Head Office</Badge>;
    }
    return <Badge variant="outline">{office.type}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-100 text-green-800">Active</Badge> :
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Offices</h1>
            <p className="text-gray-600">Manage company office locations and addresses</p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Office
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search offices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="NSW">NSW</SelectItem>
                  <SelectItem value="VIC">VIC</SelectItem>
                  <SelectItem value="QLD">QLD</SelectItem>
                  <SelectItem value="WA">WA</SelectItem>
                  <SelectItem value="SA">SA</SelectItem>
                  <SelectItem value="TAS">TAS</SelectItem>
                  <SelectItem value="NT">NT</SelectItem>
                  <SelectItem value="ACT">ACT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Offices List */}
        <Card>
          <CardHeader>
            <CardTitle>Offices ({filteredOffices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOffices.map((office) => (
                <div key={office.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-lg">{office.companyName}</h3>
                          {getOfficeBadge(office)}
                          {getStatusBadge(office.isActive)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{office.address}</span>
                            </div>
                            <div className="ml-6">
                              {office.suburb}, {office.state} {office.postcode}
                            </div>
                            <div className="ml-6">
                              {office.country}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{office.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{office.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{office.businessHours}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost" title="View Details">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditOffice(office)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteOffice(office.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Office Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Add New Office</h3>
                <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Select value={newOffice.companyId} onValueChange={(value) => setNewOffice({...newOffice, companyId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map(company => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Office Type *</Label>
                    <Select value={newOffice.type} onValueChange={(value) => setNewOffice({...newOffice, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {officeTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={newOffice.address}
                    onChange={(e) => setNewOffice({...newOffice, address: e.target.value})}
                    placeholder="123 Business Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="suburb">Suburb *</Label>
                    <Input
                      id="suburb"
                      value={newOffice.suburb}
                      onChange={(e) => setNewOffice({...newOffice, suburb: e.target.value})}
                      placeholder="Sydney"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={newOffice.state} onValueChange={(value) => setNewOffice({...newOffice, state: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NSW">NSW</SelectItem>
                        <SelectItem value="VIC">VIC</SelectItem>
                        <SelectItem value="QLD">QLD</SelectItem>
                        <SelectItem value="WA">WA</SelectItem>
                        <SelectItem value="SA">SA</SelectItem>
                        <SelectItem value="TAS">TAS</SelectItem>
                        <SelectItem value="NT">NT</SelectItem>
                        <SelectItem value="ACT">ACT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postcode">Postcode *</Label>
                    <Input
                      id="postcode"
                      value={newOffice.postcode}
                      onChange={(e) => setNewOffice({...newOffice, postcode: e.target.value})}
                      placeholder="2000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={newOffice.country}
                      onChange={(e) => setNewOffice({...newOffice, country: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newOffice.phone}
                      onChange={(e) => setNewOffice({...newOffice, phone: e.target.value})}
                      placeholder="(02) 1234 5678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newOffice.email}
                      onChange={(e) => setNewOffice({...newOffice, email: e.target.value})}
                      placeholder="office@company.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessHours">Business Hours</Label>
                  <Input
                    id="businessHours"
                    value={newOffice.businessHours}
                    onChange={(e) => setNewOffice({...newOffice, businessHours: e.target.value})}
                    placeholder="9:00 AM - 5:00 PM"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isHeadOffice"
                    checked={newOffice.isHeadOffice}
                    onCheckedChange={(checked) => setNewOffice({...newOffice, isHeadOffice: checked as boolean})}
                  />
                  <Label htmlFor="isHeadOffice">This is the head office</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddOffice} disabled={!newOffice.companyId || !newOffice.address}>
                    <Save className="w-4 h-4 mr-2" />
                    Add Office
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Office Modal */}
        {editingOffice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Edit Office</h3>
                <Button variant="ghost" onClick={() => setEditingOffice(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editType">Office Type *</Label>
                    <Select value={editingOffice.type} onValueChange={(value) => setEditingOffice({...editingOffice, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {officeTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input value={editingOffice.companyName} disabled />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editAddress">Street Address *</Label>
                  <Input
                    id="editAddress"
                    value={editingOffice.address}
                    onChange={(e) => setEditingOffice({...editingOffice, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="editSuburb">Suburb *</Label>
                    <Input
                      id="editSuburb"
                      value={editingOffice.suburb}
                      onChange={(e) => setEditingOffice({...editingOffice, suburb: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editState">State *</Label>
                    <Select value={editingOffice.state} onValueChange={(value) => setEditingOffice({...editingOffice, state: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NSW">NSW</SelectItem>
                        <SelectItem value="VIC">VIC</SelectItem>
                        <SelectItem value="QLD">QLD</SelectItem>
                        <SelectItem value="WA">WA</SelectItem>
                        <SelectItem value="SA">SA</SelectItem>
                        <SelectItem value="TAS">TAS</SelectItem>
                        <SelectItem value="NT">NT</SelectItem>
                        <SelectItem value="ACT">ACT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editPostcode">Postcode *</Label>
                    <Input
                      id="editPostcode"
                      value={editingOffice.postcode}
                      onChange={(e) => setEditingOffice({...editingOffice, postcode: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editCountry">Country</Label>
                    <Input
                      id="editCountry"
                      value={editingOffice.country}
                      onChange={(e) => setEditingOffice({...editingOffice, country: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editPhone">Phone</Label>
                    <Input
                      id="editPhone"
                      value={editingOffice.phone}
                      onChange={(e) => setEditingOffice({...editingOffice, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editEmail">Email</Label>
                    <Input
                      id="editEmail"
                      type="email"
                      value={editingOffice.email}
                      onChange={(e) => setEditingOffice({...editingOffice, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editBusinessHours">Business Hours</Label>
                  <Input
                    id="editBusinessHours"
                    value={editingOffice.businessHours}
                    onChange={(e) => setEditingOffice({...editingOffice, businessHours: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="editIsHeadOffice"
                      checked={editingOffice.isHeadOffice}
                      onCheckedChange={(checked) => setEditingOffice({...editingOffice, isHeadOffice: checked as boolean})}
                    />
                    <Label htmlFor="editIsHeadOffice">This is the head office</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="editIsActive"
                      checked={editingOffice.isActive}
                      onCheckedChange={(checked) => setEditingOffice({...editingOffice, isActive: checked as boolean})}
                    />
                    <Label htmlFor="editIsActive">Office is active</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingOffice(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateOffice}>
                    <Save className="w-4 h-4 mr-2" />
                    Update Office
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 