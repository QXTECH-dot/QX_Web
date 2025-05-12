import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

/**
 * GET 处理器 - 创建演示数据
 */
export async function GET() {
  try {
    // 创建ABC公司数据
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
        abn: '123456789',
        logo: 'https://via.placeholder.com/150',
        foundedYear: 2000,
        industry: 'Technology',
        teamSize: '11-50',
        website: 'https://abc-company.example.com',
        email: 'contact@abc-company.example.com',
        phone: '+61 2 1234 5678',
        languages: 'English,Chinese',
        shortDescription: 'A leading company in tech solutions',
        fullDescription: 'ABC Company provides innovative technology solutions to businesses worldwide. Our expertise spans across software development, cloud computing, and AI-driven analytics.',
        social: {
          linkedin: 'https://linkedin.com/company/abc-company',
          twitter: 'https://twitter.com/abc_company'
        },
        verified: 'true'
      };

      const docRef = await firestore.collection('companies').add(company);
      companyId = docRef.id;
      console.log('Created ABC Company with ID:', companyId);
    }

    // 创建办公室数据
    // 首先检查是否已有办公室
    const officesSnapshot = await firestore.collection('offices')
      .where('companyId', '==', companyId)
      .get();

    // 如果已有办公室，删除它们 (确保每次运行都更新为最新的演示数据)
    const batch = firestore.batch();
    officesSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Deleted ${officesSnapshot.size} existing offices for company ${companyId}`);

    // 创建四个不同的办公室
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
        isHeadquarter: true // Sydney is HQ
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
      },
      {
        companyId,
        officeId: `${companyId}_PERTH_01`, // 添加第四个办公室
        city: 'Perth',
        state: 'WA',
        address: '100 St Georges Terrace, Perth CBD',
        postalCode: '6000',
        phone: '+61 8 6543 2109',
        email: 'perth@abccompany.example.com',
        contactPerson: 'David Lee',
        isHeadquarter: false
      }
    ];

    console.log('Company ID being used for offices:', companyId);
    console.log('Office data to be created:', offices);

    // 添加每个办公室
    for (const office of offices) {
      await firestore.collection('offices').doc(office.officeId).set(office);
      console.log(`Created office in ${office.city} with ID: ${office.officeId}`);
    }

    // 验证数据是否正确存储和可检索
    console.log('Verifying offices can be retrieved...');
    const verifySnapshot = await firestore.collection('offices')
      .where('companyId', '==', companyId)
      .get();
    
    if (verifySnapshot.empty) {
      console.warn('WARNING: Could not retrieve offices after creation');
    } else {
      console.log(`Successfully verified ${verifySnapshot.size} offices can be retrieved`);
      verifySnapshot.forEach(doc => {
        console.log('Retrieved office:', doc.data());
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data created successfully',
      company: { id: companyId, ...company },
      offices
    }, { status: 200 });

  } catch (error) {
    console.error('Error creating demo data:', error);
    return NextResponse.json(
      { error: 'Failed to create demo data' },
      { status: 500 }
    );
  }
} 