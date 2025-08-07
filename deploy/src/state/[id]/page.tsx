import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { companiesData } from '@/data/companiesData';
import { ArrowLeft, Building2, ChevronRight, MapPin } from 'lucide-react';
import { CompanyCard } from '@/components/companies/CompanyCard';

// Map state IDs to names
const stateNames = {
  "australian-capital-territory": "Australian Capital Territory",
  "new-south-wales": "New South Wales",
  "northern-territory": "Northern Territory",
  "queensland": "Queensland",
  "south-australia": "South Australia",
  "tasmania": "Tasmania",
  "victoria": "Victoria",
  "western-australia": "Western Australia",
};

// This is necessary for static site generation
export function generateStaticParams() {
  return Object.keys(stateNames).map((id) => ({
    id,
  }));
}

export default function StatePage({ params }: { params: { id: string } }) {
  const stateId = params.id;
  const stateName = stateNames[stateId as keyof typeof stateNames] || "Unknown State";

  // Filter companies for this state
  const stateCompanies = companiesData.filter(company => {
    const location = company.location;

    if (stateId === "australian-capital-territory") {
      return location.includes("Canberra") || location.includes("ACT") || location.includes("Australian Capital Territory");
    } else if (stateId === "new-south-wales") {
      return location.includes("Sydney") || location.includes("New South Wales");
    } else if (stateId === "northern-territory") {
      return location.includes("Darwin") || location.includes("Northern Territory");
    } else if (stateId === "queensland") {
      return location.includes("Brisbane") || location.includes("Queensland");
    } else if (stateId === "south-australia") {
      return location.includes("Adelaide") || location.includes("South Australia");
    } else if (stateId === "tasmania") {
      return location.includes("Hobart") || location.includes("Tasmania");
    } else if (stateId === "victoria") {
      return location.includes("Melbourne") || location.includes("Victoria");
    } else if (stateId === "western-australia") {
      return location.includes("Perth") || location.includes("Western Australia");
    }

    return false;
  });

  // Determine state image based on ID
  const getStateImage = () => {
    const stateImages = {
      "new-south-wales": "https://ext.same-assets.com/1694792166/nsw.jpg",
      "victoria": "https://ext.same-assets.com/1694792166/victoria.jpg",
      "queensland": "https://ext.same-assets.com/1694792166/queensland.jpg",
      "western-australia": "https://ext.same-assets.com/1694792166/wa.jpg",
      "south-australia": "https://ext.same-assets.com/1694792166/sa.jpg",
      "australian-capital-territory": "https://ext.same-assets.com/1694792166/act.jpg",
      "tasmania": "https://ext.same-assets.com/1694792166/tasmania.jpg",
      "northern-territory": "https://ext.same-assets.com/1694792166/nt.jpg"
    };

    return stateImages[stateId] || "https://ext.same-assets.com/1694792166/australia-map.png";
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-qxnet-600 hover:text-qxnet-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Australia Map
        </Link>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3">
            <div className="rounded-lg overflow-hidden shadow-md">
              <Image
                src={getStateImage()}
                alt={stateName}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-white">
                <div className="flex items-center mb-2">
                  <MapPin className="h-5 w-5 text-qxnet mr-2" />
                  <h1 className="text-xl font-bold">{stateName}</h1>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>{stateCompanies.length} companies</span>
                </div>
                <p className="text-sm text-gray-500">
                  Browse the top companies in {stateName} and find the perfect partner for your project.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-2">Companies in {stateName}</h2>
            <p className="text-gray-600 mb-6">
              Find and compare the best tech companies in {stateName}. Filter by industry, sort by rating, and discover your perfect match.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Filter by industry:</p>
                <div className="px-3 py-2 border border-gray-200 rounded-md text-sm">
                  Use the client-side filters when viewing on the live site
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {stateCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stateCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-gray-50 rounded-lg">
          <div className="mb-4">
            <Building2 className="h-12 w-12 mx-auto text-gray-300" />
          </div>
          <h3 className="text-xl font-medium mb-2">No companies found</h3>
          <p className="text-gray-500 mb-4">
            We couldn't find any companies in {stateName}.
          </p>
        </div>
      )}

      <div className="mt-12 py-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Explore More Regions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(stateNames).map(([id, name]) => (
            id !== stateId && (
              <Link
                href={`/state/${id}`}
                key={id}
                className="flex items-center p-3 bg-white border border-gray-100 rounded-md hover:border-qxnet-200 hover:shadow-sm transition-all text-sm"
              >
                {name}
                <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
              </Link>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
