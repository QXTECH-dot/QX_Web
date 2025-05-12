"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Upload } from "lucide-react";

export function StartupFundingForm() {
  return (
    <div className="bg-background py-12">
      <div className="container max-w-4xl">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-qxnet rounded-lg mx-auto mb-6 flex items-center justify-center shadow-sm">
            <Image
              src="https://ext.same-assets.com/1651653002/3123620635.png"
              alt="Fund My Startup"
              width={45}
              height={45}
              className="invert"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Fund <span className="text-qxnet">your start-up</span> venture & Connect<br />
            with the right investment partners
          </h1>
          <p className="text-lg text-muted-foreground">
            Answer these 9 simple questions. Based on your inputs we will match you with suitable
            investors interested in your startup venture.
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span>Verified investors</span>
            <span>•</span>
            <span>No upfront fees</span>
            <span>•</span>
            <span>100% confidential</span>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <form>
              <div className="space-y-8">
                {/* Startup Name */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">1. Startup Name</h3>
                  <p className="text-muted-foreground mb-4">
                    The official name of your startup. Example: Quantum AI Solutions Pty Ltd.
                  </p>
                  <Input
                    placeholder="Enter your startup name..."
                    className="bg-white"
                  />
                </div>

                {/* Business Description */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">2. Please describe your business model, value proposition, and market opportunity in detail.</h3>
                  <Textarea
                    placeholder="Describe your business, what problem you're solving, your target market, and your unique value proposition..."
                    className="min-h-[200px] bg-white"
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    Characters count: 0 / 3500
                  </div>

                  <div className="mt-4">
                    <p className="text-muted-foreground mb-2">
                      Upload your pitch deck, business plan, or any supporting documents.
                      10 MB. Max file size. Multiple files allowed.
                    </p>
                    <div className="border border-dashed rounded-md p-4 text-center bg-white">
                      <Button variant="outline" type="button" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload documents 10 MB Max
                      </Button>
                      <div className="text-xs text-muted-foreground mt-1">
                        PDF, Doc, Docx, PPT, PPTX
                      </div>
                    </div>
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">3. What industry sector does your startup operate in? (up to 2)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fintech" />
                      <Label htmlFor="fintech">Fintech</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="health" />
                      <Label htmlFor="health">Healthcare/Medtech</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ecommerce" />
                      <Label htmlFor="ecommerce">E-commerce/Retail</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="saas" />
                      <Label htmlFor="saas">SaaS/Cloud Services</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="education" />
                      <Label htmlFor="education">Education</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sustainable" />
                      <Label htmlFor="sustainable">Sustainability/CleanTech</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ai" />
                      <Label htmlFor="ai">AI/Machine Learning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </div>
                </div>

                {/* Traction */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">4. Does your startup have any traction or existing customers?</h3>
                  <RadioGroup defaultValue="mvp">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="idea" id="idea" />
                      <Label htmlFor="idea">Idea stage only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mvp" id="mvp" />
                      <Label htmlFor="mvp">MVP/Prototype developed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="early-customers" id="early-customers" />
                      <Label htmlFor="early-customers">Early customers/users (not paying)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paying-customers" id="paying-customers" />
                      <Label htmlFor="paying-customers">Paying customers with revenue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scaling" id="scaling" />
                      <Label htmlFor="scaling">Scaling with significant revenue</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">5. Where is your startup based?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="nsw" />
                      <Label htmlFor="nsw">New South Wales</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="vic" />
                      <Label htmlFor="vic">Victoria</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="qld" />
                      <Label htmlFor="qld">Queensland</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="wa" />
                      <Label htmlFor="wa">Western Australia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sa" />
                      <Label htmlFor="sa">South Australia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="act" />
                      <Label htmlFor="act">Australian Capital Territory</Label>
                    </div>
                  </div>
                </div>

                <div className="bg-qxnet/10 p-6 rounded-md text-center">
                  <h4 className="text-lg font-semibold mb-2">You're doing great!</h4>
                  <p className="text-muted-foreground">Just a few more details about your funding needs</p>
                </div>

                {/* Funding Round */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">6. What type of funding are you seeking?</h3>
                  <RadioGroup defaultValue="seed">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pre-seed" id="pre-seed" />
                      <Label htmlFor="pre-seed">Pre-seed funding</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seed" id="seed" />
                      <Label htmlFor="seed">Seed funding</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="series-a" id="series-a" />
                      <Label htmlFor="series-a">Series A</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="series-b-plus" id="series-b-plus" />
                      <Label htmlFor="series-b-plus">Series B or later</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-sure" id="not-sure-round" />
                      <Label htmlFor="not-sure-round">Not sure</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Amount */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">7. How much funding are you looking to raise?</h3>
                  <RadioGroup defaultValue="250k-500k">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="under-100k" id="under-100k" />
                      <Label htmlFor="under-100k">Under $100,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="100k-250k" id="100k-250k" />
                      <Label htmlFor="100k-250k">$100,000 - $250,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="250k-500k" id="250k-500k" />
                      <Label htmlFor="250k-500k">$250,000 - $500,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="500k-1m" id="500k-1m" />
                      <Label htmlFor="500k-1m">$500,000 - $1 million</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1m-plus" id="1m-plus" />
                      <Label htmlFor="1m-plus">$1 million+</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">8. When do you need to secure funding?</h3>
                  <RadioGroup defaultValue="1-3-months">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="immediately" id="immediately" />
                      <Label htmlFor="immediately">Immediately (urgent)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-3-months" id="1-3-months" />
                      <Label htmlFor="1-3-months">Within 1-3 months</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-6-months" id="3-6-months" />
                      <Label htmlFor="3-6-months">Within 3-6 months</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flexible" id="flexible" />
                      <Label htmlFor="flexible">Flexible timeline</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Founder Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">9. Founder information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Founder's Full Name" className="bg-white" />
                    <Input placeholder="Email Address" className="bg-white" />
                    <Input placeholder="Phone Number" className="bg-white" />
                    <Input placeholder="LinkedIn Profile URL" className="bg-white" />
                    <Input placeholder="Company Website" className="bg-white" />
                    <Input placeholder="Previous Funding Raised (if any)" className="bg-white" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 text-center">
                  <Button size="lg" type="submit" className="bg-qxnet hover:bg-qxnet-600 text-black py-6 px-8">
                    Submit funding request
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
