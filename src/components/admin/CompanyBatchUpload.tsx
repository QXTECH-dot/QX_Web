'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface UploadResult {
  success: boolean;
  message: string;
  results?: {
    total: number;
    success: number;
    failed: number;
    errors: string[];
    servicesGenerated: number;
    uploadedToDatabase: number;
  };
  sampleCompanies?: any[];
}

export default function CompanyBatchUpload() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // CSV模板数据
  const csvTemplate = `name,trading_name,abn,industry,industry_1,industry_2,industry_3,status,foundedYear,website,email,phone,employeeCount,shortDescription,address,city,state,postalCode
"ABC Electrical Services","ABC Electric","12345678901","Electrician","Professional, Scientific and Technical Services","Other Professional, Scientific and Technical Services","Electrician","active",2010,"https://abcelectric.com.au","info@abcelectric.com.au","0412345678","11-50","Professional electrical services","123 Main St","Sydney","NSW","2000"
"XYZ Beauty Salon","XYZ Beauty","98765432109","Beauty","Other Services","Personal and Other Services","Beauty","active",2015,"https://xyzbeauty.com.au","contact@xyzbeauty.com.au","0434567890","1-10","Premium beauty treatments","456 High St","Melbourne","VIC","3000"`;

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = parseCSVLine(line);
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index]?.replace(/"/g, '').trim() || '';
          });
          return obj;
        });
      
      setCsvData(data);
      setPreviewData(data.slice(0, 5)); // 显示前5行预览
      setResult(null);
    };
    
    reader.readAsText(file);
  };

  // 简单的CSV行解析
  const parseCSVLine = (line: string): string[] => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current);
    return values;
  };

  // 执行批量上传
  const handleBatchUpload = async () => {
    if (!csvData.length) return;
    
    setUploading(true);
    setResult(null);
    
    try {
      console.log(`🔄 开始批量上传 ${csvData.length} 个公司...`);
      
      const response = await fetch('/api/admin/companies/batch-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companies: csvData }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const uploadResult = await response.json();
      setResult(uploadResult);
      
      if (uploadResult.success) {
        console.log('✅ 批量上传成功:', uploadResult.results);
      }
      
    } catch (error) {
      console.error('❌ 批量上传失败:', error);
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed'
      });
    } finally {
      setUploading(false);
    }
  };

  // 下载CSV模板
  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'company_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Batch Company Upload
        </h2>
        <p className="text-gray-600">
          Upload multiple companies via CSV file. Services will be automatically generated based on industry classification.
        </p>
      </div>

      {/* CSV模板下载 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-1">
              Download CSV Template
            </h3>
            <p className="text-blue-700 text-sm">
              Use this template to format your company data correctly.
            </p>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            <Download size={16} />
            Download Template
          </button>
        </div>
      </div>

      {/* 文件上传区域 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload CSV File
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="mb-4">
            <label htmlFor="csv-upload" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-500 font-medium">
                Click to upload
              </span>
              <span className="text-gray-500"> or drag and drop</span>
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-500">CSV files only</p>
        </div>
      </div>

      {/* 数据预览 */}
      {previewData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Data Preview ({csvData.length} companies loaded)
          </h3>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((company, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{company.name}</div>
                        {company.trading_name && (
                          <div className="text-gray-500">({company.trading_name})</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {company.industry_3 || company.industry_2 || company.industry_1 || company.industry || 'Not specified'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        company.status === 'active' ? 'bg-green-100 text-green-800' :
                        company.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {company.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {company.city && company.state ? `${company.city}, ${company.state}` : 'Not specified'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {csvData.length > 5 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing first 5 companies. Total: {csvData.length} companies.
            </p>
          )}
        </div>
      )}

      {/* 上传按钮 */}
      {csvData.length > 0 && (
        <div className="mb-6">
          <button
            onClick={handleBatchUpload}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-md hover:bg-primary/90 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={16} />
            {uploading ? `Uploading ${csvData.length} companies...` : `Upload ${csvData.length} Companies`}
          </button>
        </div>
      )}

      {/* 上传结果 */}
      {result && (
        <div className={`p-4 rounded-lg border ${
          result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            {result.success ? (
              <CheckCircle className="text-green-600 mt-1" size={20} />
            ) : (
              <AlertCircle className="text-red-600 mt-1" size={20} />
            )}
            <div className="flex-1">
              <h3 className={`font-medium ${
                result.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {result.success ? 'Upload Successful!' : 'Upload Failed'}
              </h3>
              <p className={`text-sm mt-1 ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </p>
              
              {result.success && result.results && (
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-900">{result.results.total}</div>
                      <div className="text-gray-600">Total Companies</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-green-600">{result.results.success}</div>
                      <div className="text-gray-600">Successful</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-red-600">{result.results.failed}</div>
                      <div className="text-gray-600">Failed</div>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <div className="font-medium text-blue-600">{result.results.servicesGenerated}</div>
                      <div className="text-gray-600">Services Generated</div>
                    </div>
                  </div>
                  
                  {result.results.errors.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {result.results.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                        {result.results.errors.length > 5 && (
                          <li>• ... and {result.results.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}