import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 初始化Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../firebase-admin-key.json'), 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 本地数据
const companiesData = [
  {
    id: "startbit-it-solutions",
    name: "Startbit IT Solutions",
    verified: true,
    location: "Nottingham, United Kingdom",
    description: "Best Affordable Service Provider in eCommerce, Website, Software, and Mobile APP Development",
    logo: "https://ext.same-assets.com/3273624843/3218314263.png",
    teamSize: "50-249",
    languages: ["English", "Hindi", "Spanish"],
    services: ["Web Development", "E-Commerce Development", "Web Design", "Mobile App Development", "Software Development"],
    industries: ["Information Technology", "E-commerce"],
    abn: "67845123900",
    founded: 2015,
    employeeCount: "50-249",
    website: "https://www.startbit.com",
    email: "info@startbit.com",
    phone: "+44 115 932 8761"
  },
  {
    id: "incrementors-web-solutions",
    name: "Incrementors Web Solutions",
    verified: true,
    location: "Delhi, India",
    description: "Incrementors Web Solutions is a digital marketing agency that focuses on providing innovative solutions and creative strategies for helping businesses upgrade their customer base and foster growth.",
    logo: "https://ext.same-assets.com/3273624843/1822484193.png",
    teamSize: "50-100",
    languages: ["English", "Hindi"],
    services: ["SEO", "PPC", "Social Media Marketing", "Content Marketing"],
    industries: ["Digital Marketing", "IT Services"],
    abn: "78912345600",
    founded: 2012,
    employeeCount: "50-100",
    website: "https://www.incrementors.com",
    email: "info@incrementors.com"
  },
  {
    id: "bytset-solutions",
    name: "Bytset Solutions | Logo Design Company",
    verified: true,
    location: "Kerala, India",
    description: "Bytset Branding Solutions is the best logo design company Kerala, India and worldwide, specializing in creative and professional logo designs.",
    logo: "https://ext.same-assets.com/3273624843/3218314263.png",
    teamSize: "10-50",
    languages: ["English", "Malayalam", "Tamil"],
    services: ["Logo Design", "Brand Identity", "Graphic Design", "Web Design"],
    industries: ["Design", "Branding"],
    abn: "23456789000",
    founded: 2018,
    employeeCount: "10-50"
  },
  {
    id: "customerlabs",
    name: "CustomerLabs",
    verified: true,
    location: "Chennai, India",
    description: "CustomerLabs helps businesses collect, unify, and activate first-party data for better marketing, personalization, and privacy-compliant advertising.",
    logo: "https://ext.same-assets.com/3273624843/1192082462.png",
    teamSize: "50-200",
    languages: ["English"],
    services: ["Customer Data Platform", "Data Analytics", "Marketing Technology", "Personalization"],
    industries: ["Marketing Technology"],
    abn: "34567890100",
    founded: 2019,
    employeeCount: "50-200"
  },
  {
    id: "techcircle-innovations",
    name: "TechCircle Innovations",
    verified: true,
    location: "Sydney, Australia",
    description: "Leading software development company specializing in custom enterprise solutions, mobile applications, and cloud infrastructure.",
    logo: "https://ext.same-assets.com/3273624843/1822484193.png",
    teamSize: "100-500",
    languages: ["English"],
    services: ["Enterprise Software", "Cloud Solutions", "Mobile App Development", "DevOps Services"],
    industries: ["Software Development"],
    abn: "45612378900",
    founded: 2010,
    employeeCount: "100-500"
  },
  {
    id: "digitalsphere-consulting",
    name: "DigitalSphere Consulting",
    verified: true,
    location: "Melbourne, Australia",
    description: "Digital transformation consultancy helping businesses modernize their operations and create innovative digital experiences.",
    logo: "https://ext.same-assets.com/3273624843/3218314263.png",
    teamSize: "50-100",
    languages: ["English"],
    services: ["Digital Transformation", "Business Process Automation", "UX/UI Design", "IT Strategy"],
    industries: ["Business Consulting"],
    abn: "78901234500",
    founded: 2012,
    employeeCount: "50-100"
  },
  {
    id: "cyberguard-security",
    name: "CyberGuard Security",
    verified: true,
    location: "Brisbane, Australia",
    description: "Specializing in cybersecurity services, penetration testing, security audits, and compliance solutions for businesses of all sizes.",
    logo: "https://ext.same-assets.com/3273624843/1192082462.png",
    teamSize: "11-50",
    languages: ["English"],
    services: ["Cybersecurity Consulting", "Penetration Testing", "Security Audits", "Compliance Services"],
    industries: ["Cybersecurity"],
    abn: "89012345600",
    founded: 2016,
    employeeCount: "11-50"
  },
  {
    id: "dataminds-analytics",
    name: "DataMinds Analytics",
    verified: true,
    location: "Perth, Australia",
    description: "Data analytics and business intelligence firm helping companies derive actionable insights from their data to drive business growth.",
    logo: "https://ext.same-assets.com/3273624843/1822484193.png",
    teamSize: "11-50",
    languages: ["English"],
    services: ["Data Analytics", "Business Intelligence", "Predictive Modeling", "Data Visualization"],
    industries: ["Data Science"],
    abn: "90123456700",
    founded: 2014,
    employeeCount: "11-50"
  },
  {
    id: "cloudscale-solutions",
    name: "CloudScale Solutions",
    verified: true,
    location: "Auckland, New Zealand",
    description: "Cloud infrastructure specialists providing scalable solutions for businesses migrating to or optimizing their cloud environments.",
    logo: "https://ext.same-assets.com/3273624843/3218314263.png",
    teamSize: "11-50",
    languages: ["English"],
    services: ["Cloud Migration", "AWS Services", "Azure Solutions", "Cloud Optimization"],
    industries: ["Cloud Computing"],
    abn: "01234567800",
    founded: 2017,
    employeeCount: "11-50"
  },
  {
    id: "ecotech-innovations",
    name: "EcoTech Innovations",
    verified: true,
    location: "Wellington, New Zealand",
    description: "Developing sustainable technology solutions for businesses committed to reducing their environmental impact while improving efficiency.",
    logo: "https://ext.same-assets.com/3273624843/1192082462.png",
    teamSize: "1-10",
    languages: ["English"],
    services: ["Sustainable IT", "Green Technology", "Efficiency Audits", "Carbon Footprint Reduction"],
    industries: ["Green Technology"],
    abn: "12345678900",
    founded: 2019,
    employeeCount: "1-10"
  }
];

// 过滤undefined值的函数
function filterUndefined(obj) {
  const filtered = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      filtered[key] = value;
    }
  }
  return filtered;
}

async function uploadCompaniesData() {
  console.log('🚀 开始上传公司数据到Firebase...');
  
  try {
    const batch = db.batch();
    let uploadCount = 0;

    for (const company of companiesData) {
      // 创建公司文档引用
      const companyRef = db.collection('companies').doc(company.id);
      
      // 准备公司数据
      const companyData = filterUndefined({
        name: company.name,
        verified: company.verified || false,
        location: company.location,
        description: company.description,
        logo: company.logo,
        teamSize: company.teamSize,
        languages: company.languages || ['English'],
        services: company.services || [],
        industries: company.industries || [],
        abn: company.abn,
        founded: company.founded,
        employeeCount: company.employeeCount,
        website: company.website,
        email: company.email,
        phone: company.phone,
        // 添加一些额外字段
        state: getStateFromLocation(company.location),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      batch.set(companyRef, companyData);
      uploadCount++;
      
      console.log(`✅ 准备上传: ${company.name}`);
    }

    // 执行批量写入
    await batch.commit();
    console.log(`🎉 成功上传 ${uploadCount} 家公司到Firebase!`);
    
    // 验证上传结果
    const snapshot = await db.collection('companies').get();
    console.log(`📊 Firebase中现有 ${snapshot.size} 家公司`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ 上传失败:', error);
    process.exit(1);
  }
}

// 从位置信息提取州/地区
function getStateFromLocation(location) {
  if (!location) return 'Unknown';
  
  const locationLower = location.toLowerCase();
  
  if (locationLower.includes('sydney') || locationLower.includes('new south wales')) {
    return 'NSW';
  } else if (locationLower.includes('melbourne') || locationLower.includes('victoria')) {
    return 'VIC';
  } else if (locationLower.includes('brisbane') || locationLower.includes('queensland')) {
    return 'QLD';
  } else if (locationLower.includes('perth') || locationLower.includes('western australia')) {
    return 'WA';
  } else if (locationLower.includes('adelaide') || locationLower.includes('south australia')) {
    return 'SA';
  } else if (locationLower.includes('hobart') || locationLower.includes('tasmania')) {
    return 'TAS';
  } else if (locationLower.includes('darwin') || locationLower.includes('northern territory')) {
    return 'NT';
  } else if (locationLower.includes('canberra') || locationLower.includes('act')) {
    return 'ACT';
  } else if (locationLower.includes('india')) {
    return 'India';
  } else if (locationLower.includes('united kingdom') || locationLower.includes('uk')) {
    return 'UK';
  } else if (locationLower.includes('new zealand')) {
    return 'NZ';
  }
  
  return 'Other';
}

// 运行上传
uploadCompaniesData(); 