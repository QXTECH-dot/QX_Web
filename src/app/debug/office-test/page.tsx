"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OfficeTestPage() {
  const [offices, setOffices] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [allOffices, setAllOffices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取所有公司
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        if (response.ok) {
          const data = await response.json();
          if (data.companies && data.companies.length > 0) {
            // 查找ABC公司
            const abcCompany = data.companies.find((c: any) => c.name === 'ABC Company');
            if (abcCompany) {
              setCompanyId(abcCompany.id);
              console.log('Found ABC Company with ID:', abcCompany.id);
            } else if (data.companies[0]) {
              setCompanyId(data.companies[0].id);
              console.log('Using first company ID:', data.companies[0].id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  // 获取特定公司的办公室
  const fetchOffices = async () => {
    if (!companyId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/companies/${companyId}/offices`);
      const data = await response.json();
      console.log('Office API response:', data);
      
      if (data.offices) {
        setOffices(data.offices);
      } else {
        setOffices([]);
      }
    } catch (error) {
      console.error('Error fetching offices:', error);
      setOffices([]);
    } finally {
      setLoading(false);
    }
  };

  // 获取所有办公室
  const fetchAllOffices = async () => {
    setLoading(true);
    try {
      // 这是一个自定义API，需要在服务器端实现
      const response = await fetch('/api/debug/all-offices');
      const data = await response.json();
      console.log('All offices API response:', data);
      
      if (data.offices) {
        setAllOffices(data.offices);
      } else {
        setAllOffices([]);
      }
    } catch (error) {
      console.error('Error fetching all offices:', error);
      setAllOffices([]);
    } finally {
      setLoading(false);
    }
  };

  const createTestData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/demo-data');
      const data = await response.json();
      console.log('Demo data creation response:', data);
      if (data.company) {
        setCompanyId(data.company.id);
      }
    } catch (error) {
      console.error('Error creating demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Office Data Test Page</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Company ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{companyId || 'No company selected'}</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={fetchOffices} disabled={!companyId || loading}>
                Fetch Offices
              </Button>
              <Button onClick={createTestData} disabled={loading}>
                Create Demo Data
              </Button>
              <Button onClick={fetchAllOffices} disabled={loading}>
                Get All Offices
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Offices for Company ID: {companyId}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : offices.length > 0 ? (
            <div className="space-y-4">
              {offices.map((office) => (
                <div key={office.officeId} className="border p-4 rounded-md">
                  <h3 className="font-bold">{office.city} Office</h3>
                  <p>{office.address}</p>
                  <p>{office.state}, {office.postalCode}</p>
                  <p>Phone: {office.phone}</p>
                  <p>Email: {office.email}</p>
                  <p>Contact: {office.contactPerson}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Office ID: {office.officeId}</p>
                    <p>Company ID: {office.companyId}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No offices found for this company.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>All Offices in Database</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : allOffices.length > 0 ? (
            <div className="space-y-4">
              {allOffices.map((office) => (
                <div key={office.officeId} className="border p-4 rounded-md">
                  <h3 className="font-bold">{office.city} Office</h3>
                  <p>{office.address}</p>
                  <p>Company ID: <span className="font-mono text-xs bg-gray-100 p-1">{office.companyId}</span></p>
                  <p>Office ID: <span className="font-mono text-xs bg-gray-100 p-1">{office.officeId}</span></p>
                </div>
              ))}
            </div>
          ) : (
            <p>No offices found in database.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 