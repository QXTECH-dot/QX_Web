'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Filter,
  Calendar,
  Building2,
  MapPin,
  Users,
  Download
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
  loading: () => <div className="h-80 bg-gray-50 rounded-lg animate-pulse" />
});

// 模拟数据 - 基于澳洲行业统计
const mockData = [
  // 2019年数据
  { id: "2019_agri_nsw_small", year: 2019, industry: "Agriculture, Forestry and Fishing", state: "NSW", employee_category: "1-19 employees", entry_count: 450, exit_count: 120, net_change: 330, final_count: 2800 },
  { id: "2019_agri_vic_small", year: 2019, industry: "Agriculture, Forestry and Fishing", state: "VIC", employee_category: "1-19 employees", entry_count: 380, exit_count: 95, net_change: 285, final_count: 2200 },
  { id: "2019_manu_nsw_medium", year: 2019, industry: "Manufacturing", state: "NSW", employee_category: "20-199 employees", entry_count: 320, exit_count: 80, net_change: 240, final_count: 3200 },
  { id: "2019_manu_vic_medium", year: 2019, industry: "Manufacturing", state: "VIC", employee_category: "20-199 employees", entry_count: 280, exit_count: 70, net_change: 210, final_count: 2900 },
  { id: "2019_tech_nsw_small", year: 2019, industry: "Information Media and Telecommunications", state: "NSW", employee_category: "1-19 employees", entry_count: 680, exit_count: 150, net_change: 530, final_count: 4200 },
  { id: "2019_tech_vic_small", year: 2019, industry: "Information Media and Telecommunications", state: "VIC", employee_category: "1-19 employees", entry_count: 520, exit_count: 120, net_change: 400, final_count: 3100 },
  { id: "2019_cons_qld_small", year: 2019, industry: "Construction", state: "QLD", employee_category: "1-19 employees", entry_count: 890, exit_count: 200, net_change: 690, final_count: 5200 },
  { id: "2019_cons_wa_small", year: 2019, industry: "Construction", state: "WA", employee_category: "1-19 employees", entry_count: 540, exit_count: 110, net_change: 430, final_count: 3400 },

  // 2020年数据  
  { id: "2020_agri_nsw_small", year: 2020, industry: "Agriculture, Forestry and Fishing", state: "NSW", employee_category: "1-19 employees", entry_count: 420, exit_count: 180, net_change: 240, final_count: 3040 },
  { id: "2020_agri_vic_small", year: 2020, industry: "Agriculture, Forestry and Fishing", state: "VIC", employee_category: "1-19 employees", entry_count: 350, exit_count: 140, net_change: 210, final_count: 2410 },
  { id: "2020_manu_nsw_medium", year: 2020, industry: "Manufacturing", state: "NSW", employee_category: "20-199 employees", entry_count: 280, exit_count: 120, net_change: 160, final_count: 3360 },
  { id: "2020_manu_vic_medium", year: 2020, industry: "Manufacturing", state: "VIC", employee_category: "20-199 employees", entry_count: 240, exit_count: 110, net_change: 130, final_count: 3030 },
  { id: "2020_tech_nsw_small", year: 2020, industry: "Information Media and Telecommunications", state: "NSW", employee_category: "1-19 employees", entry_count: 750, exit_count: 180, net_change: 570, final_count: 4770 },
  { id: "2020_tech_vic_small", year: 2020, industry: "Information Media and Telecommunications", state: "VIC", employee_category: "1-19 employees", entry_count: 580, exit_count: 140, net_change: 440, final_count: 3540 },
  { id: "2020_cons_qld_small", year: 2020, industry: "Construction", state: "QLD", employee_category: "1-19 employees", entry_count: 650, exit_count: 320, net_change: 330, final_count: 5530 },
  { id: "2020_cons_wa_small", year: 2020, industry: "Construction", state: "WA", employee_category: "1-19 employees", entry_count: 480, exit_count: 190, net_change: 290, final_count: 3690 },

  // 2021年数据
  { id: "2021_agri_nsw_small", year: 2021, industry: "Agriculture, Forestry and Fishing", state: "NSW", employee_category: "1-19 employees", entry_count: 500, exit_count: 100, net_change: 400, final_count: 3440 },
  { id: "2021_agri_vic_small", year: 2021, industry: "Agriculture, Forestry and Fishing", state: "VIC", employee_category: "1-19 employees", entry_count: 420, exit_count: 85, net_change: 335, final_count: 2745 },
  { id: "2021_manu_nsw_medium", year: 2021, industry: "Manufacturing", state: "NSW", employee_category: "20-199 employees", entry_count: 410, exit_count: 80, net_change: 330, final_count: 3690 },
  { id: "2021_manu_vic_medium", year: 2021, industry: "Manufacturing", state: "VIC", employee_category: "20-199 employees", entry_count: 360, exit_count: 70, net_change: 290, final_count: 3320 },
  { id: "2021_tech_nsw_small", year: 2021, industry: "Information Media and Telecommunications", state: "NSW", employee_category: "1-19 employees", entry_count: 820, exit_count: 120, net_change: 700, final_count: 5470 },
  { id: "2021_tech_vic_small", year: 2021, industry: "Information Media and Telecommunications", state: "VIC", employee_category: "1-19 employees", entry_count: 640, exit_count: 95, net_change: 545, final_count: 4085 },
  { id: "2021_cons_qld_small", year: 2021, industry: "Construction", state: "QLD", employee_category: "1-19 employees", entry_count: 780, exit_count: 150, net_change: 630, final_count: 6160 },
  { id: "2021_cons_wa_small", year: 2021, industry: "Construction", state: "WA", employee_category: "1-19 employees", entry_count: 620, exit_count: 120, net_change: 500, final_count: 4190 }
];

interface IndustryData {
  id: string;
  year: number;
  industry: string;
  state: string;
  employee_category: string;
  entry_count: number;
  exit_count: number;
  net_change: number;
  final_count: number;
}

interface FilterState {
  year: number[];
  industry: string[];
  state: string[];
  employee_category: string[];
}

// Year Trends Chart Component
function YearTrendsChart({ data }: { data: any[] }) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      data: ['New Entries', 'Exits', 'Net Change'],
      bottom: 10,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '8%',
      right: '8%',
      bottom: '20%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.year),
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Company Count',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: 'New Entries',
        type: 'bar',
        data: data.map(d => d.totalEntries),
        itemStyle: { color: '#10b981' }
      },
      {
        name: 'Exits',
        type: 'bar',
        data: data.map(d => d.totalExits),
        itemStyle: { color: '#ef4444' }
      },
      {
        name: 'Net Change',
        type: 'line',
        data: data.map(d => d.netChange),
        itemStyle: { color: '#3b82f6' },
        lineStyle: { width: 3 }
      }
    ]
  };

  return (
    <div className="h-full">
      {typeof window !== 'undefined' && (
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          theme="light"
        />
      )}
    </div>
  );
}

// State Distribution Chart Component
function StateDistributionChart({ data }: { data: any[] }) {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      textStyle: {
        fontSize: 11
      }
    },
    series: [
      {
        name: 'Companies',
        type: 'pie',
        radius: ['30%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map(d => ({
          value: d.total,
          name: d.state
        }))
      }
    ]
  };

  return (
    <div className="h-full">
      {typeof window !== 'undefined' && (
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          theme="light"
        />
      )}
    </div>
  );
}


export default function IndustryDataVisualizationPage() {
  const [data, setData] = useState<IndustryData[]>(mockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/industry-data');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          setData(result.data);
        } else {
          console.warn('No data from Firebase, using mock data');
          setData(mockData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data, using sample data');
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const [filters, setFilters] = useState<FilterState>({
    year: [],
    industry: [],
    state: [],
    employee_category: []
  });

  const availableFilters = {
    years: [...new Set(data.map(d => d.year))].sort(),
    industries: [...new Set(data.map(d => d.industry))].sort(),
    states: [...new Set(data.map(d => d.state))].sort(),
    employeeCategories: [...new Set(data.map(d => d.employee_category))].sort()
  };

  // 过滤数据
  const filteredData = data.filter(item => {
    return (
      (filters.year.length === 0 || filters.year.includes(item.year)) &&
      (filters.industry.length === 0 || filters.industry.includes(item.industry)) &&
      (filters.state.length === 0 || filters.state.includes(item.state)) &&
      (filters.employee_category.length === 0 || filters.employee_category.includes(item.employee_category))
    );
  });

  const toggleFilter = (type: keyof FilterState, value: string | number) => {
    setFilters(prev => {
      const current = prev[type] as any[];
      const exists = current.includes(value);
      
      return {
        ...prev,
        [type]: exists 
          ? current.filter(item => item !== value)
          : [...current, value]
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      year: [],
      industry: [],
      state: [],
      employee_category: []
    });
  };

  // 年度趋势数据
  const yearlyTrends = availableFilters.years.map(year => {
    const yearData = filteredData.filter(d => d.year === year);
    return {
      year,
      totalEntries: yearData.reduce((sum, d) => sum + d.entry_count, 0),
      totalExits: yearData.reduce((sum, d) => sum + d.exit_count, 0),
      netChange: yearData.reduce((sum, d) => sum + d.net_change, 0),
      finalCount: yearData.reduce((sum, d) => sum + d.final_count, 0)
    };
  });

  // 州分布数据
  const stateDistribution = availableFilters.states.map(state => {
    const stateTotal = filteredData
      .filter(d => d.state === state)
      .reduce((sum, d) => sum + d.final_count, 0);
    
    return { state, total: stateTotal };
  }).filter(d => d.total > 0);

  // 行业排名数据
  const industryRanking = availableFilters.industries
    .map(industry => {
      const industryTotal = filteredData
        .filter(d => d.industry === industry)
        .reduce((sum, d) => sum + d.final_count, 0);
      
      return { industry, total: industryTotal };
    })
    .filter(d => d.total > 0)
    .sort((a, b) => b.total - a.total);

  // 员工规模分布
  const employeeSizeDistribution = availableFilters.employeeCategories.map(category => {
    const categoryTotal = filteredData
      .filter(d => d.employee_category === category)
      .reduce((sum, d) => sum + d.final_count, 0);
    
    return { category, total: categoryTotal };
  }).filter(d => d.total > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading industry data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Industry Data Visualization
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
                Explore Australian industry trends, company growth patterns, and business insights across states and sectors (2019-2021)
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <Calendar className="h-6 w-6 mb-2 mx-auto" />
                <div className="text-xl font-bold">{availableFilters.years.length}</div>
                <div className="text-xs text-blue-100">Years of Data</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <Building2 className="h-6 w-6 mb-2 mx-auto" />
                <div className="text-xl font-bold">{availableFilters.industries.length}</div>
                <div className="text-xs text-blue-100">Industries</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <MapPin className="h-6 w-6 mb-2 mx-auto" />
                <div className="text-xl font-bold">{availableFilters.states.length}</div>
                <div className="text-xs text-blue-100">States</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
                <Users className="h-6 w-6 mb-2 mx-auto" />
                <div className="text-xl font-bold">{data.reduce((sum, d) => sum + d.final_count, 0).toLocaleString()}</div>
                <div className="text-xs text-blue-100">Total Companies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar Layout */}
      <section className="py-8">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filters */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </h2>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-primary hover:text-primary/80 font-medium px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Year Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Year
                    </h3>
                    <div className="space-y-2">
                      {availableFilters.years.map(year => (
                        <label key={year} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.year.includes(year)}
                            onChange={() => toggleFilter('year', year)}
                            className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-1"
                          />
                          <span className="font-medium">{year}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* State Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      State
                    </h3>
                    <div className="space-y-2">
                      {availableFilters.states.map(state => (
                        <label key={state} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.state.includes(state)}
                            onChange={() => toggleFilter('state', state)}
                            className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-1"
                          />
                          <span className="font-medium">{state}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Employee Category Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Employee Size
                    </h3>
                    <div className="space-y-2">
                      {availableFilters.employeeCategories.map(category => (
                        <label key={category} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.employee_category.includes(category)}
                            onChange={() => toggleFilter('employee_category', category)}
                            className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-1"
                          />
                          <span className="font-medium text-xs leading-tight">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Industry Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Industry
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2" style={{scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #F7FAFC'}}>
                      {availableFilters.industries.map(industry => (
                        <label key={industry} className="flex items-start gap-2 text-sm cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.industry.includes(industry)}
                            onChange={() => toggleFilter('industry', industry)}
                            className="rounded border-gray-300 text-primary focus:ring-primary focus:ring-1 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-xs leading-tight font-medium" title={industry}>{industry}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filter Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                    <div className="font-medium mb-1">Showing Results:</div>
                    <div className="text-primary font-bold">{filteredData.length}</div>
                    <div>of {data.length} records</div>
                    {error && (
                      <div className="mt-2 text-amber-600 bg-amber-100 p-2 rounded text-xs">
                        ⚠️ {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Charts Area */}
            <div className="flex-1 min-w-0">
              <div className="space-y-6">
                {/* Year Trends Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Company Growth Trends by Year
                  </h3>
                  
                  {/* Data Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {yearlyTrends.map(data => (
                      <div key={data.year} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border">
                        <div className="text-lg font-bold text-gray-900 mb-2">{data.year}</div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>New:</span>
                            <span className="font-medium text-green-600">{data.totalEntries.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Exits:</span>
                            <span className="font-medium text-red-600">{data.totalExits.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Net:</span>
                            <span className={`font-medium ${data.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {data.netChange >= 0 ? '+' : ''}{data.netChange.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between border-t pt-1">
                            <span>Total:</span>
                            <span className="font-bold text-blue-600">{data.finalCount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Chart */}
                  <div className="h-96 bg-gray-50 rounded-lg p-4">
                    <YearTrendsChart data={yearlyTrends} />
                  </div>
                </div>

                {/* State Distribution Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Company Distribution by State
                  </h3>
                  
                  {/* State Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {stateDistribution.map(data => (
                      <div key={data.state} className="bg-gradient-to-br from-blue-50 to-purple-50 p-3 rounded-lg border">
                        <div className="text-center">
                          <div className="font-bold text-lg text-primary">{data.state}</div>
                          <div className="text-sm text-gray-600">{data.total.toLocaleString()}</div>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${(data.total / Math.max(...stateDistribution.map(d => d.total))) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pie Chart */}
                  <div className="h-80 bg-gray-50 rounded-lg p-4">
                    <StateDistributionChart data={stateDistribution} />
                  </div>
                </div>

                {/* Industry Ranking */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Industries by Company Count
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {industryRanking.map((data, index) => (
                      <div key={data.industry} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              #{index + 1}
                            </div>
                            <div className="font-medium text-gray-800 text-sm leading-tight">
                              {data.industry}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-primary">{data.total.toLocaleString()}</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${(data.total / Math.max(...industryRanking.map(d => d.total))) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {((data.total / industryRanking.reduce((sum, d) => sum + d.total, 0)) * 100).toFixed(1)}% of total
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employee Size Distribution */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Companies by Employee Size Category
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {employeeSizeDistribution.map(data => (
                      <div key={data.category} className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border hover:shadow-md transition-all duration-300">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary mb-3">{data.total.toLocaleString()}</div>
                          <div className="text-sm font-medium text-gray-700 mb-2">{data.category}</div>
                          <div className="bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${((data.total / employeeSizeDistribution.reduce((sum, d) => sum + d.total, 0)) * 100)}%`
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {((data.total / employeeSizeDistribution.reduce((sum, d) => sum + d.total, 0)) * 100).toFixed(1)}% of total
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Summary */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Summary</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This visualization is based on Australian business registry data covering company entries, exits, and net changes across different industries, states, and employee size categories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Total New Entries</h3>
              <p className="text-3xl font-bold text-green-600">
                {data.reduce((sum, d) => sum + d.entry_count, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Companies entered market</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Total Exits</h3>
              <p className="text-3xl font-bold text-red-600">
                {data.reduce((sum, d) => sum + d.exit_count, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Companies exited market</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Net Growth</h3>
              <p className="text-3xl font-bold text-blue-600">
                +{data.reduce((sum, d) => sum + d.net_change, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Overall market expansion</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}