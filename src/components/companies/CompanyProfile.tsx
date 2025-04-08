"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Globe, Mail, MapPin, Phone, Award, Facebook, Twitter, Linkedin, Instagram, ExternalLink, Star, Calendar, Users, Clock, Building, Building2, History, Youtube, BookOpen } from "lucide-react";
import Link from "next/link";
import { ProfileCompareButton } from "@/components/comparison/ProfileCompareButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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

export function CompanyProfile({ id }: CompanyProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollToServices = () => {
    setActiveTab("services");
    // 使用 setTimeout 确保标签切换后再滚动
    setTimeout(() => {
      const tabsNav = document.querySelector('.border-b.mb-8');
      if (tabsNav) {
        // 获取导航栏的位置
        const navRect = tabsNav.getBoundingClientRect();
        // 计算滚动位置，减去一定的上边距（比如 100px）以确保导航栏可见
        const scrollPosition = window.pageYOffset + navRect.top - 100;
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const scrollToContact = () => {
    setActiveTab("contact");
    if (tabsRef.current) {
      const offset = 100; // 向上偏移 100px
      const elementPosition = tabsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // In a real app, you'd fetch this data based on the ID
  const company = companyData[id as keyof typeof companyData] || companyData.incrementors;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 这里应该是您的实际API端点
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          companyEmail: company.email,
          companyName: company.name,
          defaultEmail: 'info@qixin.com.au'
        }),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: ""
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <p className="text-muted-foreground flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-1" /> {company.location}
              </p>

              {company.industries && company.industries.length > 0 && (
                <p className="text-muted-foreground flex items-center mb-4">
                  <Building2 className="h-4 w-4 mr-1" />
                  <span>{company.industries[0]}</span>
                </p>
              )}

              <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
                {company.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {company.services.slice(0, 6).map((service, index) => (
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
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                size="lg" 
                className="bg-primary text-white w-full md:w-auto hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
                onClick={scrollToContact}
              >
                Get In Touch
              </Button>
              <Link href={company.website} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Company Comparison */}
        <div>
        <ProfileCompareButton company={company} />
        </div>

        {/* Key Facts Bar */}
        {company.languages && (
          <div className="bg-white rounded-lg p-4 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-xs text-muted-foreground">Languages</p>
                  <p className="font-medium">{company.languages.join(', ')}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-xs text-muted-foreground">Team Size</p>
                  <p className="font-medium">{company.employeeCount}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-xs text-muted-foreground">Founded</p>
                  <p className="font-medium">{company.founded}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="border-b mb-8" ref={tabsRef}>
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
                  <p className="text-gray-600">{company.longDescription}</p>
                        </div>

                {/* Offices Section */}
                {company.offices && company.offices.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Offices</h2>
                    <div className="space-y-4">
                      {company.offices.map((office, index) => (
                        <div key={index} className="flex items-start">
                          <MapPin className="h-5 w-5 text-primary mt-1 mr-3 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{office.city} Office</h3>
                            <p className="text-gray-600">{office.address}</p>
                    </div>
                        </div>
                      ))}
                    </div>
                    </div>
                )}
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
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {company.website.replace('https://', '')}
                        </a>
                      </div>
                    </div>
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
                  </div>

                  <div className="border-t my-4 pt-4">
                    <h3 className="font-semibold mb-3">Company Facts</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Founded</span>
                        <span>{company.founded}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Employees</span>
                        <span>{company.employeeCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t my-4 pt-4">
                    <h3 className="font-semibold mb-3">Social Media</h3>
                    <div className="flex flex-wrap gap-3">
                      {company.social.facebook && (
                        <a
                          href={company.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          title="Facebook"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {company.social.twitter && (
                        <a
                          href={company.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          title="Twitter"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {company.social.linkedin && (
                        <a
                          href={company.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {company.social.instagram && (
                        <a
                          href={company.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          title="Instagram"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {company.social.xiaohongshu && (
                        <a
                          href={company.social.xiaohongshu}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          title="Xiaohongshu"
                        >
                          <BookOpen className="h-5 w-5" />
                        </a>
                      )}
                      {company.social.youtube && (
                        <a
                          href={company.social.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          title="YouTube"
                        >
                          <Youtube className="h-5 w-5" />
                        </a>
                      )}
                      {company.social.tiktok && (
                        <a
                          href={company.social.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
                          title="TikTok"
                        >
                          <svg 
                            viewBox="0 0 24 24" 
                            className="h-5 w-5"
                            fill="currentColor"
                          >
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div>
              <h2 className="text-xl font-bold mb-6">Services Offered</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {company.services.map((service, index) => {
                  const serviceDescriptions: Record<string, string> = {
                    "Logo Design": "Professional logo design services to create a unique visual identity for your brand. Our designers craft memorable logos that reflect your business values and resonate with your target audience.",
                    "Brand Identity": "Comprehensive brand identity design including logos, color schemes, typography, and brand guidelines to create a cohesive and professional image.",
                    "Graphic Design": "Creative graphic design services for all your business needs - from marketing materials to social media assets and product packaging.",
                    "Package Design": "Attractive and functional packaging design that enhances product appeal, protects contents, and communicates your brand message effectively.",
                    "Web Design": "Beautiful, user-friendly website designs that provide excellent user experience across all devices while reflecting your brand identity.",
                    "Search Engine Optimization (SEO)": "Data-driven SEO strategies to improve your website's visibility in search engines, drive organic traffic, and increase conversions.",
                    "Pay Per Click (PPC)": "Targeted PPC campaign management to maximize your advertising ROI across Google, Bing, and social media platforms.",
                    "Social Media Marketing": "Strategic social media marketing to build your brand presence, engage with customers, and drive traffic and sales.",
                    "Content Marketing": "High-quality content creation and strategic distribution to attract, engage, and convert your target audience.",
                    "Web Development": "Professional web development services using the latest technologies to create responsive, fast, and secure websites.",
                    "Digital Marketing Strategy": "Comprehensive digital marketing strategies tailored to your business goals, target audience, and industry.",
                    "Conversion Rate Optimization": "Data-backed CRO techniques to improve your website's performance and increase conversion rates.",
                    "Customer Data Platform": "Powerful customer data platform solutions to collect, unify, and activate your customer data for better marketing.",
                    "Data Analytics": "Advanced data analytics services to extract insights from your data and make data-driven business decisions.",
                    "Marketing Technology": "Marketing technology consulting and implementation to streamline your marketing operations and improve results.",
                    "Personalization": "Personalization strategies and technologies to deliver customized experiences to your customers at scale.",
                    "Privacy Compliance": "Privacy compliance solutions to ensure your marketing practices meet GDPR, CCPA, and other data protection regulations."
                  };

                  return (
                    <Card key={index} className="p-5">
                      <div className="flex items-start">
                        <div className="bg-primary/10 p-3 rounded-md mr-4">
                          <Check className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{service}</h3>
                          <p className="text-sm text-muted-foreground">
                            {serviceDescriptions[service] || `Professional ${service} services tailored to your business needs, delivered by our experienced team.`}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <h2 className="text-xl font-bold mb-6">Company History & Milestones</h2>
              {company.history ? (
                <div className="relative border-l-2 border-primary/20 pl-8 ml-4 space-y-10">
                  {[...company.history]
                    .sort((a, b) => b.year - a.year) // 按年份从新到旧排序
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
                  {company.reviews.map((review, index) => (
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
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Email *</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Enter your message"
                      rows={5}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
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
