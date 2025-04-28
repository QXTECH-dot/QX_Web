"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const aboutTitle = "About QX Net";
const aboutDesc = "QX Net is Australia's leading platform connecting businesses with service providers across all industries nationwide. From construction to finance, IT to healthcare - we help you find the right partners for your business needs.";
const whyList = [
  "A comprehensive selection of verified Australian companies across all industries",
  "Transparent company profiles with portfolios, reviews, and specializations",
  "Simple project submission process to get matched with ideal partners",
  "Industry-specific insights and Australian market analysis",
  "Free service with no obligation to hire"
];
const howList = [
  "Submit your project details through our easy-to-use form",
  "Receive a curated list of Australian companies matched to your needs",
  "Review company profiles, portfolios, and client testimonials",
  "Connect directly with your chosen companies",
  "Make informed decisions about your business partnerships"
];

export function AboutSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">{aboutTitle}</h2>
        <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">{aboutDesc}</p>
        <div className="flex flex-col gap-6 w-full max-w-xl">
          {howList.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">{i+1}</div>
              <div className="flex-1 text-sm flex items-center">{step}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
