import { Company } from '@/types/company';
import { fuzzyMatch, fuzzySearch } from './FuzzySearch';

// Define search parameters interface
export interface SearchParams {
  query?: string;
  location?: string;
  services?: string[];
  size?: string[];
  budget?: string[];
  industry?: string;
  abn?: string;
}

// Function to search companies based on provided parameters with fuzzy matching
export function searchCompanies(companies: Company[], params: SearchParams): Company[] {
  // Create a copy of companies to filter
  let filteredCompanies = [...companies];

  // Filter by general query (name, description, ABN) with fuzzy matching
  if (params.query && params.query.trim() !== '') {
    const query = params.query.toLowerCase().trim();

    // For fuzzy name and description matching
    filteredCompanies = filteredCompanies.filter(company =>
      fuzzyMatch(company.name, query, 0.6) ||
      fuzzyMatch(company.description, query, 0.5) ||
      (company.abn && company.abn.includes(query)) // ABN is exact match still for accuracy
    );
  }

  // Filter by location with fuzzy matching
  if (params.location && params.location.trim() !== '') {
    const location = params.location.toLowerCase().trim();
    filteredCompanies = filteredCompanies.filter(company =>
      fuzzyMatch(company.location, location, 0.7)
    );
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

  // Collect company names
  companies.forEach(company => {
    allTerms.push(company.name);
  });

  // Collect services
  companies.forEach(company => {
    company.services.forEach(service => {
      if (!allTerms.includes(service)) {
        allTerms.push(service);
      }
    });
  });

  // Collect industries
  companies.forEach(company => {
    if (company.industry && !allTerms.includes(company.industry)) {
      allTerms.push(company.industry);
    }
  });

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
