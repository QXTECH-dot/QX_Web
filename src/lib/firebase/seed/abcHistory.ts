import { db } from '../config';
import { doc, setDoc } from 'firebase/firestore';

const abcHistoryData = [
  {
    historyId: "COMP_00001_HISTORY_01",
    companyId: "ABC",
    year: 2020,
    event: "ABC Company was founded in New York City with a vision to revolutionize the tech industry"
  },
  {
    historyId: "COMP_00001_HISTORY_02",
    companyId: "ABC",
    year: 2021,
    event: "Launched first product line and secured Series A funding of $10 million"
  },
  {
    historyId: "COMP_00001_HISTORY_03",
    companyId: "ABC",
    year: 2022,
    event: "Expanded operations to Europe and Asia, opening offices in London and Singapore"
  },
  {
    historyId: "COMP_00001_HISTORY_04",
    companyId: "ABC",
    year: 2023,
    event: "Achieved 1000+ enterprise clients worldwide and reached $50M in annual revenue"
  },
  {
    historyId: "COMP_00001_HISTORY_05",
    companyId: "ABC",
    year: 2024,
    event: "Launched AI-powered platform and received recognition as one of the fastest-growing tech companies"
  }
];

export async function seedABCHistory() {
  try {
    for (const history of abcHistoryData) {
      await setDoc(doc(db, 'history', history.historyId), history);
      console.log(`Created history record: ${history.historyId}`);
    }
    console.log('ABC company history seeded successfully');
  } catch (error) {
    console.error('Error seeding ABC company history:', error);
    throw error;
  }
} 