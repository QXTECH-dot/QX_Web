"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Globe, Mail, MapPin, Phone, Award, Facebook, Twitter, Linkedin, Instagram, ExternalLink, Star, Calendar, Users, Clock, Building, Building2, History, Youtube, BookOpen, User } from "lucide-react";
import Link from "next/link";
import { ProfileCompareButton } from "@/components/comparison/ProfileCompareButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Company, Office } from '@/types/company';
import { getDoc, doc, collection, query, where, getDocs, getDoc as getFirebaseDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Service } from '@/types/service';

// Mock company data - in a real app this would come from an API
const companyData = {
  bytsetSolutions: {
    id: "bytset-solutions",
    name: "Bytset Solutions | Logo Design Company",
    verified: true,
    abn: "51 824 753 556",
    location: "Kerala, India",
    description: "Bytset Branding Solutions is the best logo design company Kerala, India and worldwide, specializing in creative and professional logo designs.",
    longDescription: "We are a graphic design company that specializes in creating custom logo designs for businesses of all sizes. Our team of experienced designers works closely with clients to understand their brand identity and create logos that reflect their values and vision. From simple lettermarks to complex illustrations, we can create a logo that perfectly represents your brand.",
    logo: "https://ext.same-assets.com/3273624843/3218314263.png",
    website: "https://www.bytset.com",
    email: "info@bytset.com",
    phone: "+91 9876543210",
    founded: 2018,
    employeeCount: "10-50",
    services: ["Logo Design", "Brand Identity", "Graphic Design", "Package Design", "Web Design"],
    languages: ["English", "Malayalam", "Hindi"],
    industries: ["Design", "Branding"],
    history: [
      { year: 2018, event: "Founded in Kerala, India with just 3 designers" },
      { year: 2019, event: "Expanded services to include brand identity design" },
      { year: 2020, event: "Reached 50+ clients milestone" },
      { year: 2021, event: "Expanded team to 15 designers" },
      { year: 2022, event: "Opened a second office in Bangalore" },
      { year: 2023, event: "Started international operations with clients from 10+ countries" }
    ],
    portfolio: [
      {
        title: "Tech Startup Rebrand",
        image: "https://ext.same-assets.com/3273624843/3218314263.png",
        description: "Complete rebranding for a tech startup including logo, website, and marketing materials."
      },
      {
        title: "Restaurant Brand Identity",
        image: "https://ext.same-assets.com/3273624843/3218314263.png",
        description: "Brand identity design for a fine dining restaurant chain."
      },
      {
        title: "E-commerce Logo Design",
        image: "https://ext.same-assets.com/3273624843/3218314263.png",
        description: "Modern logo design for an e-commerce platform."
      }
    ],
    reviews: [
      {
        author: "John Smith",
        company: "TechStartup Inc.",
        rating: 5,
        text: "Bytset Solutions delivered an outstanding logo for our company. Their team was professional, responsive, and creative throughout the entire process. Highly recommended!",
        date: "2023-08-15"
      },
      {
        author: "Emily Johnson",
        company: "Fresh Eats Restaurant",
        rating: 4,
        text: "Great experience working with Bytset. They understood our vision and translated it into a beautiful brand identity. Minor revisions were needed but overall very satisfied.",
        date: "2023-06-22"
      }
    ],
    social: {
      facebook: "https://facebook.com/bytset",
      twitter: "https://twitter.com/bytset",
      linkedin: "https://linkedin.com/company/bytset",
      instagram: "https://instagram.com/bytset"
    }
  },
  incrementors: {
    id: "incrementors-web-solutions",
    name: "Incrementors Web Solutions",
    verified: true,
    abn: "51 824 753 556",
    location: "Delhi, India",
    description: "Incrementors Web Solutions is a digital marketing agency that focuses on providing innovative solutions and creative strategies for helping businesses upgrade their customer base and foster growth.",
    longDescription: "Our focus on quality and innovation helps our clients stay ahead in the ever-evolving digital landscape. We provide end-to-end solutions for all your online marketing needs while ensuring complete transparency and effective communication throughout the project. Our team of experienced professionals specializes in SEO, PPC, content marketing, social media marketing, web design, and development. We work closely with our clients to understand their business goals and create customized strategies that deliver measurable results.",
    logo: "https://ext.same-assets.com/3273624843/1822484193.png",
    website: "https://www.incrementors.com",
    email: "info@incrementors.com",
    phone: "+91 9876543210",
    founded: 2012,
    employeeCount: "50-100",
    languages: ["English", "Hindi", "Punjabi"],
    minimumProjectSize: "$1,000+",
    avgProjectLength: "1-3 months",
    offices: [
      {
        city: "Delhi",
        address: "123 Business Park, Sector 62, Noida, Delhi NCR"
      },
      {
        city: "Mumbai",
        address: "456 Tech Hub, Andheri East, Mumbai, Maharashtra"
      },
      {
        city: "Bangalore",
        address: "789 Innovation Center, Whitefield, Bangalore, Karnataka"
      }
    ],
    services: [
      "Search Engine Optimization (SEO)",
      "Pay Per Click (PPC)",
      "Social Media Marketing",
      "Content Marketing",
      "Web Design",
      "Web Development",
      "Digital Marketing Strategy",
      "Conversion Rate Optimization"
    ],
    history: [
      { year: 2012, event: "Founded in Delhi with a team of 5 SEO specialists" },
      { year: 2014, event: "Expanded services to include social media marketing" },
      { year: 2015, event: "Reached first 100 clients milestone" },
      { year: 2016, event: "Added PPC and paid advertising services" },
      { year: 2017, event: "Expanded team to 50+ employees" },
      { year: 2018, event: "Opened branch office in Mumbai" },
      { year: 2020, event: "Launched web development department" },
      { year: 2021, event: "Reached 500+ clients milestone" },
      { year: 2022, event: "Started international operations" },
      { year: 2023, event: "Established partnerships with Google and Facebook as official marketing partners" }
    ],
    industries: ["Digital Marketing", "IT Services", "Content Creation"],
    portfolio: [
      {
        title: "E-commerce SEO Optimization",
        image: "https://ext.same-assets.com/3273624843/1822484193.png",
        description: "Increased organic traffic by 150% and conversion rate by 45% for an e-commerce client through comprehensive SEO strategies."
      },
      {
        title: "Healthcare Digital Marketing Campaign",
        image: "https://ext.same-assets.com/3273624843/1822484193.png",
        description: "Developed and executed a multi-channel digital marketing campaign for a healthcare provider, resulting in a 78% increase in qualified leads."
      },
      {
        title: "Real Estate Website Redesign",
        image: "https://ext.same-assets.com/3273624843/1822484193.png",
        description: "Completely redesigned a real estate company's website, improving user experience and increasing lead generation by 60%."
      }
    ],
    reviews: [
      {
        author: "Michael Roberts",
        company: "GreenLeaf E-commerce",
        rating: 5,
        text: "Incrementors helped us improve our search engine rankings significantly. Their team was professional, knowledgeable, and delivered results beyond our expectations. The transparent reporting made it easy to track progress and understand the value of their services.",
        date: "2023-11-10"
      },
      {
        author: "Sarah Johnson",
        company: "MediCare Solutions",
        rating: 5,
        text: "We've been working with Incrementors for our digital marketing needs for over a year now, and the results have been phenomenal. Their team is responsive, creative, and truly understands our business goals. Highly recommended!",
        date: "2023-09-05"
      },
      {
        author: "David Chen",
        company: "TechFusion Inc.",
        rating: 4,
        text: "Incrementors delivered great results for our PPC campaigns. They are strategic thinkers who focus on ROI rather than just vanity metrics. The only reason for 4 stars instead of 5 is that sometimes communication could be a bit slow during peak periods.",
        date: "2023-07-22"
      }
    ],
    social: {
      facebook: "https://facebook.com/incrementors",
      twitter: "https://twitter.com/incrementors",
      linkedin: "https://linkedin.com/company/incrementors",
      instagram: "https://instagram.com/incrementors"
    },
    certifications: [
      "Google Partner",
      "HubSpot Certified",
      "Facebook Blueprint Certified",
      "Bing Ads Accredited Professional"
    ],
    clients: [
      { name: "E-Shop Global", logo: "https://ext.same-assets.com/3273624843/1822484193.png" },
      { name: "HealthPlus", logo: "https://ext.same-assets.com/3273624843/1822484193.png" },
      { name: "TechNova", logo: "https://ext.same-assets.com/3273624843/1822484193.png" },
      { name: "HomeRealty", logo: "https://ext.same-assets.com/3273624843/1822484193.png" }
    ]
  },
  customerlabs: {
    id: "customerlabs",
    name: "CustomerLabs",
    verified: true,
    abn: "51 824 753 556",
    location: "Chennai, India",
    description: "CustomerLabs helps businesses collect, unify, and activate first-party data for better marketing, personalization, and privacy-compliant advertising.",
    longDescription: "CustomerLabs is a Customer Data Platform (CDP) that helps businesses unify their customer data from various sources, create unified customer profiles, and activate this data for marketing and personalization. Our platform is designed to be easy to use, flexible, and compliant with privacy regulations. We help businesses of all sizes make the most of their first-party data in a privacy-first world.",
    logo: "https://ext.same-assets.com/3273624843/1192082462.png",
    website: "https://www.customerlabs.com",
    email: "hello@customerlabs.com",
    phone: "+91 9876543211",
    founded: 2019,
    employeeCount: "50-200",
    languages: ["English", "Tamil", "Telugu"],
    services: ["Customer Data Platform", "Data Analytics", "Marketing Technology", "Personalization", "Privacy Compliance"],
    history: [
      { year: 2019, event: "Founded in Chennai, India" },
      { year: 2020, event: "Secured seed funding of $2 million" },
      { year: 2021, event: "Expanded team to 50 employees" },
      { year: 2022, event: "Released CDP 2.0 platform with enhanced AI capabilities" },
      { year: 2023, event: "Reached 200+ enterprise clients globally" },
      { year: 2024, event: "Opened new offices in Singapore and Australia" }
    ],
    industries: ["Marketing Technology", "Data Analytics"],
    portfolio: [
      {
        title: "E-commerce Data Unification",
        image: "https://ext.same-assets.com/3273624843/1192082462.png",
        description: "Helped a major e-commerce retailer unify customer data across 12 different platforms."
      },
      {
        title: "SaaS Customer Journey Mapping",
        image: "https://ext.same-assets.com/3273624843/1192082462.png",
        description: "Implemented end-to-end customer journey mapping for a B2B SaaS company."
      }
    ],
    reviews: [
      {
        author: "Sarah Wilson",
        company: "ShopRight E-commerce",
        rating: 5,
        text: "CustomerLabs transformed our marketing strategy by giving us a complete view of our customers. Implementation was smooth and the results were immediate.",
        date: "2023-09-10"
      }
    ],
    social: {
      facebook: "https://facebook.com/customerlabs",
      twitter: "https://twitter.com/customerlabs",
      linkedin: "https://linkedin.com/company/customerlabs",
      instagram: "https://instagram.com/customerlabs"
    }
  }
};

interface CompanyProfileProps {
  id: string;
}

// 添加类型定义，使组件更类型安全
interface ServiceType {
  name: string;
  description: string;
}

interface ReviewType {
  author: string;
  company?: string;
  rating: number;
  text: string;
  date: string;
}

interface OfficeType {
  city: string;
  address: string;
  state?: string;
  isHeadquarters?: boolean;
}

interface HistoryEventType {
  year: number;
  event: string;
}

function useServiceData(companyId: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!db) {
          console.error('Firebase database not initialized');
          setError('Database connection error');
          return;
        }
        
        if (!companyId) {
          console.error('Company ID is empty');
          setError('Invalid company ID');
          return;
        }
        
        console.log('Starting to fetch services data, company ID:', companyId);
        const servicesCol = collection(db, 'services');
        const q = query(servicesCol, where('companyId', '==', companyId));
        console.log('Query conditions:', q);
        
        const querySnapshot = await getDocs(q);
        console.log('Query results:', querySnapshot);
        console.log('Found services:', querySnapshot.size);
        
        if (querySnapshot.empty) {
          console.log('No services data found');
          setServices([]);
          return;
        }
        
        const servicesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Single service data:', data);
          return {
            serviceId: doc.id,
            companyId: data.companyId,
            title: data.title,
            description: data.description
          };
        });
        
        console.log('Processed services data:', servicesData);
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services data:', error);
        if (error instanceof Error) {
          setError(error.message);
          console.error('Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId]);

  return { services, loading, error };
}

export function CompanyProfile({ id }: CompanyProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<any>(null);
  const [offices, setOffices] = useState<Office[]>([]);
  const [officesLoading, setOfficesLoading] = useState(true);
  const [selectedOffice, setSelectedOffice] = useState<any>(null);
  const [history, setHistory] = useState<HistoryEventType[]>([]);
  
  console.log('CompanyProfile component received ID:', id);
  
  // 引用用于滚动的元素
  const servicesRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  
  // 表单状态
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  const { services, loading: serviceLoading, error: serviceError } = useServiceData(id);
  console.log('Services data from useServiceData:', services);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!db) {
          console.error('Firebase database not initialized');
          return;
        }

        const companyRef = doc(db, 'companies', id);
        const companySnap = await getDoc(companyRef);

        if (companySnap.exists()) {
          const data = companySnap.data() as Company;
          setCompany({
            ...data,
            id: companySnap.id,
            industry: Array.isArray(data.industry) ? data.industry : [data.industry || 'Other']
          });
        } else {
          setError('Company not found');
        }
      } catch (err) {
        console.error('Error fetching company details:', err);
        setError('Failed to fetch company details');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  // Get office data
  useEffect(() => {
    const fetchOffices = async () => {
      try {
        setOfficesLoading(true);
        console.log('Fetching offices for company ID:', id);
        const response = await fetch(`/api/companies/${id}/offices`);
        
        if (!response.ok) {
          console.error('Response not OK:', await response.text());
          throw new Error('Failed to get office data');
        }
        
        const data = await response.json();
        console.log('Office data received:', data);
        
        if (data.offices) {
          console.log('Setting offices:', data.offices);
          // 对办公室进行排序，总部放在第一位
          const sortedOffices = [...data.offices].sort((a, b) => {
            // 如果a是总部，a排在前面
            if (a.isHeadquarter && !b.isHeadquarter) return -1;
            // 如果b是总部，b排在前面
            if (!a.isHeadquarter && b.isHeadquarter) return 1;
            // 否则按城市名称排序
            return a.city.localeCompare(b.city);
          });
          setOffices(sortedOffices);
          
          // 默认选择排序后的第一个办公室（通常应该是总部）
          if (sortedOffices.length > 0) {
            setSelectedOffice(sortedOffices[0]);
          }
        } else {
          console.warn('No offices array in response data:', data);
        }
      } catch (err) {
        console.error('Error fetching office data:', err);
      } finally {
        setOfficesLoading(false);
      }
    };

    if (id) {
      fetchOffices();
    }
  }, [id]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!db) {
        console.error('Firestore not initialized');
        return;
      }
      
      try {
        const historyRef = collection(db, 'history');
        const q = query(historyRef, where('companyId', '==', 'ABC'));
        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map(doc => ({
          year: doc.data().year,
          event: doc.data().event
        }));
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [id]);

  // Handle office click
  const handleOfficeClick = (office: any) => {
    setSelectedOffice(office);
  };

  // Scroll functions remain unchanged
  const scrollToServices = () => {
    setActiveTab("services");
    // Use setTimeout to ensure scrolling happens after tab switch
    setTimeout(() => {
      const tabsNav = document.querySelector('.border-b.mb-8');
      if (tabsNav) {
        // Get navigation bar position
        const navRect = tabsNav.getBoundingClientRect();
        // Calculate scroll position, minus some top margin (e.g. 100px) to ensure the nav bar is visible
        const scrollPosition = window.pageYOffset + navRect.top - 100;
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };
  
  const scrollToPortfolio = () => {
    setActiveTab("portfolio");
    if (portfolioRef.current) {
      const offset = 100; // 向上偏移 100px
      const elementPosition = portfolioRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  
  const scrollToReviews = () => {
    setActiveTab("reviews");
    if (reviewsRef.current) {
      const offset = 100; // 向上偏移 100px
      const elementPosition = reviewsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const scrollToContact = () => {
    setActiveTab("contact");
    if (contactRef.current) {
      const offset = 100; // 向上偏移 100px
      const elementPosition = contactRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // 表单提交保持不变
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      // 这里应该是您的实际API端点
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...{ name, email, message },
          companyEmail: company?.email,
          companyName: company?.name,
          defaultEmail: 'info@qixin.com.au'
        }),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  // 在服务部分的渲染逻辑中
  const renderServices = () => {
    if (serviceLoading) {
      return <div className="text-center py-4">Loading services information...</div>;
    }

    if (serviceError) {
      return <div className="text-center py-4 text-red-500">Error loading services: {serviceError}</div>;
    }

    if (!services || services.length === 0) {
      return <div className="text-center py-4">No services information available for this company.</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.serviceId} className="p-4">
            <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </Card>
        ))}
      </div>
    );
  };

  // Handle loading state and errors
  if (loading) {
    return (
      <div className="bg-background py-10">
        <div className="container">
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm h-40 flex items-center justify-center">
            <p className="text-lg text-muted-foreground">Loading company details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="bg-background py-10">
        <div className="container">
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-muted-foreground">{error || 'Company details not found'}</p>
            <Button className="mt-4" asChild>
              <Link href="/companies">Back to companies list</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background py-10">
      <div className="container">
        {/* Company Header */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-center mb-2">
                <h1 className="text-2xl md:text-3xl font-bold mr-2">{company.name}</h1>
                {company.verified && (
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs flex items-center">
                    <Check className="h-3 w-3 mr-1" /> Verified
                  </span>
                )}
              </div>
              <p className="text-muted-foreground flex items-center mb-2">
                <span className="text-muted-foreground mr-2">ABN: {company.abn}</span>
              </p>
              <p className="text-muted-foreground flex items-start mb-2">
                <MapPin className="h-4 w-4 mr-1 mt-1" /> 
                <span>
                  {offices && offices.length > 0 ? (
                    offices.map((office: any, index: number) => (
                      <span key={office.officeId}>
                        {office.city} {office.state}
                        {index < offices.length - 1 ? ', ' : ''}
                      </span>
                    ))
                  ) : company.location ? (
                    company.location
                  ) : (
                    'Location not specified'
                  )}
                </span>
              </p>

              {company.industries && company.industries.length > 0 && (
                <p className="text-muted-foreground flex items-center mb-4">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span>{company.industries[0]}</span>
                </p>
              )}

              <div className="mb-6">
                <p className="text-gray-600">{company.shortDescription || company.description}</p>
              </div>

              {/* Only render service tags if services exist */}
              {company.services && company.services.length > 0 && (
              <div className="flex flex-wrap gap-2">
                  {company.services.slice(0, 6).map((service: string, index: number) => (
                  <Link
                    key={index}
                    href={`/companies?service=${encodeURIComponent(service)}`}
                    className="bg-gray-100 hover:bg-gray-200 text-muted-foreground px-3 py-1 rounded-full text-xs transition-colors"
                  >
                    {service}
                  </Link>
                ))}
                {company.services.length > 6 && (
                  <button
                    onClick={scrollToServices}
                    className="bg-gray-100 hover:bg-gray-200 text-muted-foreground px-3 py-1 rounded-full text-xs transition-colors cursor-pointer"
                  >
                    +{company.services.length - 6} more
                  </button>
                )}
              </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                size="lg" 
                className="bg-primary text-white w-full md:w-auto hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={scrollToContact}
              >
                Get In Touch
              </Button>
              {company.website && (
                <Link
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="visit-website-button flex items-center gap-2 px-4 py-2 rounded"
                >
                  <Globe className="h-5 w-5" />
                  Visit Website
              </Link>
              )}
            </div>
          </div>
        </div>

        {/* Company Comparison */}
        <div>
        <ProfileCompareButton company={company} />
        </div>

        {/* Key Facts Bar */}
          <div className="bg-white rounded-lg p-4 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {company.languages && (
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-xs text-muted-foreground">Languages</p>
                  <p className="font-medium">
                    {Array.isArray(company.languages) 
                      ? company.languages.join(', ') 
                      : typeof company.languages === 'string' 
                        ? company.languages 
                        : 'N/A'}
                  </p>
                </div>
              </div>
            )}
            {(company.employeeCount || company.teamSize) && (
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-xs text-muted-foreground">Team Size</p>
                  <p className="font-medium">{company.employeeCount || company.teamSize}</p>
                </div>
              </div>
            )}
            {(company.founded || company.foundedYear) && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-xs text-muted-foreground">Founded</p>
                  <p className="font-medium">{company.founded || company.foundedYear}</p>
                </div>
              </div>
            )}
            </div>
          </div>

        {/* Tabs Navigation */}
        <div className="border-b mb-8" ref={contactRef}>
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === "services"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("services")}
            >
              Services
            </button>
            <button
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Company History
            </button>
            <button
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === "reviews"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews {company.reviews && `(${company.reviews.length})`}
            </button>
            <button
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === "contact"
                  ? "border-primary text-primary bg-primary/20 rounded-t-lg font-semibold"
                  : "border-transparent text-primary bg-primary/10 hover:bg-primary/15 rounded-t-lg"
              }`}
              onClick={() => setActiveTab("contact")}
            >
              Get in Touch
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                {/* About Section */}
                <div>
                <h2 className="text-xl font-bold mb-4">About {company.name}</h2>
                  <p className="text-muted-foreground mb-6 whitespace-pre-line">
                    {company.longDescription || company.fullDescription}
                  </p>
                        </div>

                {/* Offices Section */}
                {offices.length > 0 ? (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Office Locations</h2>
                    <div className="space-y-4">
                      {offices.map((office: any) => (
                        <div 
                          key={office.officeId} 
                          className={`flex items-start p-3 rounded-md cursor-pointer transition-colors ${selectedOffice?.officeId === office.officeId ? 'bg-primary/10' : 'hover:bg-gray-100'}`}
                          onClick={() => handleOfficeClick(office)}
                        >
                          <MapPin className={`h-5 w-5 mt-1 mr-3 flex-shrink-0 ${selectedOffice?.officeId === office.officeId ? 'text-primary' : 'text-gray-400'}`} />
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {office.city} Office
                              {office.isHeadquarter && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  Headquarters
                                </span>
                              )}
                            </h3>
                            <p className="text-gray-600">{office.address}</p>
                            {office.postalCode && (
                              <p className="text-gray-600">{office.state}, {office.postalCode}</p>
                            )}
                    </div>
                        </div>
                      ))}
                    </div>
                    </div>
                ) : officesLoading ? (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Office Locations</h2>
                    <p className="text-muted-foreground">Loading office information...</p>
                  </div>
                ) : null}
              </div>

              {/* Contact Info */}
              <div>
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Website</p>
                        {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {company.website.replace('https://', '')}
                        </a>
                        ) : (
                          <span className="text-muted-foreground">Not provided</span>
                        )}
                      </div>
                    </div>
                    
                    {selectedOffice && (
                      <>
                        {selectedOffice.contactPerson && (
                    <div className="flex items-start">
                            <User className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                              <p className="text-sm text-muted-foreground mb-1">Contact Person</p>
                              <span className="text-gray-900">
                                {selectedOffice.contactPerson}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {selectedOffice.phone ? (
                          <div className="flex items-start">
                            <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Phone</p>
                              <a
                                href={`tel:${selectedOffice.phone}`}
                          className="text-primary hover:underline"
                        >
                                {selectedOffice.phone}
                        </a>
                      </div>
                    </div>
                        ) : company.phone ? (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phone</p>
                        <a
                          href={`tel:${company.phone}`}
                          className="text-primary hover:underline"
                        >
                          {company.phone}
                        </a>
                      </div>
                    </div>
                        ) : (
                          <div className="flex items-start">
                            <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Phone</p>
                              <span className="text-muted-foreground">Not provided</span>
                            </div>
                          </div>
                        )}
                        
                        {selectedOffice.email ? (
                          <div className="flex items-start">
                            <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Email</p>
                              <a
                                href={`mailto:${selectedOffice.email}`}
                                className="text-primary hover:underline"
                              >
                                {selectedOffice.email}
                              </a>
                            </div>
                          </div>
                        ) : company.email ? (
                          <div className="flex items-start">
                            <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Email</p>
                              <a
                                href={`mailto:${company.email}`}
                                className="text-primary hover:underline"
                              >
                                {company.email}
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start">
                            <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Email</p>
                              <span className="text-muted-foreground">Not provided</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="border-t my-4 pt-4">
                    <h3 className="font-semibold mb-3">Company Facts</h3>
                    <div className="space-y-2">
                      {company.foundedYear && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Founded</span>
                        <span>{company.foundedYear}</span>
                      </div>
                      )}
                      {(company.teamSize || company.employeeCount) && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Employees</span>
                        <span>{company.teamSize || company.employeeCount}</span>
                      </div>
                      )}
                      {company.languages && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Languages</span>
                        <span>{typeof company.languages === 'string' ? company.languages : company.languages.join(', ')}</span>
                      </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t my-4 pt-4">
                    <h3 className="font-semibold mb-3">Social Media</h3>
                    <div className="flex space-x-4">
                      {company.social?.facebook && (
                        <Link href={company.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
                          <Facebook className="h-5 w-5" />
                        </Link>
                      )}
                      {company.social?.twitter && (
                        <Link href={company.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
                          <Twitter className="h-5 w-5" />
                        </Link>
                      )}
                      {company.social?.linkedin && (
                        <Link href={company.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
                          <Linkedin className="h-5 w-5" />
                        </Link>
                      )}
                      {company.social?.instagram && (
                        <Link href={company.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary">
                          <Instagram className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Only show services tab if services exist */}
          {activeTab === "services" && (
            <div>
              <h2 className="text-xl font-bold mb-6">Services</h2>
              {renderServices()}
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h2 className="text-xl font-bold mb-6">Company History & Milestones</h2>
              {history.length > 0 ? (
                <div className="relative border-l-2 border-primary/20 pl-8 ml-4 space-y-10">
                  {[...history]
                    .sort((a, b) => b.year - a.year)
                    .map((item, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-10 mt-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <History className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-white p-5 rounded-lg shadow-sm">
                        <h3 className="text-lg font-bold text-primary mb-1">{item.year}</h3>
                        <p className="text-muted-foreground">{item.event}</p>
                      </div>
                    </div>
                  ))}
                  <div className="absolute -left-[10px] bottom-0 h-5 w-5 rounded-full bg-primary"></div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-10">
                  No history information available for this company.
                </p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Client Reviews</h2>
                <Button variant="outline">Write a Review</Button>
              </div>

              {company.reviews && company.reviews.length > 0 ? (
                <div className="space-y-6">
                  {company.reviews.map((review: any, index: number) => (
                    <Card key={index} className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{review.author}</h3>
                          <p className="text-sm text-muted-foreground">{review.company}</p>
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{review.text}</p>
                      <p className="text-xs text-muted-foreground">
                        Posted on {new Date(review.date).toLocaleDateString()}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-10">
                  No reviews yet. Be the first to leave a review!
                </p>
              )}
            </div>
          )}

          {activeTab === "contact" && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Contact {company.name}</h2>
                <p className="text-muted-foreground">Fill out this form to get in touch with the company directly.</p>
              </div>
              
              <Card className="p-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Name *</label>
                    <Input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Email *</label>
                    <Input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your message"
                      rows={5}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Card>
            </div>
          )}
        </div>

        {/* Similar Companies */}
        <div>
          <h2 className="text-xl font-bold mb-6">Similar Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(companyData)
              .filter(c => c.id !== id)
              .slice(0, 3)
              .map((similarCompany) => (
                <Card key={similarCompany.id} className="overflow-hidden flex flex-col h-full">
                  <div className="p-6 border-b">
                    <div className="flex items-center mb-4">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 mr-3 flex items-center justify-center">
                        <Image
                          src={similarCompany.logo}
                          alt={`${similarCompany.name} logo`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm leading-tight flex items-center">
                          {similarCompany.name}
                          {similarCompany.verified && (
                            <span className="ml-1 text-xs text-primary">
                              <Check className="h-3 w-3 inline-block" />
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-muted-foreground">{similarCompany.location}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {similarCompany.description}
                    </p>
                  </div>
                  <div className="p-4 mt-auto">
                    <Link href={`/company/${similarCompany.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
