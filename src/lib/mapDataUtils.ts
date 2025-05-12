import { companiesData } from "@/data/companiesData";

// State names mapping
export const stateNames = {
  "australian-capital-territory": "Australian Capital Territory",
  "new-south-wales": "New South Wales",
  "northern-territory": "Northern Territory",
  "queensland": "Queensland",
  "south-australia": "South Australia",
  "tasmania": "Tasmania",
  "victoria": "Victoria",
  "western-australia": "Western Australia",
};

// Types for map data
export type StateData = {
  id: string;
  name: string;
  count: number;
  companies: any[];
  coordinates: { x: number; y: number };
  // For heatmap visualization
  density: number;
  growthRate: number;
  heatIndex: number;
};

export type MapData = Record<string, StateData>;

// Map coordinates for states (approximate centers)
const stateCoordinates = {
  "australian-capital-territory": { x: 660, y: 400 },
  "new-south-wales": { x: 630, y: 350 },
  "northern-territory": { x: 400, y: 200 },
  "queensland": { x: 550, y: 220 },
  "south-australia": { x: 350, y: 350 },
  "tasmania": { x: 500, y: 550 },
  "victoria": { x: 500, y: 450 },
  "western-australia": { x: 200, y: 300 },
};

// Get state ID from location
export const getStateIdFromLocation = (location: string): string => {
  if (location.includes("Sydney") || location.includes("New South Wales")) {
    return "new-south-wales";
  } else if (location.includes("Melbourne") || location.includes("Victoria")) {
    return "victoria";
  } else if (location.includes("Brisbane") || location.includes("Queensland")) {
    return "queensland";
  } else if (location.includes("Perth") || location.includes("Western Australia")) {
    return "western-australia";
  } else if (location.includes("Adelaide") || location.includes("South Australia")) {
    return "south-australia";
  } else if (location.includes("Hobart") || location.includes("Tasmania")) {
    return "tasmania";
  } else if (location.includes("Darwin") || location.includes("Northern Territory")) {
    return "northern-territory";
  } else if (location.includes("Canberra") || location.includes("ACT") || location.includes("Australian Capital Territory")) {
    return "australian-capital-territory";
  }
  return "";
};

// Get companies for a specific state
export const getCompaniesByState = (stateId: string) => {
  return companiesData.filter(company => {
    const companyStateId = getStateIdFromLocation(company.location);
    return companyStateId === stateId;
  });
};

// Generate initial map data
export const generateMapData = (industry: string = 'all'): MapData => {
  const mapData: MapData = {};

  // Initialize state data
  Object.entries(stateNames).forEach(([id, name]) => {
    mapData[id] = {
      id,
      name,
      count: 0,
      companies: [],
      coordinates: stateCoordinates[id as keyof typeof stateCoordinates],
      density: 0,
      growthRate: 0,
      heatIndex: 0,
    };
  });

  // Filter and count companies by state and industry
  companiesData.forEach(company => {
    const stateId = getStateIdFromLocation(company.location);

    if (stateId && mapData[stateId]) {
      // Check if company matches the industry filter
      if (industry === 'all' ||
          (company.services && company.services.some(s => s.toLowerCase().includes(industry.replace('-', ' '))))) {
        mapData[stateId].count++;
        mapData[stateId].companies.push(company);
      }
    }
  });

  // Calculate density (companies per square km)
  // Using approximate land area values for Australian states
  const landAreaApprox = {
    'new-south-wales': 809952,
    'victoria': 227416,
    'queensland': 1852642,
    'western-australia': 2526786,
    'south-australia': 983482,
    'tasmania': 68401,
    'northern-territory': 1420968,
    'australian-capital-territory': 2358,
  };

  // Calculate density, growth rate and heat index for each state
  Object.keys(mapData).forEach(stateId => {
    const count = mapData[stateId].count;
    const area = landAreaApprox[stateId as keyof typeof landAreaApprox] || 1;

    // Companies per 10,000 square km
    mapData[stateId].density = (count / area) * 10000;

    // Generate a more realistic growth rate based on historical data
    const baseGrowthRate = {
      'new-south-wales': 8,
      'victoria': 7,
      'queensland': 9,
      'western-australia': 6,
      'south-australia': 5,
      'tasmania': 4,
      'northern-territory': 3,
      'australian-capital-territory': 10,
    };

    // Add some randomness but keep it within reasonable bounds
    const randomFactor = (Math.random() * 4) - 2; // -2 to +2
    mapData[stateId].growthRate = (baseGrowthRate[stateId as keyof typeof baseGrowthRate] || 5) + randomFactor;

    // Heat index is a combination of density and growth rate
    // Higher values = "hotter" on heatmap
    const densityWeight = 0.6;
    const growthWeight = 0.4;
    mapData[stateId].heatIndex = 
      (mapData[stateId].density * densityWeight) + 
      (mapData[stateId].growthRate * growthWeight);
  });

  return mapData;
};

// Simulate real-time data update
export const updateMapData = (
  currentData: MapData,
  industry: string = 'all'
): MapData => {
  const newData = JSON.parse(JSON.stringify(currentData)) as MapData;

  // Small random changes to simulate real-time updates
  Object.keys(newData).forEach(stateId => {
    // Random change in growth rate (-1% to +1%)
    const growthRateDelta = (Math.random() * 2) - 1;
    newData[stateId].growthRate += growthRateDelta;

    // Keep growth rate within reasonable bounds
    if (newData[stateId].growthRate > 25) newData[stateId].growthRate = 25;
    if (newData[stateId].growthRate < -10) newData[stateId].growthRate = -10;

    // Update heat index
    newData[stateId].heatIndex = (newData[stateId].density * 0.6) + (newData[stateId].growthRate > 0 ? newData[stateId].growthRate * 2 : 0);

    // Occasionally add or remove a company (1% chance)
    if (Math.random() < 0.01) {
      if (Math.random() > 0.5 && newData[stateId].count > 0) {
        // Remove a company
        newData[stateId].count -= 1;
      } else {
        // Add a company
        newData[stateId].count += 1;
      }
    }
  });

  return newData;
};

// Get color for heatmap visualization
export const getHeatmapColor = (value: number): string => {
  // Normalize value to 0-100 range
  const normalized = Math.min(Math.max(value, 0), 100);

  // Color ranges from cool blue (low) to hot red (high)
  if (normalized < 20) {
    return '#74B9FF'; // Light blue
  } else if (normalized < 40) {
    return '#3498DB'; // Blue
  } else if (normalized < 60) {
    return '#F1C40F'; // Yellow
  } else if (normalized < 80) {
    return '#E67E22'; // Orange
  } else {
    return '#E74C3C'; // Red
  }
};

// Get companies by search term
export const getCompanySearchResults = (searchTerm: string, limit = 7) => {
  if (!searchTerm || searchTerm.length < 2) return [];

  return companiesData
    .filter(company => {
      const matchesName = company.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = company.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesServices = company.services?.some(service =>
        service.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesName || matchesLocation || matchesServices;
    })
    .slice(0, limit)
    .map(company => ({
      id: company.id,
      name: company.name,
      location: company.location,
      stateId: getStateIdFromLocation(company.location),
      logo: company.logo,
      rating: company.rating
    }));
};
