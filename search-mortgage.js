#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_JzocS0akP7yWAMCelO8l6at3RGxHMdU",
  authDomain: "qx-net-next-js.firebaseapp.com",
  projectId: "qx-net-next-js",
  storageBucket: "qx-net-next-js.firebasestorage.app",
  messagingSenderId: "412313045911",
  appId: "1:412313045911:web:cbb21106eb73a8fb1352d2",
  measurementId: "G-MER4ZNDV5H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function searchMortgageEntries() {
  console.log('🔍 Searching for mortgage-related entries in Firebase database...\n');
  
  try {
    // Search in industry_classifications collection
    console.log('📊 Searching industry_classifications collection...');
    const industriesRef = collection(db, 'industry_classifications');
    const industriesSnapshot = await getDocs(industriesRef);
    
    const mortgageIndustries = [];
    industriesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const docString = JSON.stringify(data).toLowerCase();
      
      if (docString.includes('mortgage') || docString.includes('broker')) {
        mortgageIndustries.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    console.log(`Found ${mortgageIndustries.length} industry classifications containing "mortgage" or "broker":`);
    mortgageIndustries.forEach((industry, index) => {
      console.log(`\n${index + 1}. ID: ${industry.id}`);
      console.log(`   Level: ${industry.level || 'N/A'}`);
      console.log(`   Popular Name: ${industry.popular_name || 'N/A'}`);
      console.log(`   Division Title: ${industry.division_title || 'N/A'}`);
      console.log(`   Subdivision Title: ${industry.subdivision_title || 'N/A'}`);
      console.log(`   ANZSIC Code: ${industry.anzsic_code || 'N/A'}`);
      console.log(`   Description: ${industry.description || 'N/A'}`);
    });
    
    // Search in industry_services collection
    console.log('\n\n🔧 Searching industry_services collection...');
    const servicesRef = collection(db, 'industry_services');
    const servicesSnapshot = await getDocs(servicesRef);
    
    const mortgageServices = [];
    servicesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const docString = JSON.stringify(data).toLowerCase();
      
      if (docString.includes('mortgage') || docString.includes('broker')) {
        mortgageServices.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    console.log(`Found ${mortgageServices.length} industry services containing "mortgage" or "broker":`);
    mortgageServices.forEach((service, index) => {
      console.log(`\n${index + 1}. ID: ${service.id}`);
      console.log(`   Service Name: ${service.service_name || 'N/A'}`);
      console.log(`   Industry ID: ${service.industry_id || 'N/A'}`);
      console.log(`   Category: ${service.category || 'N/A'}`);
      console.log(`   Description: ${service.description || 'N/A'}`);
      console.log(`   Keywords: ${service.keywords ? service.keywords.join(', ') : 'N/A'}`);
    });
    
    // Summary
    console.log('\n\n📋 SUMMARY:');
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Total mortgage-related industry classifications: ${mortgageIndustries.length}`);
    console.log(`Total mortgage-related industry services: ${mortgageServices.length}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    if (mortgageIndustries.length === 0 && mortgageServices.length === 0) {
      console.log('❌ No mortgage or broker related entries found in either collection.');
    } else {
      console.log('✅ Search completed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error searching Firebase database:', error);
    process.exit(1);
  }
}

// Run the search
searchMortgageEntries()
  .then(() => {
    console.log('\n🏁 Search completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });