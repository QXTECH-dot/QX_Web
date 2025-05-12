"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Globe, Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram, ExternalLink, Star, Calendar, Users, History } from "lucide-react";
import Link from "next/link";

// CustomerLabs company data
const company = {
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
};

export function CustomerlabsProfile() {
  const [activeTab, setActiveTab] = useState("overview");

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
                <MapPin className="h-4 w-4 mr-1" /> {company.location}
              </p>

              {/* Languages section */}
              {company.languages && company.languages.length > 0 && (
                <p className="text-muted-foreground flex items-center mb-4">
                  <Globe className="h-4 w-4 mr-1" />
                  <span>Languages: {company.languages.join(', ')}</span>
                </p>
              )}

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
        {company.languages && (
          <div className="bg-white rounded-lg p-4 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                {company.industries && company.industries.length > 0 && (
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
                {company.services.map((service, index) => {
                  const serviceDescriptions: Record<string, string> = {
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
              <div className="relative border-l-2 border-primary/20 pl-8 ml-4 space-y-10">
                {company.history.map((item, index) => (
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
      </div>
    </div>
  );
}
