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

export function FormSection() {
  return (
    <div className="bg-background py-12">
      <div className="container max-w-4xl">
        <div className="mb-12 text-center">
          <div className="w-20 h-20 bg-white rounded-lg mx-auto mb-6 flex items-center justify-center shadow-sm">
            <Image
              src="https://ext.same-assets.com/1651653002/3123620635.png"
              alt="Submit Project"
              width={45}
              height={45}
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Submit <span className="text-primary">your project</span> requirements & Match<br />
            with the right technical partner
          </h1>
          <p className="text-lg text-muted-foreground">
            Answer these 9 simple questions. Based on your inputs we will select and send you the best matching
            IT companies for your project.
          </p>

          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span>Handpicked companies</span>
            <span>•</span>
            <span>No obligation to hire</span>
            <span>•</span>
            <span>100% risk-free</span>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <form>
              <div className="space-y-8">
                {/* Project Title */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">1. Project Title</h3>
                  <p className="text-muted-foreground mb-4">
                    A concise and descriptive name for the project. Example: Design and development of an e-commerce website.
                  </p>
                  <Input
                    placeholder="Enter your project title..."
                    className="bg-white"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">2. Please describe your project in as many details as possible. This is important!</h3>
                  <Textarea
                    placeholder="Enter your project description..."
                    className="min-h-[200px] bg-white"
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    Characters count: 0 / 3500
                  </div>

                  <div className="mt-4">
                    <p className="text-muted-foreground mb-2">
                      Upload any related documents you have for the project.
                      10 MB. Max file size. Multiple files allowed.
                    </p>
                    <div className="border border-dashed rounded-md p-4 text-center bg-white">
                      <Button variant="outline" type="button" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload docs 10 MB Max
                      </Button>
                      <div className="text-xs text-muted-foreground mt-1">
                        PDF, Doc, Docx, JPG
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Needed */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">3. What service(s) do you need? (up to 3)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="web-dev" />
                      <Label htmlFor="web-dev">Web Development</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="software-dev" />
                      <Label htmlFor="software-dev">Software Development</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="design" />
                      <Label htmlFor="design">Design</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="business-services" />
                      <Label htmlFor="business-services">Business Services</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="advertising" />
                      <Label htmlFor="advertising">Advertising</Label>
                    </div>
                  </div>
                </div>

                {/* Technical Preferences */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">4. Perfect! Any technical preferences?</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="not-sure" />
                    <Label htmlFor="not-sure">Not sure</Label>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">5. Where should the company be located? (Multiple choice)</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="location-flexible" />
                    <Label htmlFor="location-flexible">I'm location flexible</Label>
                  </div>
                </div>

                {/* Project Stage */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">6. At what stage is your project right now?</h3>
                  <RadioGroup defaultValue="planning">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="planning" id="planning" />
                      <Label htmlFor="planning">Planning stage. Defining the project</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="first-steps" id="first-steps" />
                      <Label htmlFor="first-steps">Looking for an IT company. First steps in talks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="requirements-ready" id="requirements-ready" />
                      <Label htmlFor="requirements-ready">Project requirements are ready. Exploring the offers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="functional" id="functional" />
                      <Label htmlFor="functional">It's already functional, but need to bring it to a new level</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-primary/10 p-6 rounded-md text-center">
                  <h4 className="text-lg font-semibold mb-2">Well done!</h4>
                  <p className="text-muted-foreground">A few more general details about your project</p>
                </div>

                {/* Start Date */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">7. When do you want to start the project?</h3>
                  <RadioGroup defaultValue="this-week">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="this-week" id="this-week" />
                      <Label htmlFor="this-week">This week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="this-month" id="this-month" />
                      <Label htmlFor="this-month">This month</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="within-3-months" id="within-3-months" />
                      <Label htmlFor="within-3-months">Within 3 months</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Budget */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">8. The approximate project budget</h3>
                  <RadioGroup defaultValue="15000">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1000" id="budget-1000" />
                      <Label htmlFor="budget-1000">$1,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="15000" id="budget-15000" />
                      <Label htmlFor="budget-15000">$15,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="35000" id="budget-35000" />
                      <Label htmlFor="budget-35000">$35,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="100000-plus" id="budget-100000-plus" />
                      <Label htmlFor="budget-100000-plus">$100,000+</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not-sure" id="budget-not-sure" />
                      <Label htmlFor="budget-not-sure">Not sure. Leave it on the companies to offer</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">9. A few details about yourself</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Your Name" className="bg-white" />
                    <Input placeholder="Your Email Address" className="bg-white" />
                    <Input placeholder="Your Current Website" className="bg-white" />
                    <Input placeholder="Your Phone Number" className="bg-white" />
                    <Input placeholder="Your role within the company" className="bg-white" />
                    <Input placeholder="Where is your company located" className="bg-white" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 text-center">
                  <Button size="lg" type="submit" className="bg-primary text-white py-6 px-6">
                    Submit request
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
