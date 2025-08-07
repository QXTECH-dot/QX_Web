import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_JzocS0akP7yWAMCelO8l6at3RGxHMdU",
  authDomain: "qx-net-next-js.firebaseapp.com",
  projectId: "qx-net-next-js",
  storageBucket: "qx-net-next-js.firebasestorage.app",
  messagingSenderId: "412313045911",
  appId: "1:412313045911:web:cbb21106eb73a8fb1352d2",
  measurementId: "G-MER4ZNDV5H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testMortgageSearch() {
  console.log('🔍 Testing mortgage search with new logic...');
  
  try {
    const query = 'mortgage';
    
    // Fetch industry classifications and services data
    const [industriesSnapshot, servicesSnapshot] = await Promise.all([
      getDocs(collection(db, 'industry_classifications')),
      getDocs(collection(db, 'industry_services'))
    ]);

    const suggestions = [];

    // Process industry classifications data - only from specified fields
    industriesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      
      // Check division_title
      if (data.division_title) {
        const divisionTitle = data.division_title.toLowerCase();
        if (divisionTitle.includes(query)) {
          suggestions.push({
            id: `${doc.id}_division`,
            text: data.division_title,
            type: 'industry',
            level: 1,
            popular_code: data.popular_code
          });
        }
      }
      
      // Check subdivision_title
      if (data.subdivision_title) {
        const subdivisionTitle = data.subdivision_title.toLowerCase();
        if (subdivisionTitle.includes(query)) {
          suggestions.push({
            id: `${doc.id}_subdivision`,
            text: data.subdivision_title,
            type: 'industry',
            level: 2,
            popular_code: data.popular_code
          });
        }
      }
      
      // Check popular_name
      if (data.popular_name) {
        const popularName = data.popular_name.toLowerCase();
        if (popularName.includes(query)) {
          suggestions.push({
            id: `${doc.id}_popular`,
            text: data.popular_name,
            type: 'industry',
            level: 3,
            popular_code: data.popular_code
          });
        }
      }
    });

    // Process services data - only service_name field
    servicesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.service_name) {
        const serviceName = data.service_name.toLowerCase();
        if (serviceName.includes(query)) {
          suggestions.push({
            id: doc.id,
            text: data.service_name,
            type: 'service',
            popular_code: data.popular_code
          });
        }
      }
    });

    console.log('✅ Found suggestions:', suggestions.length);
    console.log('Suggestions:', suggestions.map(s => `${s.text} (${s.type}, level: ${s.level || 'N/A'})`));
    
    return suggestions;

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testMortgageSearch().then(() => {
  console.log('Test completed');
  process.exit(0);
});