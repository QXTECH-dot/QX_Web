import { stateNames } from './mapDataUtils';
import { subMonths, format } from 'date-fns';

// Type definitions for timeline data
export interface StateGrowthPoint {
  date: string;
  count: number;
  growth: number;
}

export interface StateTimelineData {
  id: string;
  name: string;
  data: StateGrowthPoint[];
  color: string;
}

// Colors for states in charts
const stateColors = {
  'new-south-wales': '#3498db',
  'victoria': '#2ecc71',
  'queensland': '#f39c12',
  'western-australia': '#e74c3c',
  'south-australia': '#9b59b6',
  'tasmania': '#1abc9c',
  'northern-territory': '#d35400',
  'australian-capital-territory': '#34495e',
};

// Function to generate data points back from current date
export const generateHistoricalData = (stateId: string, months: number = 24): StateGrowthPoint[] => {
  // Current company counts based on mapDataUtils
  const currentCounts = {
    'new-south-wales': 210,
    'victoria': 185,
    'queensland': 130,
    'western-australia': 95,
    'south-australia': 75,
    'tasmania': 25,
    'northern-territory': 20,
    'australian-capital-territory': 45,
  };

  // Growth volatility by state (higher = more fluctuations)
  const volatility = {
    'new-south-wales': 0.2,
    'victoria': 0.25,
    'queensland': 0.15,
    'western-australia': 0.3,
    'south-australia': 0.2,
    'tasmania': 0.4,
    'northern-territory': 0.35,
    'australian-capital-territory': 0.25,
  };

  // Base growth rates
  const baseGrowthRate = {
    'new-south-wales': 2.5,
    'victoria': 2.8,
    'queensland': 2.0,
    'western-australia': 1.5,
    'south-australia': 1.2,
    'tasmania': 1.0,
    'northern-territory': 0.8,
    'australian-capital-territory': 3.0,
  };

  // Event dates that caused changes in growth rates (e.g., COVID, tech boom, etc.)
  const events = [
    { date: '2022-03', impact: -0.5 }, // COVID impact
    { date: '2022-09', impact: 0.8 },  // Tech recovery
    { date: '2023-01', impact: 0.3 },  // New year boost
    { date: '2023-06', impact: -0.2 }, // Economic slowdown
    { date: '2023-11', impact: 0.6 },  // End of year growth
    { date: '2024-02', impact: 0.4 },  // Tech boom
  ];

  // Generate data points
  const dataPoints: StateGrowthPoint[] = [];

  // Set current count
  const currentCount = currentCounts[stateId as keyof typeof currentCounts] || 50;

  // Current date
  const now = new Date();

  // Starting point (calculate backwards)
  let count = currentCount;
  for (let i = 0; i < months; i++) {
    // Calculate date for this point (going backward)
    const pointDate = subMonths(now, months - i - 1);
    const dateString = format(pointDate, 'yyyy-MM');

    // Apply event impacts if applicable
    const monthEvents = events.filter(event => event.date === dateString);
    let eventImpact = 0;
    if (monthEvents.length > 0) {
      eventImpact = monthEvents.reduce((sum, event) => sum + event.impact, 0);
    }

    // Calculate growth rate with randomness, volatility, and events
    const baseGrowth = baseGrowthRate[stateId as keyof typeof baseGrowthRate] || 1.5;
    const stateVolatility = volatility[stateId as keyof typeof volatility] || 0.2;
    const randomFactor = (Math.random() * 2 - 1) * stateVolatility;
    const growthRate = baseGrowth + randomFactor + eventImpact;

    // Calculate count for this point
    if (i > 0) {
      // Growth is applied to previous month's count
      count = Math.max(1, Math.round(dataPoints[i - 1].count * (1 + growthRate / 100)));
    } else {
      // First point is calculated backward from current
      count = Math.max(1, Math.round(currentCount / Math.pow(1 + baseGrowth / 100, months - 1)));
    }

    // Add data point
    dataPoints.push({
      date: dateString,
      count: count,
      growth: Number(growthRate.toFixed(1))
    });
  }

  return dataPoints;
};

// Get historical timeline data for multiple states
export const getStatesTimelineData = (stateIds: string[]): StateTimelineData[] => {
  return stateIds.map(stateId => ({
    id: stateId,
    name: stateNames[stateId as keyof typeof stateNames] || stateId,
    data: generateHistoricalData(stateId),
    color: stateColors[stateId as keyof typeof stateColors] || '#999'
  }));
};

// Get historical timeline data for a single state
export const getStateTimelineData = (stateId: string): StateTimelineData => {
  return {
    id: stateId,
    name: stateNames[stateId as keyof typeof stateNames] || stateId,
    data: generateHistoricalData(stateId),
    color: stateColors[stateId as keyof typeof stateColors] || '#999'
  };
};

// Get significant events that affected company growth
export const getSignificantEvents = () => {
  return [
    { date: '2022-03', title: 'COVID Impact', description: 'Economic effects of the pandemic slowed tech company growth' },
    { date: '2022-09', title: 'Tech Recovery', description: 'Strong recovery in the tech sector as digital demand increased' },
    { date: '2023-01', title: 'New Year Boost', description: 'Traditional new year business expansion and funding' },
    { date: '2023-06', title: 'Economic Slowdown', description: 'General economic slowdown affected tech hiring and expansion' },
    { date: '2023-11', title: 'End of Year Growth', description: 'Year-end budget allocation led to increased investments' },
    { date: '2024-02', title: 'Tech Boom', description: 'Major investments in AI and cloud technologies drove growth' },
  ];
};

// Get growth prediction for the next 6 months
export const getGrowthPrediction = (stateId: string): StateGrowthPoint[] => {
  // Get historical data
  const historicalData = generateHistoricalData(stateId, 12);

  // Latest values
  const lastPoint = historicalData[historicalData.length - 1];
  let lastCount = lastPoint.count;

  // Average growth rate from the last 6 months
  const recentGrowth = historicalData.slice(-6).reduce((sum, point) => sum + point.growth, 0) / 6;

  // Prediction points
  const prediction: StateGrowthPoint[] = [];
  const now = new Date();

  // Generate 6 months prediction
  for (let i = 1; i <= 6; i++) {
    const predictDate = format(subMonths(now, -i), 'yyyy-MM');

    // Add some randomness to prediction
    const randomFactor = (Math.random() * 0.4) - 0.2; // -0.2 to +0.2
    const predictedGrowth = recentGrowth + randomFactor;

    // Calculate predicted count
    const predictedCount = Math.round(lastCount * (1 + predictedGrowth / 100));

    // Add to prediction array
    prediction.push({
      date: predictDate,
      count: predictedCount,
      growth: Number(predictedGrowth.toFixed(1))
    });

    // Update last count for next month calculation
    lastCount = predictedCount;
  }

  return prediction;
};
