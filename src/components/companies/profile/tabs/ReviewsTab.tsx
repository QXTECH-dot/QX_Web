"use client";

import React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReviewType } from "../types";

interface ReviewsTabProps {
  reviews: ReviewType[] | undefined;
}

export function ReviewsTab({ reviews }: ReviewsTabProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Client Reviews</h2>
        <Button variant="outline">Write a Review</Button>
      </div>

      {reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review: ReviewType, index: number) => (
            <Card key={index} className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{review.author}</h3>
                  <p className="text-sm text-muted-foreground">
                    {review.company}
                  </p>
                </div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-2">{review.text}</p>
              <p className="text-xs text-muted-foreground">
                Posted on {new Date(review.date).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-10">
          No reviews yet. Be the first to leave a review!
        </p>
      )}
    </div>
  );
}
