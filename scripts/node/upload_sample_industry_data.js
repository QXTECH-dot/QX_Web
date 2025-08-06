const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-admin-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Sample industry visualization data
const sampleData = [
  {
    id: "industry_viz_2019_0001",
    year: 2019,
    industry: "Agriculture, Forestry and Fishing",
    state: "NSW",
    employee_category: "1-19 employees",
    entry_count: 450,
    exit_count: 120,
    net_change: 330,
    final_count: 2800,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "industry_viz_2019_0002",
    year: 2019,
    industry: "Manufacturing",
    state: "VIC",
    employee_category: "20-199 employees",
    entry_count: 320,
    exit_count: 80,
    net_change: 240,
    final_count: 3200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "industry_viz_2019_0003",
    year: 2019,
    industry: "Information Media and Telecommunications",
    state: "NSW",
    employee_category: "1-19 employees",
    entry_count: 680,
    exit_count: 150,
    net_change: 530,
    final_count: 4200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "industry_viz_2019_0004",
    year: 2019,
    industry: "Construction",
    state: "QLD",
    employee_category: "1-19 employees",
    entry_count: 890,
    exit_count: 200,
    net_change: 690,
    final_count: 5200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "industry_viz_2020_0001",
    year: 2020,
    industry: "Agriculture, Forestry and Fishing",
    state: "NSW",
    employee_category: "1-19 employees",
    entry_count: 420,
    exit_count: 180,
    net_change: 240,
    final_count: 3040,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "industry_viz_2020_0002",
    year: 2020,
    industry: "Manufacturing",
    state: "VIC",
    employee_category: "20-199 employees",
    entry_count: 280,
    exit_count: 120,
    net_change: 160,
    final_count: 3360,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "industry_viz_2020_0003",
    year: 2020,
    industry: "Information Media and Telecommunications",
    state: "NSW",
    employee_category: "1-19 employees",
    entry_count: 750,
    exit_count: 180,
    net_change: 570,
    final_count: 4770,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "industry_viz_2020_0004",
    year: 2020,
    industry: "Construction",
    state: "QLD",
    employee_category: "1-19 employees",
    entry_count: 650,
    exit_count: 320,
    net_change: 330,
    final_count: 5530,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "industry_viz_2021_0001",
    year: 2021,
    industry: "Agriculture, Forestry and Fishing",
    state: "NSW",
    employee_category: "1-19 employees",
    entry_count: 500,
    exit_count: 100,
    net_change: 400,
    final_count: 3440,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "industry_viz_2021_0002",
    year: 2021,
    industry: "Manufacturing",
    state: "VIC",
    employee_category: "20-199 employees",
    entry_count: 410,
    exit_count: 80,
    net_change: 330,
    final_count: 3690,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "industry_viz_2021_0003",
    year: 2021,
    industry: "Information Media and Telecommunications",
    state: "NSW",
    employee_category: "1-19 employees",
    entry_count: 820,
    exit_count: 120,
    net_change: 700,
    final_count: 5470,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "industry_viz_2021_0004",
    year: 2021,
    industry: "Construction",
    state: "QLD",
    employee_category: "1-19 employees",
    entry_count: 780,
    exit_count: 150,
    net_change: 630,
    final_count: 6160,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function uploadData() {
  try {
    console.log('Starting upload of industry visualization data...');
    
    const collectionRef = db.collection('industry_visualization_data');
    
    // Upload in batches
    const batch = db.batch();
    
    sampleData.forEach(record => {
      const docRef = collectionRef.doc(record.id);
      batch.set(docRef, record);
    });
    
    await batch.commit();
    
    console.log(`✅ Successfully uploaded ${sampleData.length} industry visualization records!`);
    console.log('Data structure:');
    console.log('- year: 2019-2021');
    console.log('- industry: Industry classification');
    console.log('- state: Australian state');
    console.log('- employee_category: Company size by employees');
    console.log('- entry_count: New companies');
    console.log('- exit_count: Companies that exited');
    console.log('- net_change: Net change in companies');
    console.log('- final_count: Total companies at year end');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
}

uploadData();