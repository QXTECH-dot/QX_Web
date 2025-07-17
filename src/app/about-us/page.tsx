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
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="text-sm font-medium text-qxnet uppercase tracking-wider">About Us</span>
              <div className="mt-2 h-1 w-12 bg-qxnet mx-auto rounded-full"></div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#0a1926]">
              About <span className="text-qxnet">QX Net</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Australia's premier platform connecting businesses across all industries
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-6">
                <span className="text-sm font-medium text-qxnet uppercase tracking-wider">Our Mission</span>
                <div className="mt-2 h-1 w-12 bg-qxnet rounded-full"></div>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-[#0a1926]">Transforming Business Connections in Australia</h2>
              <div className="space-y-6 text-gray-600">
                <p className="text-lg">
                  At QX Net, we're on a mission to transform how businesses connect and grow in Australia. We provide a comprehensive platform that helps companies of all sizes and across all industries showcase their services, connect with clients, and establish their presence in the Australian market.
                </p>
                <p className="text-lg">
                  Founded in 2023, QX Net has quickly become the go-to resource for businesses and consumers looking to navigate Australia's diverse industrial landscape, from Finance and Construction to Education and Technology.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-64 h-64 bg-qxnet/10 rounded-full blur-3xl"></div>
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                  alt="Business Meeting"
                  width={600}
                  height={400}
                  className="w-full h-auto hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <span className="text-sm font-medium text-qxnet uppercase tracking-wider">What We Do</span>
              <div className="mt-2 h-1 w-12 bg-qxnet mx-auto rounded-full"></div>
            </div>
            <h2 className="text-3xl font-bold text-[#0a1926]">Empowering Australian Businesses</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-qxnet/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-qxnet/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-qxnet">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0a1926] mb-4">Business Directory</h3>
              <p className="text-gray-600">
                We maintain Australia's most comprehensive business directory across multiple industries, helping customers find the right service providers for their needs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-qxnet/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-qxnet/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-qxnet">
                  <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path>
                  <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0a1926] mb-4">Industry Insights</h3>
              <p className="text-gray-600">
                Our platform provides valuable industry reports, market analysis, and business growth data to help companies make informed decisions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-qxnet/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-qxnet/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-qxnet">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0a1926] mb-4">Business Resources</h3>
              <p className="text-gray-600">
                We offer tools, resources, and funding opportunities to help Australian businesses grow, including our innovative "Fund My Start-up" program.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <span className="text-sm font-medium text-qxnet uppercase tracking-wider">Our Values</span>
              <div className="mt-2 h-1 w-12 bg-qxnet mx-auto rounded-full"></div>
            </div>
            <h2 className="text-3xl font-bold text-[#0a1926]">What Drives Us Forward</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold mb-4 text-[#0a1926]">Empowering Australian Businesses</h3>
              <p className="text-gray-600 mb-4">Supporting businesses of all sizes across every industry in Australia, providing resources and visibility for growth.</p>
              <div className="w-12 h-1 bg-qxnet rounded-full group-hover:w-16 transition-all duration-300"></div>
            </div>

            <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold mb-4 text-[#0a1926]">Embracing Diversity</h3>
              <p className="text-gray-600 mb-4">Celebrating Australia's diverse business landscape, supporting both established and emerging sectors.</p>
              <div className="w-12 h-1 bg-qxnet rounded-full group-hover:w-16 transition-all duration-300"></div>
            </div>

            <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold mb-4 text-[#0a1926]">Fostering Connections</h3>
              <p className="text-gray-600 mb-4">Building meaningful business relationships that drive growth and create opportunities for collaboration.</p>
              <div className="w-12 h-1 bg-qxnet rounded-full group-hover:w-16 transition-all duration-300"></div>
            </div>

            <div className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold mb-4 text-[#0a1926]">Driving Innovation</h3>
              <p className="text-gray-600 mb-4">Staying at the forefront of digital innovation, continuously enhancing our platform with new features.</p>
              <div className="w-12 h-1 bg-qxnet rounded-full group-hover:w-16 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Impact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-sm font-medium text-qxnet uppercase tracking-wider">Platform Impact</span>
              <div className="mt-2 h-1 w-12 bg-qxnet mx-auto rounded-full"></div>
            </div>
            <h2 className="text-3xl font-bold text-[#0a1926]">Powering Australia's Business Network</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              Since our launch, we've been building Australia's most comprehensive business ecosystem, connecting companies and driving growth across all industries.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group border-2 border-transparent hover:border-qxnet/30">
              <div className="w-16 h-16 bg-qxnet/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-qxnet/30 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qxnet">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-qxnet mb-2">25,000+</h3>
              <p className="text-gray-600 font-medium">Registered Companies</p>
              <div className="w-full h-1 bg-gray-200 rounded-full mt-4">
                <div className="h-1 bg-qxnet rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group border-2 border-transparent hover:border-qxnet/30">
              <div className="w-16 h-16 bg-qxnet/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-qxnet/30 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qxnet">
                  <path d="M3 3v18h18"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-qxnet mb-2">500K+</h3>
              <p className="text-gray-600 font-medium">Monthly Searches</p>
              <div className="w-full h-1 bg-gray-200 rounded-full mt-4">
                <div className="h-1 bg-qxnet rounded-full" style={{width: '92%'}}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group border-2 border-transparent hover:border-qxnet/30">
              <div className="w-16 h-16 bg-qxnet/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-qxnet/30 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qxnet">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-qxnet mb-2">50+</h3>
              <p className="text-gray-600 font-medium">Industry Categories</p>
              <div className="w-full h-1 bg-gray-200 rounded-full mt-4">
                <div className="h-1 bg-qxnet rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group border-2 border-transparent hover:border-qxnet/30">
              <div className="w-16 h-16 bg-qxnet/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-qxnet/30 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qxnet">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-qxnet mb-2">24/7</h3>
              <p className="text-gray-600 font-medium">Platform Availability</p>
              <div className="w-full h-1 bg-gray-200 rounded-full mt-4">
                <div className="h-1 bg-qxnet rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>

          {/* Key Achievements */}
          <div className="bg-gradient-to-br from-qxnet/5 to-qxnet/10 rounded-2xl p-8 shadow-lg border border-qxnet/20">
            <h3 className="text-2xl font-bold text-[#0a1926] mb-8 text-center">Key Milestones & Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-qxnet">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-qxnet/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qxnet">
                      <path d="M9 12l2 2 4-4"/>
                      <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                      <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                      <path d="M3 12c0 5.523 4.477 10 10 10s10-4.477 10-10"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a1926] mb-2">Australia-Wide Coverage</h4>
                    <p className="text-gray-600 text-sm">Successfully launched comprehensive business directory coverage across all Australian states and territories.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-qxnet">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-qxnet/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qxnet">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                      <path d="M9 14l2 2 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a1926] mb-2">Industry Data Platform</h4>
                    <p className="text-gray-600 text-sm">Launched comprehensive industry analytics and visualization tools for market insights and trends.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-qxnet">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-qxnet/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qxnet">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 12l2 2 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a1926] mb-2">Mobile-First Design</h4>
                    <p className="text-gray-600 text-sm">Developed responsive platform optimized for mobile devices, serving 70% of our user base.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-qxnet">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-qxnet/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qxnet">
                      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a1926] mb-2">Smart Search Technology</h4>
                    <p className="text-gray-600 text-sm">Implemented AI-powered search algorithms that improve business discovery and matching accuracy.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-qxnet">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-qxnet/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qxnet">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a1926] mb-2">Partnership Program</h4>
                    <p className="text-gray-600 text-sm">Established strategic partnerships with key industry associations and business networks across Australia.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-qxnet">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-qxnet/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-qxnet">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0a1926] mb-2">Business Growth Support</h4>
                    <p className="text-gray-600 text-sm">Launched funding programs and growth resources, helping over 1,000 businesses scale their operations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-[#F0D46F] rounded-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 -left-12 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 right-1/4 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
            </div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-[#0a1926] mb-6">Join the QX Net Community</h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
                Whether you're looking to grow your business, find trusted service providers, or explore opportunities across Australia, QX Net is your partner for success.
              </p>
              <div className="flex justify-center">
                <Link href="/companies">
                  <Button variant="outline" className="border-2 border-[#0a1926] bg-transparent text-[#0a1926] hover:bg-[#0a1926] hover:text-white font-bold px-8 py-3 text-lg">
                    Explore Companies
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
