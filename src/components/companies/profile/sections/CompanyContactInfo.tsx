"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  Phone,
  Mail,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatABN } from "@/utils/abnFormat";
import { Company, OfficeType } from "../types";
import { formatLanguages } from "../constants";

interface CompanyContactInfoProps {
  company: Company;
  selectedOffice: OfficeType | null;
}

export function CompanyContactInfo({
  company,
  selectedOffice,
}: CompanyContactInfoProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-xl font-bold mb-4">Contact Information</h2>
      <div className="space-y-4">
        <div className="flex items-start">
          <Globe className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground mb-1">Website</p>
            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {company.website.replace("https://", "")}
              </a>
            ) : (
              <span className="text-muted-foreground">Not provided</span>
            )}
          </div>
        </div>

        {selectedOffice && (
          <>
            {selectedOffice.contactPerson && (
              <div className="flex items-start">
                <User className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Contact Person
                  </p>
                  <span className="text-gray-900">
                    {selectedOffice.contactPerson}
                  </span>
                </div>
              </div>
            )}

            {selectedOffice.phone ? (
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <a
                    href={`tel:${selectedOffice.phone}`}
                    className="text-primary hover:underline"
                  >
                    {selectedOffice.phone}
                  </a>
                </div>
              </div>
            ) : company.phone ? (
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <a
                    href={`tel:${company.phone}`}
                    className="text-primary hover:underline"
                  >
                    {company.phone}
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <span className="text-muted-foreground">Not provided</span>
                </div>
              </div>
            )}

            {selectedOffice.email ? (
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a
                    href={`mailto:${selectedOffice.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedOffice.email}
                  </a>
                </div>
              </div>
            ) : company.email ? (
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a
                    href={`mailto:${company.email}`}
                    className="text-primary hover:underline"
                  >
                    {company.email}
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <span className="text-muted-foreground">Not provided</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t my-4 pt-4">
        <h3 className="font-semibold mb-3">Company Facts</h3>
        <div className="space-y-2">
          {company.abn && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">ABN</span>
              <span>{formatABN(company.abn)}</span>
            </div>
          )}
          {company.foundedYear && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Founded</span>
              <span>{company.foundedYear}</span>
            </div>
          )}
          {(company.teamSize || company.employeeCount) && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Employees</span>
              <span>{company.teamSize || company.employeeCount}</span>
            </div>
          )}
          {company.languages && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Languages</span>
              <span>{formatLanguages(company.languages)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t my-4 pt-4">
        <h3 className="font-semibold mb-3">Social Media</h3>
        <div className="flex space-x-4">
          {company.social?.facebook && (
            <Link
              href={company.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary"
            >
              <Facebook className="h-5 w-5" />
            </Link>
          )}
          {company.social?.twitter && (
            <Link
              href={company.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary"
            >
              <Twitter className="h-5 w-5" />
            </Link>
          )}
          {company.social?.linkedin && (
            <Link
              href={company.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          )}
          {company.social?.instagram && (
            <Link
              href={company.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary"
            >
              <Instagram className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
