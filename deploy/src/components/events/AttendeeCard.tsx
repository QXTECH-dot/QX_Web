"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Briefcase, Tag } from "lucide-react";
import { Attendee } from "@/types/event";

interface AttendeeCardProps {
  attendee: Attendee;
}

const AttendeeCard: React.FC<AttendeeCardProps> = ({ attendee }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div className="w-16 h-16 relative flex-shrink-0">
          <Image
            src={attendee.companyLogo}
            alt={attendee.companyName}
            fill
            className="object-contain rounded-lg"
          />
        </div>

        {/* Attendee details */}
        <div className="flex-grow">
          <h3 className="font-bold text-lg">{attendee.name}</h3>

          <div className="flex items-center text-gray-600 mb-2">
            <Briefcase className="h-4 w-4 mr-1" />
            <span className="text-sm">{attendee.position} at </span>
            <Link
              href={`/company/${attendee.companyId}`}
              className="text-sm font-medium text-qxnet hover:underline ml-1"
            >
              {attendee.companyName}
            </Link>
          </div>

          <div className="mb-3">
            <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs mr-1">
              {attendee.industry}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{attendee.businessSummary}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-auto">
            {attendee.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-qxnet-50 text-qxnet-700 text-xs rounded-full"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeCard;
