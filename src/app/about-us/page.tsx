"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutUsPage() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-[#0a1926] text-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About QX Net</h1>
            <p className="text-xl">
              Australia's premier platform connecting businesses across all industries
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-6">
                At QX Net, we're on a mission to transform how businesses connect and grow in Australia. We provide a comprehensive platform that helps companies of all sizes and across all industries showcase their services, connect with clients, and establish their presence in the Australian market.
              </p>
              <p className="text-lg">
                Founded in 2023, QX Net has quickly become the go-to resource for businesses and consumers looking to navigate Australia's diverse industrial landscape, from Finance and Construction to Education and Technology.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1608539733302-9d738165e044?q=80&w=800&auto=format&fit=crop"
                alt="Sydney Skyline"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#E4BF2D] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-black">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Business Directory</h3>
              <p className="text-center">
                We maintain Australia's most comprehensive business directory across multiple industries, helping customers find the right service providers for their needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#E4BF2D] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-black">
                  <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path>
                  <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Industry Insights</h3>
              <p className="text-center">
                Our platform provides valuable industry reports, market analysis, and business growth data to help companies make informed decisions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-[#E4BF2D] rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-black">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Business Resources</h3>
              <p className="text-center">
                We offer tools, resources, and funding opportunities to help Australian businesses grow, including our innovative "Fund My Start-up" program.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a1926] to-[#1a2936] p-1">
              <div className="bg-white rounded-lg p-6 h-full transform transition-transform group-hover:-translate-y-1">
                <h3 className="text-xl font-bold mb-4 text-[#0a1926]">Empowering Australian Businesses</h3>
                <p className="text-gray-600 mb-4">Supporting businesses of all sizes across every industry in Australia, providing resources and visibility for growth.</p>
                <div className="w-12 h-1 bg-[#E4BF2D]"></div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a1926] to-[#1a2936] p-1">
              <div className="bg-white rounded-lg p-6 h-full transform transition-transform group-hover:-translate-y-1">
                <h3 className="text-xl font-bold mb-4 text-[#0a1926]">Embracing Diversity</h3>
                <p className="text-gray-600 mb-4">Celebrating Australia's diverse business landscape, supporting both established and emerging sectors.</p>
                <div className="w-12 h-1 bg-[#E4BF2D]"></div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a1926] to-[#1a2936] p-1">
              <div className="bg-white rounded-lg p-6 h-full transform transition-transform group-hover:-translate-y-1">
                <h3 className="text-xl font-bold mb-4 text-[#0a1926]">Fostering Connections</h3>
                <p className="text-gray-600 mb-4">Building meaningful business relationships that drive growth and create opportunities for collaboration.</p>
                <div className="w-12 h-1 bg-[#E4BF2D]"></div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0a1926] to-[#1a2936] p-1">
              <div className="bg-white rounded-lg p-6 h-full transform transition-transform group-hover:-translate-y-1">
                <h3 className="text-xl font-bold mb-4 text-[#0a1926]">Driving Innovation</h3>
                <p className="text-gray-600 mb-4">Staying at the forefront of digital innovation, continuously enhancing our platform with new features.</p>
                <div className="w-12 h-1 bg-[#E4BF2D]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&auto=format&fit=crop&crop=faces"
                  alt="CEO"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">David Wilson</h3>
              <p className="text-sm text-gray-500 mb-4">CEO & Founder</p>
              <p className="text-sm">
                With over 15 years of experience in business development, David founded QX Net to transform how Australian businesses connect and grow.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&auto=format&fit=crop&crop=faces"
                  alt="COO"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Sarah Chen</h3>
              <p className="text-sm text-gray-500 mb-4">Chief Operations Officer</p>
              <p className="text-sm">
                Sarah brings expertise in scaling operations across diverse industries, ensuring QX Net delivers exceptional value to businesses across Australia.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&auto=format&fit=crop&crop=faces"
                  alt="CTO"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">Michael Thompson</h3>
              <p className="text-sm text-gray-500 mb-4">Chief Technology Officer</p>
              <p className="text-sm">
                Michael leads our technology development, creating innovative solutions that help Australian businesses thrive in the digital economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0a1926] text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Join the QX Net Community</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Whether you're looking to grow your business, find trusted service providers, or explore opportunities across Australia, QX Net is your partner for success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-listed">
              <Button className="bg-[#E4BF2D] hover:bg-[#d4af20] text-black font-bold px-6 py-3 text-lg">
                Get Listed Today
              </Button>
            </Link>
            <Link href="/companies">
              <Button variant="outline" className="border-white bg-white text-[#0a1926] hover:bg-gray-100 font-bold px-6 py-3 text-lg">
                Explore Companies
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
