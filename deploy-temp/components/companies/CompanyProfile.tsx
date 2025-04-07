"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Globe, Mail, MapPin, Phone, Award, Facebook, Twitter, Linkedin, Instagram, ExternalLink, Star, Calendar, Users, Clock, Building } from "lucide-react";
import Link from "next/link";

// Mock company data - in a real app this would come from an API
const companyData = {
  bytsetSolutions: {
    id: "bytset-solutions",
    name: "Bytset Solutions | Logo Design Company",
    verified: true,
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
    location: "Delhi, India",
    description: "Incrementors Web Solutions is a digital marketing agency that focuses on providing innovative solutions and creative strategies for helping businesses upgrade their customer base and foster growth.",
    longDescription: "Our focus on quality and innovation helps our clients stay ahead in the ever-evolving digital landscape. We provide end-to-end solutions for all your online marketing needs while ensuring complete transparency and effective communication throughout the project. Our team of experienced professionals specializes in SEO, PPC, content marketing, social media marketing, web design, and development. We work closely with our clients to understand their business goals and create customized strategies that deliver measurable results.",
    logo: "https://ext.same-assets.com/3273624843/1822484193.png",
    website: "https://www.incrementors.com",
    email: "info@incrementors.com",
    phone: "+91 9876543210",
    founded: 2012,
    employeeCount: "50-100",
    hourlyRate: "$25-$49/hr",
    minimumProjectSize: "$1,000+",
    avgProjectLength: "1-3 months",
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
    industries: [
      "E-commerce",
      "Healthcare",
      "Education",
      "Real Estate",
      "Technology",
      "Financial Services"
    ],
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
    location: "Chennai, India",
    description: "CustomerLabs helps businesses collect, unify, and activate first-party data for better marketing, personalization, and privacy-compliant advertising.",
    longDescription: "CustomerLabs is a Customer Data Platform (CDP) that helps businesses unify their customer data from various sources, create unified customer profiles, and activate this data for marketing and personalization. Our platform is designed to be easy to use, flexible, and compliant with privacy regulations. We help businesses of all sizes make the most of their first-party data in a privacy-first world.",
    logo: "https://ext.same-assets.com/3273624843/1192082462.png",
    website: "https://www.customerlabs.com",
    email: "hello@customerlabs.com",
    phone: "+91 9876543211",
    founded: 2019,
    employeeCount: "50-200",
    services: ["Customer Data Platform", "Data Analytics", "Marketing Technology", "Personalization", "Privacy Compliance"],
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

  // In a real app, you'd fetch this data based on the ID
  // Match the ID to the corresponding company data, with fallback to Incrementors
  const company = companyData[id as keyof typeof companyData] || companyData.incrementors;

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
              <p className="text-muted-foreground flex items-center mb-4">
                <MapPin className="h-4 w-4 mr-1" /> {company.location}
              </p>
              <p className="text-sm text-muted-foreground mb-4 max-w-3xl">
                {company.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {company.services.slice(0, 5).map((service, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-muted-foreground px-3 py-1 rounded-full text-xs"
                  >
                    {service}
                  </span>
                ))}
                {company.services.length > 5 && (
                  <span className="bg-gray-100 text-muted-foreground px-3 py-1 rounded-full text-xs">
                    +{company.services.length - 5} more
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button size="lg" className="bg-primary text-white w-full md:w-auto">
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

        {/* Key Facts Bar */}
        {'hourlyRate' in company && (
          <div className="bg-white rounded-lg p-4 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-xs text-muted-foreground">Hourly Rate</p>
                  <p className="font-medium">{company.hourlyRate}</p>
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
              <div className="flex items-center">
                <Building className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-xs text-muted-foreground">Min. Project Size</p>
                  <p className="font-medium">{company.minimumProjectSize}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="border-b mb-8">
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
                activeTab === "portfolio"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("portfolio")}
            >
              Portfolio
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
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Company Info */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-bold mb-4">About {company.name}</h2>
                <p className="text-muted-foreground mb-6">
                  {company.longDescription}
                </p>

                {'industries' in company && (
                  <>
                    <h3 className="text-lg font-semibold mb-3">Industries</h3>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {company.industries.map((industry, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-primary mr-2" />
                          <span>{industry}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {'certifications' in company && (
                  <>
                    <h3 className="text-lg font-semibold mb-3">Certifications & Partnerships</h3>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {company.certifications.map((certification, index) => (
                        <div key={index} className="flex items-center">
                          <Award className="h-4 w-4 text-primary mr-2" />
                          <span>{certification}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {'clients' in company && company.clients.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mb-3">Key Clients</h3>
                    <div className="flex flex-wrap gap-4 mb-6">
                      {company.clients.map((client, index) => (
                        <div key={index} className="flex items-center bg-gray-50 p-2 rounded">
                          <span>{client.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
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
                      {'avgProjectLength' in company && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg. Project Length</span>
                          <span>{company.avgProjectLength}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t my-4 pt-4">
                    <h3 className="font-semibold mb-3">Social Media</h3>
                    <div className="flex gap-3">
                      {company.social.facebook && (
                        <a
                          href={company.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary"
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
                        >
                          <Instagram className="h-5 w-5" />
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
                {company.services.map((service, index) => (
                  <Card key={index} className="p-5">
                    <div className="flex items-start">
                      <div className="bg-primary/10 p-3 rounded-md mr-4">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{service}</h3>
                        <p className="text-sm text-muted-foreground">
                          Professional {service} services tailored to your business needs, delivered by our experienced team.
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div>
              <h2 className="text-xl font-bold mb-6">Portfolio & Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {company.portfolio.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
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
        </div>

        {/* Similar Companies */}
        <div>
          <h2 className="text-xl font-bold mb-6">Similar Companies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(companyData)
              .filter(c => c.id !== id)
              .map((company) => (
                <Card key={company.id} className="overflow-hidden flex flex-col h-full">
                  <div className="p-6 border-b">
                    <div className="flex items-center mb-4">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 mr-3 flex items-center justify-center">
                        <Image
                          src={company.logo}
                          alt={`${company.name} logo`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm leading-tight flex items-center">
                          {company.name}
                          {company.verified && (
                            <span className="ml-1 text-xs text-primary">
                              <Check className="h-3 w-3 inline-block" />
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-muted-foreground">{company.location}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {company.description}
                    </p>
                  </div>
                  <div className="p-4 mt-auto">
                    <Link href={`/company/${company.id}`}>
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
