"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Info, Upload } from 'lucide-react';

interface FormData {
  companyName: string;
  industry: string;
  yearFounded: string;
  companySize: string;
  companyWebsite: string;
  companyDescription: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactPosition: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  services: string;
  specialization: string;
  clientTypes: string[];
  certifications: string;
  isAcceptingTerms: boolean;
}

export default function GetListedPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Company Information
    companyName: '',
    industry: '',
    yearFounded: '',
    companySize: '',
    companyWebsite: '',
    companyDescription: '',

    // Contact Information
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactPosition: '',

    // Location
    address: '',
    city: '',
    state: '',
    postcode: '',

    // Additional Information
    services: '',
    specialization: '',
    clientTypes: [],
    certifications: '',
    isAcceptingTerms: false
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle client type checkbox changes
  const handleClientTypeChange = (type: string) => {
    const currentClientTypes = [...formData.clientTypes];

    if (currentClientTypes.includes(type)) {
      // Remove type if already selected
      const updatedTypes = currentClientTypes.filter(t => t !== type);
      setFormData({
        ...formData,
        clientTypes: updatedTypes
      });
    } else {
      // Add type if not already selected
      setFormData({
        ...formData,
        clientTypes: [...currentClientTypes, type]
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would be an API call to submit the data
      console.log('Submitted data:', formData);

      // Navigate to success page or show success message
      setCurrentStep(4); // Success step
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Next step function
  const goToNextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
    window.scrollTo(0, 0);
  };

  // Previous step function
  const goToPreviousStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  // Render the progress bar
  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between">
          <div className={`flex-1 text-center ${currentStep >= 1 ? 'text-qxnet font-medium' : 'text-gray-400'}`}>
            Company Information
          </div>
          <div className={`flex-1 text-center ${currentStep >= 2 ? 'text-qxnet font-medium' : 'text-gray-400'}`}>
            Contact Details
          </div>
          <div className={`flex-1 text-center ${currentStep >= 3 ? 'text-qxnet font-medium' : 'text-gray-400'}`}>
            Review & Submit
          </div>
        </div>
        <div className="w-full bg-gray-200 h-2 mt-3 rounded-full overflow-hidden">
          <div
            className="bg-qxnet h-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Your Company Listed on QX Web</h1>
              <p className="text-gray-600">
                Join Australia's premier business directory and connect with potential clients.
              </p>
            </div>

            {currentStep < 4 && renderProgressBar()}

            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <form>
                <h2 className="text-xl font-semibold mb-6">Company Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name*
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry*
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    >
                      <option value="">Select Industry</option>
                      <option value="agriculture-forestry-fishing">Agriculture, Forestry and Fishing</option>
                      <option value="mining">Mining</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="electricity-gas-water-waste">Electricity, Gas, Water and Waste Services</option>
                      <option value="construction">Construction</option>
                      <option value="wholesale-trade">Wholesale Trade</option>
                      <option value="retail-trade">Retail Trade</option>
                      <option value="accommodation-food">Accommodation and Food Services</option>
                      <option value="transport-postal-warehousing">Transport, Postal and Warehousing</option>
                      <option value="information-media-telecommunications">Information Media and Telecommunications</option>
                      <option value="financial-insurance">Financial and Insurance Services</option>
                      <option value="rental-hiring-real-estate">Rental, Hiring and Real Estate Services</option>
                      <option value="professional-scientific-technical">Professional, Scientific and Technical Services</option>
                      <option value="administrative-support">Administrative and Support Services</option>
                      <option value="public-administration-safety">Public Administration and Safety</option>
                      <option value="education-training">Education and Training</option>
                      <option value="health-care-social-assistance">Health Care and Social Assistance</option>
                      <option value="arts-recreation">Arts and Recreation Services</option>
                      <option value="other-services">Other Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year Founded
                    </label>
                    <input
                      type="number"
                      name="yearFounded"
                      value={formData.yearFounded}
                      onChange={handleInputChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Size*
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    >
                      <option value="">Select Company Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Website*
                    </label>
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      required
                      placeholder="https://www.example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Description*
                  </label>
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Tell us about your company, what you do, and what makes you stand out..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-qxnet hover:bg-qxnet-600 text-black px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <form>
                <h2 className="text-xl font-semibold mb-6">Contact & Location Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name*
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Position*
                    </label>
                    <input
                      type="text"
                      name="contactPosition"
                      value={formData.contactPosition}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email*
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Phone*
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-medium mb-4">Business Location</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address*
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State*
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      <option value="NSW">New South Wales</option>
                      <option value="VIC">Victoria</option>
                      <option value="QLD">Queensland</option>
                      <option value="WA">Western Australia</option>
                      <option value="SA">South Australia</option>
                      <option value="TAS">Tasmania</option>
                      <option value="ACT">Australian Capital Territory</option>
                      <option value="NT">Northern Territory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postcode*
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      required
                      maxLength={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-qxnet focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goToNextStep}
                    className="bg-qxnet hover:bg-qxnet-600 text-black px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-semibold mb-6">Review & Submit</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3">Company Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Company Name</p>
                        <p className="font-medium">{formData.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Industry</p>
                        <p className="font-medium">{formData.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Year Founded</p>
                        <p className="font-medium">{formData.yearFounded || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company Size</p>
                        <p className="font-medium">{formData.companySize}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Website</p>
                        <p className="font-medium">{formData.companyWebsite}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium">{formData.companyDescription}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Contact Name</p>
                        <p className="font-medium">{formData.contactName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Position</p>
                        <p className="font-medium">{formData.contactPosition}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{formData.contactEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{formData.contactPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3">Location</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{formData.address}</p>
                    <p className="font-medium">{formData.city}, {formData.state} {formData.postcode}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="isAcceptingTerms"
                        type="checkbox"
                        checked={formData.isAcceptingTerms}
                        onChange={handleInputChange}
                        required
                        className="h-4 w-4 text-qxnet focus:ring-qxnet border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="font-medium text-gray-700">I agree to the terms and conditions*</label>
                      <p className="text-gray-500">
                        By submitting this form, I agree to QX Web's <Link href="/terms" className="text-qxnet hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-qxnet hover:underline">Privacy Policy</Link>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.isAcceptingTerms}
                    className={`bg-qxnet hover:bg-qxnet-600 text-black px-6 py-2 rounded-md font-medium transition-colors ${
                      (isSubmitting || !formData.isAcceptingTerms) && "opacity-70 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: Success */}
            {currentStep === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
                <p className="text-gray-600 mb-6">
                  Your application has been successfully submitted. Our team will review your details and get back to you shortly.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg mb-8 inline-block text-left">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">What happens next?</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Our team will review your application (usually within 2-3 business days).</li>
                          <li>We may contact you for additional information or verification.</li>
                          <li>Once approved, your company will be listed on QX Web.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Link
                    href="/"
                    className="bg-qxnet hover:bg-qxnet-600 text-black px-6 py-2 rounded-md font-medium transition-colors inline-block"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
