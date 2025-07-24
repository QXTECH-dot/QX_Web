#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { writeFileSync } from 'fs';

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

async function detailedMortgageSearch() {
  console.log('🔍 Performing detailed search for mortgage-related entries...\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    searchTerms: ['mortgage', 'broker'],
    industries: [],
    services: [],
    summary: {}
  };
  
  try {
    // Search in industry_classifications collection
    console.log('📊 Analyzing industry_classifications collection...');
    const industriesRef = collection(db, 'industry_classifications');
    const industriesSnapshot = await getDocs(industriesRef);
    
    const mortgageIndustries = [];
    industriesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const docString = JSON.stringify(data).toLowerCase();
      
      if (docString.includes('mortgage') || docString.includes('broker')) {
        const industry = {
          id: doc.id,
          ...data,
          matchedTerms: []
        };
        
        // Identify which terms matched
        if (docString.includes('mortgage')) industry.matchedTerms.push('mortgage');
        if (docString.includes('broker')) industry.matchedTerms.push('broker');
        
        mortgageIndustries.push(industry);
      }
    });
    
    results.industries = mortgageIndustries;
    
    console.log(`✅ Found ${mortgageIndustries.length} relevant industry classifications`);
    mortgageIndustries.forEach((industry, index) => {
      console.log(`\n   ${index + 1}. ${industry.popular_name || 'Unnamed'} (${industry.id})`);
      console.log(`      Level: ${industry.level || 'N/A'} | Division: ${industry.division_title || 'N/A'}`);
      console.log(`      Matched terms: ${industry.matchedTerms.join(', ')}`);
    });
    
    // Search in industry_services collection
    console.log('\n\n🔧 Analyzing industry_services collection...');
    const servicesRef = collection(db, 'industry_services');
    const servicesSnapshot = await getDocs(servicesRef);
    
    const mortgageServices = [];
    servicesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const docString = JSON.stringify(data).toLowerCase();
      
      if (docString.includes('mortgage') || docString.includes('broker')) {
        const service = {
          id: doc.id,
          ...data,
          matchedTerms: []
        };
        
        // Identify which terms matched
        if (docString.includes('mortgage')) service.matchedTerms.push('mortgage');
        if (docString.includes('broker')) service.matchedTerms.push('broker');
        
        mortgageServices.push(service);
      }
    });
    
    results.services = mortgageServices;
    
    console.log(`✅ Found ${mortgageServices.length} relevant industry services`);
    
    // Group services by category
    const servicesByCategory = {};
    mortgageServices.forEach(service => {
      const category = service.category || 'Uncategorized';
      if (!servicesByCategory[category]) {
        servicesByCategory[category] = [];
      }
      servicesByCategory[category].push(service);
    });
    
    Object.entries(servicesByCategory).forEach(([category, services]) => {
      console.log(`\n   📁 ${category} (${services.length} services):`);
      services.forEach((service, index) => {
        console.log(`      ${index + 1}. ${service.service_name || 'Unnamed'} (${service.id})`);
        console.log(`         Matched terms: ${service.matchedTerms.join(', ')}`);
        if (service.industry_id) console.log(`         Industry ID: ${service.industry_id}`);
      });
    });
    
    // Create summary
    results.summary = {
      totalIndustries: mortgageIndustries.length,
      totalServices: mortgageServices.length,
      industriesByLevel: {},
      servicesByCategory: {}
    };
    
    // Group industries by level
    mortgageIndustries.forEach(industry => {
      const level = industry.level || 'Unknown';
      if (!results.summary.industriesByLevel[level]) {
        results.summary.industriesByLevel[level] = 0;
      }
      results.summary.industriesByLevel[level]++;
    });
    
    // Count services by category
    Object.entries(servicesByCategory).forEach(([category, services]) => {
      results.summary.servicesByCategory[category] = services.length;
    });
    
    // Save results to file
    const filename = `mortgage-search-results-${new Date().toISOString().slice(0, 10)}.json`;
    writeFileSync(filename, JSON.stringify(results, null, 2));
    
    // Display final summary
    console.log('\n\n📊 DETAILED SUMMARY');
    console.log('═'.repeat(80));
    console.log(`🕒 Search completed at: ${results.timestamp}`);
    console.log(`🏢 Industry Classifications: ${results.summary.totalIndustries}`);
    console.log(`🔧 Industry Services: ${results.summary.totalServices}`);
    
    if (Object.keys(results.summary.industriesByLevel).length > 0) {
      console.log('\n📈 Industries by Level:');
      Object.entries(results.summary.industriesByLevel).forEach(([level, count]) => {
        console.log(`   Level ${level}: ${count} entries`);
      });
    }
    
    if (Object.keys(results.summary.servicesByCategory).length > 0) {
      console.log('\n📁 Services by Category:');
      Object.entries(results.summary.servicesByCategory).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} services`);
      });
    }
    
    console.log(`\n💾 Detailed results saved to: ${filename}`);
    console.log('═'.repeat(80));
    
    // Specific mortgage broker analysis
    const brokerIndustries = mortgageIndustries.filter(i => 
      i.matchedTerms.includes('broker') || 
      (i.popular_name && i.popular_name.toLowerCase().includes('broker'))
    );
    
    const brokerServices = mortgageServices.filter(s => 
      s.matchedTerms.includes('broker') || 
      (s.service_name && s.service_name.toLowerCase().includes('broker'))
    );
    
    if (brokerIndustries.length > 0 || brokerServices.length > 0) {
      console.log('\n🎯 BROKER-SPECIFIC ANALYSIS');
      console.log('─'.repeat(40));
      console.log(`Broker Industries: ${brokerIndustries.length}`);
      brokerIndustries.forEach(industry => {
        console.log(`  • ${industry.popular_name} (${industry.id})`);
      });
      
      console.log(`\nBroker Services: ${brokerServices.length}`);
      brokerServices.forEach(service => {
        console.log(`  • ${service.service_name} (${service.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error during detailed search:', error);
    process.exit(1);
  }
}

// Run the detailed search
detailedMortgageSearch()
  .then(() => {
    console.log('\n🏁 Detailed search completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });