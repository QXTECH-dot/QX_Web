import { Company } from '@/types/company';
import { fuzzyMatch, fuzzySearch } from './FuzzySearch';
import { searchCache } from '@/services/searchCache';
import { saveSearchHistory } from '@/services/searchHistory';

// Define search parameters interface
export interface SearchParams {
  query?: string;
  location?: string;
  services?: string[];
  size?: string[];
  budget?: string[];
  industry?: string;
  abn?: string;
  sortBy?: 'name' | 'rating' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

// Define sort function type
type SortFunction = (a: Company, b: Company) => number;

// Get sort function
const getSortFunction = (params: SearchParams): SortFunction => {
  const { sortBy = 'relevance', sortOrder = 'desc' } = params;
  const order = sortOrder === 'asc' ? 1 : -1;

  switch (sortBy) {
    case 'name':
      return (a, b) => order * a.name.localeCompare(b.name);
    case 'rating':
      return (a, b) => order * ((a.rating || 0) - (b.rating || 0));
    case 'relevance':
    default:
      return (a, b) => 0; // Default to relevance sorting
  }
};

// Use index optimization for search
const createSearchIndex = (companies: Company[]) => {
  const index = {
    name: new Map<string, Company[]>(),
    location: new Map<string, Company[]>(),
    services: new Map<string, Company[]>(),
    industry: new Map<string, Company[]>(),
    abn: new Map<string, Company>()
  };

  companies.forEach(company => {
    // Index company name
    const nameWords = company.name.toLowerCase().split(/\s+/);
    nameWords.forEach(word => {
      if (!index.name.has(word)) {
        index.name.set(word, []);
      }
      index.name.get(word)!.push(company);
    });

    // Index location
    if (company.location) {
      const locationWords = company.location.toLowerCase().split(/\s+/);
      locationWords.forEach(word => {
        if (!index.location.has(word)) {
          index.location.set(word, []);
        }
        index.location.get(word)!.push(company);
      });
    }

    // Index services
    company.services.forEach(service => {
      const serviceWords = service.toLowerCase().split(/\s+/);
      serviceWords.forEach(word => {
        if (!index.services.has(word)) {
          index.services.set(word, []);
        }
        index.services.get(word)!.push(company);
      });
    });

    // Index industry
    if (company.industry) {
      const industryWords = company.industry.toLowerCase().split(/\s+/);
      industryWords.forEach(word => {
        if (!index.industry.has(word)) {
          index.industry.set(word, []);
        }
        index.industry.get(word)!.push(company);
      });
    }

    // Index ABN
    if (company.abn) {
      index.abn.set(company.abn, company);
    }
  });

  return index;
};

let searchIndex: ReturnType<typeof createSearchIndex> | null = null;

// Function to search companies based on provided parameters with fuzzy matching
export function searchCompanies(companies: Company[], params: SearchParams): Company[] {
  // Check cache
  const cachedResults = searchCache.get(params);
  if (cachedResults) {
    return cachedResults;
  }

  // Initialize search index
  if (!searchIndex) {
    searchIndex = createSearchIndex(companies);
  }

  // Create a copy of companies to filter
  let filteredCompanies = [...companies];

  // Use index for search
  if (params.query && params.query.trim() !== '') {
    const query = params.query.toLowerCase().trim();
    const queryWords = query.split(/\s+/);

    // Use index to find matching companies
    const matchedCompanies = new Set<Company>();
    
    queryWords.forEach(word => {
      // Search by name
      const nameMatches = searchIndex!.name.get(word) || [];
      nameMatches.forEach(company => matchedCompanies.add(company));

      // Search by service
      const serviceMatches = searchIndex!.services.get(word) || [];
      serviceMatches.forEach(company => matchedCompanies.add(company));

      // Search ABN (exact match)
      if (searchIndex!.abn.has(word)) {
        matchedCompanies.add(searchIndex!.abn.get(word)!);
      }
    });

    filteredCompanies = Array.from(matchedCompanies);
  }

  // Filter by location with fuzzy matching
  if (params.location && params.location.trim() !== '') {
    const locations = params.location.toLowerCase().trim().split(',');
    
    // 打印选择的地区，便于调试
    console.log('Selected locations for filtering:', locations);
    
    filteredCompanies = filteredCompanies.filter(company => {
      // 如果没有选择地区或长度为0，不进行筛选
      if (locations.length === 0 || locations.includes('all')) {
        return true;
      }
      
      // 检查公司的offices数据 - 这是主要的匹配逻辑
      if (company.offices && company.offices.length > 0) {
        // 检查公司的任何办公室是否在选定的州/地区
        for (const loc of locations) {
          // 检查是否有任何办公室的state字段匹配当前地区
          const hasOfficeInLocation = company.offices.some(office => {
            if (!office.state) return false;
            
            const stateValue = office.state.toLowerCase();
            
            // 直接比较州/地区代码（大多数情况）
            if (stateValue === loc.toLowerCase()) {
              return true;
            }
            
            // 州/地区名称和代码的映射
            const stateMap: Record<string, string[]> = {
              'nsw': ['new south wales', 'nsw'],
              'vic': ['victoria', 'vic'],
              'qld': ['queensland', 'qld'],
              'wa': ['western australia', 'wa'],
              'sa': ['south australia', 'sa'],
              'tas': ['tasmania', 'tas'],
              'act': ['australian capital territory', 'act', 'canberra'],
              'nt': ['northern territory', 'nt']
            };
            
            // 使用映射检查完整州名与代码的匹配
            return stateMap[loc] && stateMap[loc].some(stateName => stateValue.includes(stateName));
          });
          
          if (hasOfficeInLocation) {
            return true;
          }
        }
        
        // 如果公司有办公室但没有匹配的地区，则不符合条件
        return false;
      }
      
      // 后备：检查公司location字段（如果没有offices数据）
      if (company.location) {
        const companyLocation = company.location.toLowerCase();
        
        // 检查任何选定地区是否匹配公司位置
        for (const loc of locations) {
          // 直接检查位置中是否包含地区代码
          if (companyLocation.includes(loc.toLowerCase())) {
            return true;
          }
          
          // 兼容不同格式的地区名称
          const stateMap: Record<string, string[]> = {
            'nsw': ['new south wales', 'nsw'],
            'vic': ['victoria', 'vic'],
            'qld': ['queensland', 'qld'],
            'wa': ['western australia', 'wa'],
            'sa': ['south australia', 'sa'],
            'tas': ['tasmania', 'tas'],
            'act': ['australian capital territory', 'act', 'canberra'],
            'nt': ['northern territory', 'nt']
          };
          
          // 使用地区名称映射进行匹配
          if (stateMap[loc] && stateMap[loc].some(stateName => companyLocation.includes(stateName))) {
            return true;
          }
        }
      }
      
      // 如果既没有offices数据又没有location匹配，则不符合条件
      return false;
    });
    
    // 打印筛选结果数量，便于调试
    console.log(`After location filtering, found ${filteredCompanies.length} companies`);
  }

  // Filter by services with fuzzy matching
  if (params.services && params.services.length > 0) {
    filteredCompanies = filteredCompanies.filter(company =>
      params.services!.some(searchService =>
        company.services.some(companyService =>
          fuzzyMatch(companyService, searchService, 0.7)
        )
      )
    );
  }

  // Filter by team size (exact match as these are categories)
  if (params.size && params.size.length > 0) {
    filteredCompanies = filteredCompanies.filter(company =>
      params.size!.includes(company.teamSize)
    );
  }

  // Filter by industry with fuzzy matching
  if (params.industry && params.industry.trim() !== '') {
    const industry = params.industry.toLowerCase().trim();
    filteredCompanies = filteredCompanies.filter(company =>
      company.industry && fuzzyMatch(company.industry, industry, 0.7)
    );
  }

  // Filter by ABN (fuzzy but with higher threshold for precision)
  if (params.abn && params.abn.trim() !== '') {
    const abn = params.abn.trim();
    // For ABN, we want a higher threshold since it's a numeric identifier
    // Also try partial matching for ABN
    filteredCompanies = filteredCompanies.filter(company =>
      company.abn && (
        fuzzyMatch(company.abn, abn, 0.8) ||
        company.abn.includes(abn)
      )
    );
  }

  // Apply sorting
  const sortFunction = getSortFunction(params);
  filteredCompanies.sort(sortFunction);

  // Save to cache
  searchCache.set(params, filteredCompanies);

  // Save search history
  saveSearchHistory(params);

  return filteredCompanies;
}

// Function to get suggested search terms based on input with fuzzy matching
export function getSuggestedSearchTerms(
  companies: Company[],
  input: string,
  limit: number = 5
): string[] {
  if (!input || input.trim() === '') return [];

  const query = input.toLowerCase().trim();
  const allTerms: string[] = [];

  // Use index to collect suggestions
  if (searchIndex) {
    // Collect company name suggestions
    searchIndex.name.forEach((_, word) => {
      if (word.includes(query) && !allTerms.includes(word)) {
        allTerms.push(word);
      }
    });

    // Collect service suggestions
    searchIndex.services.forEach((_, word) => {
      if (word.includes(query) && !allTerms.includes(word)) {
        allTerms.push(word);
      }
    });

    // Collect industry suggestions
    searchIndex.industry.forEach((_, word) => {
      if (word.includes(query) && !allTerms.includes(word)) {
        allTerms.push(word);
      }
    });
  }

  // Use fuzzy search to find matching terms
  return fuzzySearch(query, allTerms, 0.6).slice(0, limit);
}

// Additional helper function to generate highlighted search results
export function getHighlightedSearchResults(
  companies: Company[],
  query: string
): Company[] {
  // This is a placeholder that would generate a version of companies with
  // highlighted text in the name/description fields based on the query
  return companies;
}
