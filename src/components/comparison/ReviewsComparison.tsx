"use client";

import React from 'react';
import { useComparison } from './ComparisonContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface RatingMetric {
  id: string;
  label: string;
}

const ratingMetrics: RatingMetric[] = [
  { id: 'overall', label: 'Overall Rating' },
  { id: 'quality', label: 'Quality of Work' },
  { id: 'schedule', label: 'Schedule Adherence' },
  { id: 'cost', label: 'Cost Efficiency' },
  { id: 'communication', label: 'Communication' },
  { id: 'expertise', label: 'Technical Expertise' },
];

// Utility function to calculate overall rating
function calculateOverallRating(reviews: { rating: number }[] | undefined): number {
  if (!reviews || reviews.length === 0) return 0;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((total / reviews.length).toFixed(1));
}

// Get simulated ratings for each metric
function getSimulatedRatings(company: any): Record<string, number> {
  // Use the company's reviews if available, otherwise generate random ratings
  const overallRating = calculateOverallRating(company.reviews);

  if (overallRating === 0) {
    return ratingMetrics.reduce((acc, metric) => {
      acc[metric.id] = 0;
      return acc;
    }, {} as Record<string, number>);
  }

  // Create simulated ratings based on overall rating with some variation
  const baseRating = overallRating;

  return {
    overall: baseRating,
    quality: Math.min(5, Math.max(1, baseRating + (Math.random() * 0.6 - 0.3))),
    schedule: Math.min(5, Math.max(1, baseRating + (Math.random() * 0.6 - 0.3))),
    cost: Math.min(5, Math.max(1, baseRating + (Math.random() * 0.6 - 0.3))),
    communication: Math.min(5, Math.max(1, baseRating + (Math.random() * 0.6 - 0.3))),
    expertise: Math.min(5, Math.max(1, baseRating + (Math.random() * 0.6 - 0.3))),
  };
}

// Render star rating
function StarRating({ rating }: { rating: number }) {
  if (rating === 0) {
    return <span className="text-gray-400 text-sm">No ratings yet</span>;
  }

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : star <= rating + 0.5
              ? 'text-yellow-400 fill-yellow-400 opacity-50'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

export function ReviewsComparison() {
  const { selectedCompanies } = useComparison();

  // Only show if there are companies selected
  if (selectedCompanies.length === 0) {
    return null;
  }

  // Get ratings for each company
  const companyRatings = selectedCompanies.map(company => ({
    company,
    ratings: getSimulatedRatings(company),
  }));

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Ratings & Reviews Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium py-2">Rating Metric</th>
                {selectedCompanies.map(company => (
                  <th key={company.id} className="text-center py-2">
                    <div className="max-w-[150px] mx-auto">
                      <div className="truncate font-medium">{company.name}</div>
                      <div className="text-xs text-gray-500 truncate">{company.reviews?.length || 0} reviews</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ratingMetrics.map(metric => (
                <tr key={metric.id} className="border-b">
                  <td className="py-3 font-medium">{metric.label}</td>
                  {companyRatings.map(({ company, ratings }) => (
                    <td key={`${company.id}-${metric.id}`} className="py-3 text-center">
                      <StarRating rating={ratings[metric.id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Review Excerpts */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Client Feedback Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedCompanies.map(company => (
              <div key={`reviews-${company.id}`} className="border rounded-md p-4">
                <h4 className="font-medium mb-2">{company.name}</h4>
                {company.reviews && company.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {company.reviews.slice(0, 2).map((review, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex items-center mb-1">
                          <StarRating rating={review.rating} />
                          <span className="ml-auto text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 italic">"{review.text.length > 120 ? review.text.substring(0, 120) + '...' : review.text}"</p>
                        <p className="text-gray-500 text-xs mt-1">- {review.author}, {review.company}</p>
                      </div>
                    ))}
                    {company.reviews.length > 2 && (
                      <div className="text-sm text-primary cursor-pointer hover:underline">
                        + {company.reviews.length - 2} more reviews
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No reviews available</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
