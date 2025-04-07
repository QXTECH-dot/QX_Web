"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AboutSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          About QX Net
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
          QX Net is Australia's leading platform connecting businesses with service providers across all industries nationwide. From construction to finance, IT to healthcare - we help you find the right partners for your business needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-bold mb-4">Why QX Net?</h3>
            <p className="text-muted-foreground mb-4">
              At QX Net, we've built Australia's premier business connection platform where companies looking for industry partners can easily find the right match. Whether you need expertise in construction, finance, IT, design, or any other field, our platform offers:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
              <li>A comprehensive selection of verified Australian companies across all industries</li>
              <li>Transparent company profiles with portfolios, reviews, and specializations</li>
              <li>Simple project submission process to get matched with ideal partners</li>
              <li>Industry-specific insights and Australian market analysis</li>
              <li>Free service with no obligation to hire</li>
            </ul>
            <p className="text-muted-foreground">
              We handle the matching process so you can focus on growing your Australian business. Our platform makes it effortless to connect with experts tailored to your specific requirements.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">How QX Net Serves Australian Businesses</h3>
            <p className="text-muted-foreground mb-4">
              Our process is designed with Australian businesses in mind:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-muted-foreground mb-4">
              <li>Submit your project details through our easy-to-use form</li>
              <li>Receive a curated list of Australian companies matched to your needs</li>
              <li>Review company profiles, portfolios, and client testimonials</li>
              <li>Connect directly with your chosen companies</li>
              <li>Make informed decisions about your business partnerships</li>
            </ol>
            <p className="text-muted-foreground">
              We focus on quality Australian connections rather than overwhelming you with options. Each company on our platform is verified to ensure they meet our standards of excellence and understand the unique Australian business landscape.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-primary/10 p-8 rounded-lg">
          <div className="flex flex-col items-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">
              Create your company profile in less than 6 minutes.
            </h3>
            <p className="text-center text-muted-foreground mb-6 max-w-2xl">
              The process is straightforward and won't cost you anything. Just complete the basic fields to establish your company's profile on QX Net and start connecting with businesses across Australia.
            </p>
            <Button size="lg" className="bg-primary text-white">
              <Link href="/get-listed">Get Listed</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
