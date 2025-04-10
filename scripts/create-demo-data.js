const admin = require('firebase-admin');
const serviceAccount = require('../firebase-admin-key.json');

// 初始化 Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const firestore = admin.firestore();

// 创建 ABC 公司数据
async function createCompany() {
  try {
    // 首先检查公司是否已存在
    const companySnapshot = await firestore.collection('companies')
      .where('name', '==', 'ABC Company')
      .get();

    let companyId;
    let company;

    // 如果公司已存在
    if (!companySnapshot.empty) {
      companyId = companySnapshot.docs[0].id;
      company = companySnapshot.docs[0].data();
      console.log('ABC Company already exists with ID:', companyId);
    } else {
      // 创建新公司
      company = {
        name: 'ABC Company',
        abn: '12345678',
        shortDescription: 'A leading company in tech solutions',
        fullDescription: 'ABC Company provides innovative technology solutions to businesses worldwide. Our expertise spans across software development, cloud computing, and AI-driven analytics.',
        foundedYear: 2000,
        teamSize: '11-50',
        industry: 'Technology',
        state: 'New South Wales',
        location: 'Sydney, Australia',
        website: 'https://abccompany.example.com',
        email: 'info@abccompany.example.com',
        phone: '+61 2 1234 5678',
        languages: 'English, Chinese',
        social: {
          facebook: 'https://facebook.com/abccompany',
          linkedin: 'https://linkedin.com/company/abccompany',
          twitter: 'https://twitter.com/abccompany'
        },
        verified: true
      };

      const docRef = await firestore.collection('companies').add(company);
      companyId = docRef.id;
      console.log('Created ABC Company with ID:', companyId);
    }

    return { id: companyId, ...company };
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
}

// 创建办公室数据
async function createOffices(companyId) {
  try {
    // 首先检查是否已有办公室
    const officesSnapshot = await firestore.collection('offices')
      .where('companyId', '==', companyId)
      .get();

    // 如果已有办公室，删除它们
    const batch = firestore.batch();
    officesSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Deleted ${officesSnapshot.size} existing offices`);

    // 创建三个不同的办公室
    const offices = [
      {
        companyId,
        officeId: `${companyId}_SYDNEY_01`,
        city: 'Sydney',
        state: 'NSW',
        address: '123 George Street, Sydney CBD',
        postalCode: '2000',
        phone: '+61 2 9876 5432',
        email: 'sydney@abccompany.example.com',
        contactPerson: 'John Smith',
        isHeadquarter: true
      },
      {
        companyId,
        officeId: `${companyId}_MELBOURNE_01`,
        city: 'Melbourne',
        state: 'VIC',
        address: '456 Collins Street, Melbourne CBD',
        postalCode: '3000',
        phone: '+61 3 8765 4321',
        email: 'melbourne@abccompany.example.com',
        contactPerson: 'Sarah Johnson',
        isHeadquarter: false
      },
      {
        companyId,
        officeId: `${companyId}_BRISBANE_01`,
        city: 'Brisbane',
        state: 'QLD',
        address: '789 Queen Street, Brisbane CBD',
        postalCode: '4000',
        phone: '+61 7 7654 3210',
        email: 'brisbane@abccompany.example.com',
        contactPerson: 'Michael Wong',
        isHeadquarter: false
      }
    ];

    // 添加每个办公室
    for (const office of offices) {
      await firestore.collection('offices').doc(office.officeId).set(office);
      console.log(`Created office in ${office.city} with ID: ${office.officeId}`);
    }

    return offices;
  } catch (error) {
    console.error('Error creating offices:', error);
    throw error;
  }
}

// 运行主函数
async function main() {
  try {
    console.log('Starting to create demo data...');
    const company = await createCompany();
    const offices = await createOffices(company.id);
    console.log('Demo data creation completed successfully!');
    console.log('Company:', company);
    console.log('Offices:', offices);
    process.exit(0);
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

main(); 