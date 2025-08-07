'use client';

import React, { useState } from 'react';
import IndustrySelector from '@/components/admin/IndustrySelector';

export default function TestIndustrySelector() {
  const [industry1, setIndustry1] = useState('');
  const [industry2, setIndustry2] = useState('');
  const [industry3, setIndustry3] = useState('');

  const handleSelectionChange = (ind1: string, ind2: string, ind3: string) => {
    setIndustry1(ind1);
    setIndustry2(ind2);
    setIndustry3(ind3);
    console.log('Selection changed:', { ind1, ind2, ind3 });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Industry Selector</h1>
      
      <div className="max-w-2xl">
        <IndustrySelector
          selectedIndustry1={industry1}
          selectedIndustry2={industry2}
          selectedIndustry3={industry3}
          onSelectionChange={handleSelectionChange}
        />
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Current Selection:</h2>
        <pre className="text-sm">{JSON.stringify({ industry1, industry2, industry3 }, null, 2)}</pre>
      </div>
    </div>
  );
}