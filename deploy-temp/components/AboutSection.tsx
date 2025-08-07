"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AboutSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          What is QX Web
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
          QX Web is the world's most advanced platform to find technology service companies for your business needs. We connect clients with IT companies around the world.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-bold mb-4">Why QX Web?</h3>
            <p className="text-muted-foreground mb-4">
              At QX Web, we've built a platform where companies looking for tech partners can easily find the right match. If you're seeking top talent in web development, software services, design, marketing, or any other technical field, our platform offers:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground mb-4">
              <li>A curated selection of verified tech companies from around the globe</li>
              <li>Transparent company profiles with portfolios, reviews, and specializations</li>
              <li>Simple project submission process to get matched with ideal partners</li>
              <li>Free service with no obligation to hire</li>
            </ul>
            <p className="text-muted-foreground">
              We handle the matching process so you can focus on your business goals. Our platform makes it effortless to connect with technology experts tailored to your specific requirements.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">How QX Web Can Help</h3>
            <p className="text-muted-foreground mb-4">
              The process is simple and designed with your convenience in mind:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-muted-foreground mb-4">
              <li>Submit your project details through our easy-to-use form</li>
              <li>Receive a curated list of matching companies within hours</li>
              <li>Review company profiles, portfolios, and client reviews</li>
              <li>Connect directly with your chosen companies</li>
              <li>Make informed decisions about your technology partnerships</li>
            </ol>
            <p className="text-muted-foreground">
              We believe in quality connections rather than overwhelming you with options. Each company on our platform is verified to ensure they meet our standards of excellence.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">54,657</h3>
            <p className="text-center text-muted-foreground">Companies</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">144</h3>
            <p className="text-center text-muted-foreground">Countries</p>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">7,281</h3>
            <p className="text-center text-muted-foreground">Cities</p>
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-primary/10 p-8 rounded-lg">
          <div className="flex flex-col items-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">
              Create your company profile in less than 6 minutes.
            </h3>
            <p className="text-center text-muted-foreground mb-6 max-w-2xl">
              The process is straightforward and won't cost you anything. Just complete the basic fields to establish your company's profile on QX Web.
            </p>
            <Button size="lg" className="bg-primary text-white">
              <Link href="/companies/get-listed">Get Listed</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
