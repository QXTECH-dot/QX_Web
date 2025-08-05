"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Code, Layout, PenTool, Megaphone } from "lucide-react";

const serviceCategories = [
  {
    id: "web-development",
    name: "Web Development",
    icon: <Code className="h-6 w-6 text-primary" />,
    services: [
      { name: "Web-App Development", link: "/companies/web-development" },
      { name: "eCommerce Development", link: "/companies/ecommerce" },
      { name: "PHP", link: "/companies/php" },
      { name: "Ruby", link: "/companies/ruby" },
      { name: "JavaScript", link: "/companies/javascript" },
      { name: "Angular", link: "/companies/angularjs" },
      { name: "React", link: "/companies/reactjs" },
      { name: "Flutter", link: "/companies/flutter" },
      { name: "Django", link: "/companies/django" },
      { name: "WordPress", link: "/companies/wordpress" },
      { name: ".NET", link: "/companies/net" },
      { name: "NodeJS", link: "/companies/nodejs" },
    ],
  },
  {
    id: "software-development",
    name: "Software Development",
    icon: <Code className="h-6 w-6 text-primary" />,
    services: [
      { name: "iOS Development", link: "/companies/ios" },
      { name: "Android Development", link: "/companies/android" },
      { name: "Cross-Platform", link: "/companies/hybrid-cross-platform-apps" },
      { name: "IoT Development", link: "/companies/iot-development" },
      { name: "C# Development", link: "/companies/c-sharp" },
      { name: "Swift", link: "/companies/swift" },
      { name: "SQL", link: "/companies/sql" },
      { name: "Artificial Intelligence", link: "/companies/artificial-intelligence" },
      { name: "AR/VR", link: "/companies/ar-vr-development" },
      { name: "Blockchain", link: "/companies/blockchain" },
      { name: "Software testing", link: "/companies/application-testing" },
    ],
  },
  {
    id: "design",
    name: "Design",
    icon: <PenTool className="h-6 w-6 text-primary" />,
    services: [
      { name: "Web Design", link: "/companies/web-design" },
      { name: "UI / UX", link: "/companies/ux-ui-design" },
      { name: "Graphic Design", link: "/companies/graphic-design" },
      { name: "Logo Design", link: "/companies/logo-design" },
      { name: "Product Design", link: "/companies/product-design" },
      { name: "Print Design", link: "/companies/print-design" },
      { name: "Packaging Design", link: "/companies/packaging-design" },
      { name: "Architectural Design", link: "/companies/architectural-design" },
    ],
  },
  {
    id: "advertising",
    name: "Advertising",
    icon: <Megaphone className="h-6 w-6 text-primary" />,
    services: [
      { name: "Advertising", link: "/companies/advertising" },
      { name: "SMM (Social Media Marketing)", link: "/companies/smm" },
      { name: "Digital Marketing", link: "/companies/other-digital-marketing" },
      { name: "Content Marketing", link: "/companies/content-marketing" },
      { name: "Branding", link: "/companies/branding" },
      { name: "Naming", link: "/companies/naming" },
      { name: "Video", link: "/companies/video-production" },
      { name: "PR", link: "/companies/pr" },
      { name: "Digital Strategy", link: "/companies/digital-strategy" },
      { name: "Direct Marketing", link: "/companies/direct-marketing" },
      { name: "Email Marketing", link: "/companies/email-marketing" },
      { name: "Market Research", link: "/companies/market-research" },
    ],
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Find your <span className="text-primary">Company</span> for the <span className="text-primary">Services</span> you need
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
          Below is a detailed breakdown of the 4+ main Categories and 510+ Services throughout 54684 companies listed on QX Web
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceCategories.map((category) => (
            <Card key={category.id} className="p-6">
              <div className="flex items-center mb-4">
                {category.icon}
                <h3 className="text-xl font-bold ml-2">{category.name}</h3>
              </div>
              <ul className="space-y-2">
                {category.services.slice(0, 8).map((service, index) => (
                  <li key={index}>
                    <Link href={service.link} className="text-sm hover:text-primary">
                      {service.name}
                    </Link>
                  </li>
                ))}
                {category.services.length > 8 && (
                  <li className="pt-2">
                    <Link href={`/companies/${category.id}`} className="text-sm text-primary font-medium hover:underline">
                      View All
                    </Link>
                  </li>
                )}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services">
            <Button variant="outline" size="lg">
              Browse all 510+ Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
