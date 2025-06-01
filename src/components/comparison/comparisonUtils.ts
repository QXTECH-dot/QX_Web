import { Company } from '@/types/company';
import { ComparisonFilterCategory } from './ComparisonFilter';
import { MapPin } from 'lucide-react';

export type ComparisonValue = string | boolean | number | undefined;

export interface ComparisonFeature {
  id: string;
  label: string;
  category: 'basic' | 'financial' | 'services' | 'technical';
  getValue: (company: Company) => ComparisonValue;
  renderValue?: (value: ComparisonValue) => React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

// Define all the features that can be compared
export const comparisonFeatures: ComparisonFeature[] = [
  {
    id: 'state',
    label: 'State',
    category: 'basic',
    getValue: (company) => {
      if (!company.offices || !Array.isArray(company.offices)) return 'Not specified';
      const states = Array.from(new Set(company.offices.map((o: any) => o.state).filter(Boolean)));
      return states.length > 0 ? states.join(', ') : 'Not specified';
    },
    icon: MapPin,
  },
  {
    id: 'industry',
    label: 'Industry',
    category: 'basic',
    getValue: (company) => {
      if (Array.isArray(company.industry)) return company.industry.join(', ');
      if (typeof company.industry === 'string') return company.industry;
      return 'Not specified';
    },
  },
  {
    id: 'teamSize',
    label: 'Team Size',
    category: 'basic',
    getValue: (company) => company.teamSize,
  },
  {
    id: 'hourlyRate',
    label: 'Hourly Rate',
    category: 'financial',
    getValue: (company) => company.hourlyRate,
  },
  {
    id: 'founded',
    label: 'Founded',
    category: 'basic',
    getValue: (company) => company.founded,
  },
  {
    id: 'abn',
    label: 'ABN',
    category: 'basic',
    getValue: (company) => company.abn,
  },
  {
    id: 'minimumProjectSize',
    label: 'Min. Project Size',
    category: 'financial',
    getValue: (company) => company.minimumProjectSize,
  },
  {
    id: 'avgProjectLength',
    label: 'Avg. Project Length',
    category: 'financial',
    getValue: (company) => company.avgProjectLength,
  },
];

// Get features applicable to the selected filter
export function getFilteredFeatures(
  filter: ComparisonFilterCategory,
  companies: Company[]
): ComparisonFeature[] {
  // First, filter features by category
  let filteredFeatures = [...comparisonFeatures];

  if (filter === 'basic') {
    filteredFeatures = filteredFeatures.filter(f => f.category === 'basic');
  } else if (filter === 'financial') {
    filteredFeatures = filteredFeatures.filter(f => f.category === 'financial');
  } else if (filter === 'technical') {
    filteredFeatures = filteredFeatures.filter(f => f.category === 'technical');
  } else if (filter === 'services') {
    // Return empty array as services are handled differently
    return [];
  }

  // Filter for differences or similarities
  if (filter === 'differences' || filter === 'similarities') {
    filteredFeatures = filteredFeatures.filter(feature => {
      // Get all values for this feature across all companies
      const values = companies.map(c => feature.getValue(c));

      // Check if all values are the same
      const allSame = values.every(v => v === values[0]);

      // For 'differences', keep features where values differ
      // For 'similarities', keep features where values are the same
      return filter === 'differences' ? !allSame : allSame;
    });
  }

  return filteredFeatures;
}

// Get all unique services across companies
export function getAllServices(companies: Company[]): string[] {
  const servicesSet = new Set<string>();

  companies.forEach(c => {
    const arr = Array.isArray(c.services) ? c.services : [];
    arr.forEach(service => {
      servicesSet.add(service);
    });
  });

  return Array.from(servicesSet);
}

// Filter services based on differences or similarities
export function getFilteredServices(
  filter: ComparisonFilterCategory,
  companies: Company[]
): string[] {
  let services = getAllServices(companies);

  // If not services filter and not differences/similarities, return all services
  if (filter !== 'services' && filter !== 'differences' && filter !== 'similarities') {
    return filter === 'all' ? services : [];
  }

  // Filter for differences or similarities in services
  if (filter === 'differences' || filter === 'similarities') {
    services = services.filter(service => {
      // Count how many companies have this service
      const count = companies.filter(c => c.services.includes(service)).length;

      // For 'differences', keep services that not all companies have
      // For 'similarities', keep services that all companies have
      return filter === 'differences'
        ? count > 0 && count < companies.length
        : count === companies.length;
    });
  }

  return services;
}

// Highlight differences in feature values
export function shouldHighlightValue(
  feature: ComparisonFeature,
  value: ComparisonValue,
  companies: Company[],
  highlightDifferences: boolean
): boolean {
  if (!highlightDifferences) return false;

  // Get all values for this feature across all companies
  const allValues = companies.map(c => feature.getValue(c));

  // Check if current value is different from others
  const isDifferent = allValues.some(v => v !== value);

  return isDifferent;
}
