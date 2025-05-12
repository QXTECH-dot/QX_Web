"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, BarChart2, MapPin } from "lucide-react";
import Link from "next/link";
import '@/styles/svg-map.css';
import { companiesData } from "@/data/companiesData";
import { generateMapData } from "@/lib/mapDataUtils";
import { australianMapData } from "@/lib/australianMapData";
import type { Company } from "@/types/company";

// State name mapping
const stateNames: Record<string, string> = {
  "new-south-wales": "New South Wales",
  "victoria": "Victoria",
  "queensland": "Queensland",
  "western-australia": "Western Australia",
  "south-australia": "South Australia",
  "australian-capital-territory": "Australian Capital Territory",
  "tasmania": "Tasmania",
  "northern-territory": "Northern Territory"
};

// Types for map properties
interface MapLocationData {
  id: string;
  name: string;
  companies: number;
  companyData: Company[];
}

interface TooltipData {
  visible: boolean;
  x: number;
  y: number;
  content: string;
}

interface AustralianMapReactProps {
  selectedIndustry?: string;
  setSelectedIndustry?: (industry: string) => void;
  onStateSelect?: (state: string) => void;
}

export function AustralianMapReact({
  selectedIndustry = 'all',
  setSelectedIndustry = () => {},
  onStateSelect = () => {}
}: AustralianMapReactProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [stateData, setStateData] = useState<MapLocationData[]>([]);
  const [tooltip, setTooltip] = useState<TooltipData>({
    visible: false,
    x: 0,
    y: 0,
    content: ""
  });
  const mapRef = useRef<SVGSVGElement>(null);

  // Calculate company counts based on the selected industry
  const calculateCompanyCounts = (industry: string) => {
    const counts: Record<string, { count: number, companies: Company[] }> = {
      "new-south-wales": { count: 0, companies: [] },
      "victoria": { count: 0, companies: [] },
      "queensland": { count: 0, companies: [] },
      "western-australia": { count: 0, companies: [] },
      "south-australia": { count: 0, companies: [] },
      "australian-capital-territory": { count: 0, companies: [] },
      "tasmania": { count: 0, companies: [] },
      "northern-territory": { count: 0, companies: [] }
    };

    companiesData.forEach((company: Company) => {
      if (industry === 'all' || (company.industries && company.industries.includes(industry))) {
        const state = getStateFromLocation(company.location);
        if (state && counts[state]) {
          counts[state].count++;
          counts[state].companies.push(company);
        }
      }
    });

    return [
      { id: "new-south-wales", name: "New South Wales", companies: counts["new-south-wales"].count, companyData: counts["new-south-wales"].companies },
      { id: "victoria", name: "Victoria", companies: counts["victoria"].count, companyData: counts["victoria"].companies },
      { id: "queensland", name: "Queensland", companies: counts["queensland"].count, companyData: counts["queensland"].companies },
      { id: "western-australia", name: "Western Australia", companies: counts["western-australia"].count, companyData: counts["western-australia"].companies },
      { id: "south-australia", name: "South Australia", companies: counts["south-australia"].count, companyData: counts["south-australia"].companies },
      { id: "australian-capital-territory", name: "Australian Capital Territory", companies: counts["australian-capital-territory"].count, companyData: counts["australian-capital-territory"].companies },
      { id: "tasmania", name: "Tasmania", companies: counts["tasmania"].count, companyData: counts["tasmania"].companies },
      { id: "northern-territory", name: "Northern Territory", companies: counts["northern-territory"].count, companyData: counts["northern-territory"].companies }
    ];
  };

  // Gets CSS class for state based on company count
  const getStateClass = (stateId: string) => {
    if (selectedState === stateId) {
      return "svg-map__location svg-map__location--selected";
    }

    const state = stateData.find(s => s.id === stateId);
    if (!state) return "svg-map__location svg-map__location--low";

    if (state.companies === 0) {
      return "svg-map__location svg-map__location--low";
    } else if (state.companies < 5) {
      return "svg-map__location svg-map__location--medium-low";
    } else if (state.companies < 15) {
      return "svg-map__location svg-map__location--medium";
    } else {
      return "svg-map__location svg-map__location--high";
    }
  };

  // Handle mouse events
  const handleMouseEnter = (e: React.MouseEvent, stateId: string) => {
    const state = stateData.find(s => s.id === stateId);
    if (state) {
      setTooltip({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        content: `${state.name}: ${state.companies} companies`
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip.visible) {
      setTooltip(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY
      }));
    }
  };

  const handleStateClick = (stateId: string) => {
    setSelectedState(stateId);
    onStateSelect(stateId);
  };

  // Update state data when industry changes
  useEffect(() => {
    const newStateData = calculateCompanyCounts(selectedIndustry);
    setStateData(newStateData);
  }, [selectedIndustry]);

  return (
    <div className="relative">
      <div className="svg-map-container">
        <svg
          ref={mapRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          className="svg-map"
          onMouseMove={handleMouseMove}
        >
          <g transform="translate(100, 100) scale(0.8)">
            {/* Western Australia */}
            <path
              id="western-australia"
              d="M 150 200 C 180 180 200 150 250 120 C 300 90 350 80 400 100 C 450 120 480 150 450 200 C 420 250 400 300 350 350 C 300 400 250 450 200 500 C 150 450 120 400 100 350 C 80 300 100 250 150 200 Z"
              className={getStateClass("western-australia")}
              onClick={() => handleStateClick("western-australia")}
              onMouseEnter={(e) => handleMouseEnter(e, "western-australia")}
              onMouseLeave={handleMouseLeave}
              role="button"
              aria-label={`Western Australia: ${stateData.find(s => s.id === "western-australia")?.companies || 0} companies`}
              tabIndex={0}
            />

            {/* Northern Territory */}
            <path
              id="northern-territory"
              d="M 400 100 C 450 80 500 90 550 120 C 600 150 620 200 600 250 C 580 300 550 350 500 350 C 450 350 420 300 400 250 C 380 200 350 150 400 100 Z"
              className={getStateClass("northern-territory")}
              onClick={() => handleStateClick("northern-territory")}
              onMouseEnter={(e) => handleMouseEnter(e, "northern-territory")}
              onMouseLeave={handleMouseLeave}
              role="button"
              aria-label={`Northern Territory: ${stateData.find(s => s.id === "northern-territory")?.companies || 0} companies`}
              tabIndex={0}
            />

            {/* Queensland */}
            <path
              id="queensland"
              d="M 550 120 C 600 100 650 100 700 120 C 750 140 780 180 750 220 C 720 260 700 300 650 350 C 600 380 550 400 500 350 C 550 300 580 250 600 250 C 620 200 600 150 550 120 Z"
              className={getStateClass("queensland")}
              onClick={() => handleStateClick("queensland")}
              onMouseEnter={(e) => handleMouseEnter(e, "queensland")}
              onMouseLeave={handleMouseLeave}
              role="button"
              aria-label={`Queensland: ${stateData.find(s => s.id === "queensland")?.companies || 0} companies`}
              tabIndex={0}
            />

            {/* South Australia */}
            <path
              id="south-australia"
              d="M 350 350 C 400 300 450 350 500 350 C 500 400 480 450 450 500 C 420 550 380 580 350 550 C 320 520 300 480 300 450 C 300 420 320 380 350 350 Z"
              className={getStateClass("south-australia")}
              onClick={() => handleStateClick("south-australia")}
              onMouseEnter={(e) => handleMouseEnter(e, "south-australia")}
              onMouseLeave={handleMouseLeave}
              role="button"
              aria-label={`South Australia: ${stateData.find(s => s.id === "south-australia")?.companies || 0} companies`}
              tabIndex={0}
            />

            {/* New South Wales */}
            <path
              id="new-south-wales"
              d="M 500 350 C 550 400 600 380 650 350 C 700 400 720 450 700 480 C 680 510 650 520 600 500 C 550 480 520 450 500 400 C 500 380 500 370 500 350 Z"
              className={getStateClass("new-south-wales")}
              onClick={() => handleStateClick("new-south-wales")}
              onMouseEnter={(e) => handleMouseEnter(e, "new-south-wales")}
              onMouseLeave={handleMouseLeave}
              role="button"
              aria-label={`New South Wales: ${stateData.find(s => s.id === "new-south-wales")?.companies || 0} companies`}
              tabIndex={0}
            />

            {/* Victoria */}
            <path
              id="victoria"
              d="M 450 500 C 480 480 520 450 550 480 C 580 510 600 520 580 540 C 560 560 520 570 500 550 C 480 530 450 520 450 500 Z"
              className={getStateClass("victoria")}
              onClick={() => handleStateClick("victoria")}
              onMouseEnter={(e) => handleMouseEnter(e, "victoria")}
              onMouseLeave={handleMouseLeave}
              role="button"
              aria-label={`Victoria: ${stateData.find(s => s.id === "victoria")?.companies || 0} companies`}
              tabIndex={0}
            />

            {/* Tasmania */}
            <path
              id="tasmania"
              d="M 520 600 C 540 580 560 580 580 600 C 600 620 600 640 580 660 C 560 680 540 680 520 660 C 500 640 500 620 520 600 Z"
              className={getStateClass("tasmania")}
              onClick={() => handleStateClick("tasmania")}
              onMouseEnter={(e) => handleMouseEnter(e, "tasmania")}
              onMouseLeave={handleMouseLeave}
              role="button"
              aria-label={`Tasmania: ${stateData.find(s => s.id === "tasmania")?.companies || 0} companies`}
              tabIndex={0}
            />

            {/* Australian Capital Territory - small circle for Canberra */}
            <circle
              id="australian-capital-territory"
              cx="580"
              cy="500"
              r="5"
              className={getStateClass("australian-capital-territory")}
              onClick={() => handleStateClick("australian-capital-territory")}
              onMouseEnter={(e) => handleMouseEnter(e, "australian-capital-territory")}
              onMouseLeave={handleMouseLeave}
              role="button"
              aria-label={`Australian Capital Territory: ${stateData.find(s => s.id === "australian-capital-territory")?.companies || 0} companies`}
              tabIndex={0}
            />

            {/* Add city markers */}
            <g className="city-markers">
              <circle cx="570" cy="490" r="2" fill="#000" />
              <text x="575" y="485" fontSize="12" fill="#000">Sydney</text>

              <circle cx="520" cy="540" r="2" fill="#000" />
              <text x="525" y="535" fontSize="12" fill="#000">Melbourne</text>

              <circle cx="650" cy="300" r="2" fill="#000" />
              <text x="655" y="295" fontSize="12" fill="#000">Brisbane</text>

              <circle cx="180" cy="350" r="2" fill="#000" />
              <text x="185" y="345" fontSize="12" fill="#000">Perth</text>

              <circle cx="350" cy="450" r="2" fill="#000" />
              <text x="355" y="445" fontSize="12" fill="#000">Adelaide</text>

              <circle cx="500" cy="200" r="2" fill="#000" />
              <text x="505" y="195" fontSize="12" fill="#000">Darwin</text>

              <circle cx="550" cy="630" r="2" fill="#000" />
              <text x="555" y="625" fontSize="12" fill="#000">Hobart</text>

              <circle cx="580" cy="500" r="2" fill="#000" />
              <text x="585" y="495" fontSize="12" fill="#000">Canberra</text>
            </g>

            {/* Add ocean labels */}
            <g className="ocean-labels">
              <text x="200" y="300" fontSize="14" fill="#0077be" fontStyle="italic">Indian Ocean</text>
              <text x="650" y="200" fontSize="14" fill="#0077be" fontStyle="italic">Pacific Ocean</text>
              <text x="600" y="700" fontSize="14" fill="#0077be" fontStyle="italic">Tasman Sea</text>
            </g>
          </g>
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="tooltip visible"
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

// Add this helper function at the top of the file after the imports
function getStateFromLocation(location: string): string | null {
  const locationLower = location.toLowerCase();
  if (locationLower.includes('new south wales') || locationLower.includes('sydney')) {
    return 'new-south-wales';
  } else if (locationLower.includes('victoria') || locationLower.includes('melbourne')) {
    return 'victoria';
  } else if (locationLower.includes('queensland') || locationLower.includes('brisbane')) {
    return 'queensland';
  } else if (locationLower.includes('western australia') || locationLower.includes('perth')) {
    return 'western-australia';
  } else if (locationLower.includes('south australia') || locationLower.includes('adelaide')) {
    return 'south-australia';
  } else if (locationLower.includes('tasmania') || locationLower.includes('hobart')) {
    return 'tasmania';
  } else if (locationLower.includes('northern territory') || locationLower.includes('darwin')) {
    return 'northern-territory';
  } else if (locationLower.includes('australian capital territory') || locationLower.includes('act') || locationLower.includes('canberra')) {
    return 'australian-capital-territory';
  }
  return null;
}
