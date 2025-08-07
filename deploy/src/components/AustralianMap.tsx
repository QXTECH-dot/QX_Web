"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { companiesData } from "@/data/companiesData";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import '@/styles/svg-map.css';
import { MapLoader } from "./MapLoader";
import { AustralianMapFallback } from "./AustralianMapFallback";
import { AustralianMapFilters } from "./AustralianMapFilters";

// Dynamically import the SVGMap component with no SSR and error handling
const SVGMap = dynamic(
  () => import('react-svg-map').then(mod => mod.SVGMap).catch(err => {
    console.error("Failed to load SVGMap component:", err);
    return null;
  }),
  {
    ssr: false,
    loading: () => <MapLoader />
  }
);

// Dynamically import Australia map
const Australia = dynamic(
  () => import('@svg-maps/australia').then(mod => {
    // Handle both ESM and CommonJS module formats
    return mod.default || mod;
  }).catch(err => {
    console.error("Failed to load Australia map data:", err);
    return null;
  }),
  {
    ssr: false,
    loading: () => <MapLoader />
  }
);

// Define Australian states and territories with coordinates for pins
const australianStates = {
  "australian-capital-territory": {
    name: "Australian Capital Territory",
    count: 0,
    companies: [],
    coordinates: { x: 660, y: 400 } // Approximate center for ACT
  },
  "new-south-wales": {
    name: "New South Wales",
    count: 0,
    companies: [],
    coordinates: { x: 630, y: 350 } // Approximate center for NSW
  },
  "northern-territory": {
    name: "Northern Territory",
    count: 0,
    companies: [],
    coordinates: { x: 400, y: 200 } // Approximate center for NT
  },
  "queensland": {
    name: "Queensland",
    count: 0,
    companies: [],
    coordinates: { x: 550, y: 220 } // Approximate center for QLD
  },
  "south-australia": {
    name: "South Australia",
    count: 0,
    companies: [],
    coordinates: { x: 350, y: 350 } // Approximate center for SA
  },
  "tasmania": {
    name: "Tasmania",
    count: 0,
    companies: [],
    coordinates: { x: 500, y: 550 } // Approximate center for TAS
  },
  "victoria": {
    name: "Victoria",
    count: 0,
    companies: [],
    coordinates: { x: 500, y: 450 } // Approximate center for VIC
  },
  "western-australia": {
    name: "Western Australia",
    count: 0,
    companies: [],
    coordinates: { x: 200, y: 300 } // Approximate center for WA
  },
};

export function AustralianMap() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [stateCompanyCounts, setStateCompanyCounts] = useState(australianStates);
  const [filteredCounts, setFilteredCounts] = useState(australianStates);
  const [tooltip, setTooltip] = useState({ visible: false, content: "", x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [australiaMap, setAustraliaMap] = useState<any>(null);
  const [hasError, setHasError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [touchStarted, setTouchStarted] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Reset the selected state
  const resetSelection = () => {
    setSelectedState(null);
  };

  // Load the map and calculate company counts
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    setIsMounted(true);

    // Calculate companies per state with industry info
    const counts = JSON.parse(JSON.stringify(australianStates));

    companiesData.forEach(company => {
      // Extract state from location (e.g., "Sydney, Australia" -> "New South Wales")
      const location = company.location;
      let stateKey = "";

      if (location.includes("Sydney") || location.includes("New South Wales")) {
        stateKey = "new-south-wales";
      } else if (location.includes("Melbourne") || location.includes("Victoria")) {
        stateKey = "victoria";
      } else if (location.includes("Brisbane") || location.includes("Queensland")) {
        stateKey = "queensland";
      } else if (location.includes("Perth") || location.includes("Western Australia")) {
        stateKey = "western-australia";
      } else if (location.includes("Adelaide") || location.includes("South Australia")) {
        stateKey = "south-australia";
      } else if (location.includes("Hobart") || location.includes("Tasmania")) {
        stateKey = "tasmania";
      } else if (location.includes("Darwin") || location.includes("Northern Territory")) {
        stateKey = "northern-territory";
      } else if (location.includes("Canberra") || location.includes("ACT") || location.includes("Australian Capital Territory")) {
        stateKey = "australian-capital-territory";
      }

      if (stateKey) {
        counts[stateKey].count++;
        counts[stateKey].companies.push(company);
      }
    });

    setStateCompanyCounts(counts);
    setFilteredCounts(counts);

    // Load the Australia map
    const loadMap = async () => {
      try {
        // Increase load attempts counter
        setLoadAttempts(prev => prev + 1);

        // Use Promise with timeout to handle potential hanging imports
        const mapPromise = import('@svg-maps/australia');
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Map loading timeout")), 5000)
        );

        const map = await Promise.race([mapPromise, timeoutPromise])
          .catch(e => {
            console.error("Error loading Australia map:", e);
            setHasError(true);
            return null;
          });

        if (map) {
          // Handle both ESM and CommonJS module formats
          setAustraliaMap(map.default || map);
          setIsLoading(false);
          setHasError(false);

          // Set map as ready after a short delay
          setTimeout(() => {
            setMapReady(true);
          }, 500);
        } else {
          console.error("Failed to load Australia map");
          setIsLoading(false);
          setHasError(true);
        }
      } catch (error) {
        console.error("Error in map loading process:", error);
        setIsLoading(false);
        setHasError(true);
      }
    };

    loadMap();

    // Cleanup
    return () => {
      setMapReady(false);
    };
  }, [loadAttempts]);

  // Filter companies by industry
  useEffect(() => {
    if (selectedIndustry === "all") {
      setFilteredCounts(stateCompanyCounts);
      return;
    }

    const filtered = JSON.parse(JSON.stringify(australianStates));

    Object.keys(stateCompanyCounts).forEach(stateKey => {
      const state = stateCompanyCounts[stateKey as keyof typeof stateCompanyCounts];
      const filteredCompanies = state.companies.filter(company => {
        // Match industry to services array in company
        return company.services && company.services.some((service: string) =>
          service.toLowerCase().includes(selectedIndustry.replace("-", " "))
        );
      });

      filtered[stateKey].companies = filteredCompanies;
      filtered[stateKey].count = filteredCompanies.length;
    });

    setFilteredCounts(filtered);
  }, [selectedIndustry, stateCompanyCounts]);

  // Manual retry function
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setLoadAttempts(prev => prev + 1);
  };

  // Add effect to highlight the selected state path
  useEffect(() => {
    if (!isMounted || !selectedState || !mapReady) return;

    // Apply pulse animation to selected state
    try {
      const selectedPath = document.getElementById(selectedState);
      if (selectedPath) {
        selectedPath.classList.add('selected-pulse');

        // Scroll to info panel if it's below the fold
        const infoPanel = document.getElementById('state-info-panel');
        if (infoPanel) {
          infoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    } catch (error) {
      console.error("Error applying highlight:", error);
    }

    return () => {
      try {
        const selectedPath = document.getElementById(selectedState);
        if (selectedPath) {
          selectedPath.classList.remove('selected-pulse');
        }
      } catch (error) {
        console.error("Error removing highlight:", error);
      }
    };
  }, [selectedState, isMounted, mapReady]);

  const handleLocationMouseOver = (event: any) => {
    try {
      const locationId = event.currentTarget.getAttribute("id");
      if (locationId && locationId in filteredCounts) {
        const state = filteredCounts[locationId as keyof typeof filteredCounts];
        const content = `${state.name}: ${state.count} companies`;

        // Get coordinates relative to the map container
        const rect = mapContainerRef.current?.getBoundingClientRect();
        const offsetX = rect ? event.clientX - rect.left : event.clientX;
        const offsetY = rect ? event.clientY - rect.top : event.clientY;

        setTooltip({
          visible: true,
          content,
          x: event.clientX,
          y: event.clientY
        });
      }
    } catch (error) {
      console.error("Error in mouse over handler:", error);
    }
  };

  // Touch event handlers for mobile
  const handleTouchStart = (event: React.TouchEvent, locationId: string) => {
    setTouchStarted(true);
    if (locationId && locationId in filteredCounts) {
      const state = filteredCounts[locationId as keyof typeof filteredCounts];
      const content = `${state.name}: ${state.count} companies`;
      const touch = event.touches[0];

      setTooltip({
        visible: true,
        content,
        x: touch.clientX,
        y: touch.clientY
      });
    }
  };

  const handleTouchEnd = (event: React.TouchEvent, locationId: string) => {
    // Only register as a click if it was a short tap, not a scroll/pan
    if (touchStarted) {
      handleLocationClick({ currentTarget: { getAttribute: () => locationId } });
      setTouchStarted(false);
    }
    setTooltip({ ...tooltip, visible: false });
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (tooltip.visible) {
      const touch = event.touches[0];
      setTooltip({
        ...tooltip,
        x: touch.clientX,
        y: touch.clientY
      });
    }
  };

  const handleLocationMouseOut = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const handleLocationMouseMove = (event: any) => {
    if (!tooltip.visible) return;

    setTooltip({
      ...tooltip,
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleLocationClick = (event: any) => {
    try {
      const locationId = event.currentTarget.getAttribute("id");
      const isCurrentlySelected = selectedState === locationId;

      // Toggle selection if clicking on already selected state
      setSelectedState(isCurrentlySelected ? null : locationId);

      // Apply a temporary highlight effect
      if (!isCurrentlySelected) {
        const clickedElement = document.getElementById(locationId);
        if (clickedElement) {
          clickedElement.style.transition = 'fill 0.2s ease-in-out';
          const originalFill = clickedElement.style.fill;

          // Flash effect with QX Net gold color
          clickedElement.style.fill = '#E4BF2D';
          setTimeout(() => {
            clickedElement.style.fill = originalFill;
          }, 200);
        }
      }
    } catch (error) {
      console.error("Error in click handler:", error);
    }
  };

  // Custom location class to color states based on number of companies
  const getLocationClassName = (location: any) => {
    try {
      const id = location.id;
      const count = filteredCounts[id as keyof typeof filteredCounts]?.count || 0;

      let colorClass = "svg-map__location";

      if (count === 0) {
        colorClass += " svg-map__location--low";
      } else if (count < 2) {
        colorClass += " svg-map__location--medium-low";
      } else if (count < 4) {
        colorClass += " svg-map__location--medium";
      } else {
        colorClass += " svg-map__location--high";
      }

      if (selectedState === id) {
        colorClass += " svg-map__location--selected";
      }

      return colorClass;
    } catch (error) {
      console.error("Error in location class assignment:", error);
      return "svg-map__location";
    }
  };

  // If not mounted yet, show nothing
  if (!isMounted) {
    return null;
  }

  // If still loading, show the loader
  if (isLoading) {
    return <MapLoader />;
  }

  // If there's an error or missing components, show the fallback
  if (hasError || !SVGMap || !australiaMap) {
    return <AustralianMapFallback selectedIndustry={selectedIndustry} setSelectedIndustry={setSelectedIndustry} />;
  }

  return (
    <div className="relative">
      <AustralianMapFilters
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        resetSelection={resetSelection}
      />

      <div
        className={`svg-map-container transition-all duration-700 ease-in-out ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        ref={mapContainerRef}
      >
        <SVGMap
          map={australiaMap}
          locationClassName={getLocationClassName}
          onLocationMouseOver={handleLocationMouseOver}
          onLocationMouseOut={handleLocationMouseOut}
          onLocationMouseMove={handleLocationMouseMove}
          onLocationClick={handleLocationClick}
        />

        {/* Company location pins overlay */}
        <div className="map-pins-overlay absolute inset-0 pointer-events-none">
          {selectedState && filteredCounts[selectedState as keyof typeof filteredCounts]?.companies.slice(0, 5).map((company: any, index: number) => {
            const state = filteredCounts[selectedState as keyof typeof filteredCounts];
            const baseCoords = state.coordinates;
            // Spread pins in a small area around the state center
            const offsetX = (index % 3) * 30 - 30;
            const offsetY = Math.floor(index / 3) * 30 - 15;

            return (
              <div
                key={`pin-${index}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 map-pin animate-bounce-slow"
                style={{
                  left: `${(baseCoords.x + offsetX) / 800 * 100}%`,
                  top: `${(baseCoords.y + offsetY) / 600 * 100}%`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <MapPin
                  size={24}
                  className="text-red-500 drop-shadow-md"
                  fill="rgba(239, 68, 68, 0.2)"
                />
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white px-2 py-1 rounded text-xs shadow-md whitespace-nowrap">
                  {company.name}
                </div>
              </div>
            );
          })}
        </div>

        {tooltip.visible && (
          <div
            className={`tooltip ${tooltip.visible ? 'visible' : ''}`}
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>

      {/* Touch-friendly instructions for mobile */}
      <div className="mt-2 text-center md:hidden">
        <p className="text-xs text-gray-500">Tap on a state to see details</p>
      </div>

      {selectedState && (
        <div
          id="state-info-panel"
          className="mt-6 p-5 bg-white rounded-lg shadow-md state-info-panel border-l-4 border-qxnet"
        >
          <h4 className="font-semibold text-lg mb-3 flex items-center">
            {filteredCounts[selectedState as keyof typeof filteredCounts]?.name}
            <span className="inline-flex items-center justify-center w-8 h-8 ml-3 bg-qxnet text-black rounded-full text-sm font-semibold">
              {filteredCounts[selectedState as keyof typeof filteredCounts]?.count}
            </span>
          </h4>

          {filteredCounts[selectedState as keyof typeof filteredCounts]?.count > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Top companies in this region:</p>
                <div className="space-y-2">
                  {filteredCounts[selectedState as keyof typeof filteredCounts]?.companies.slice(0, 3).map((company: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium">{company.name}</span>
                      <Link
                        href={`/company/${company.id}`}
                        className="text-xs text-qxnet-600 hover:underline flex items-center"
                      >
                        View profile <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Link
                  href={`/state/${selectedState}`}
                  className="text-sm text-qxnet-600 hover:text-qxnet-700 transition-colors"
                >
                  View all companies in {filteredCounts[selectedState as keyof typeof filteredCounts]?.name}
                </Link>
                <Link
                  href={`/companies?location=${selectedState}&industry=${selectedIndustry !== 'all' ? selectedIndustry : ''}`}
                  className="inline-flex items-center text-white bg-qxnet-600 px-3 py-1 rounded hover:bg-qxnet-700 transition-colors text-sm"
                >
                  Browse companies <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-3">
              <p className="text-gray-500">No companies found in this region with the selected filters.</p>
              {selectedIndustry !== 'all' && (
                <button
                  onClick={() => setSelectedIndustry('all')}
                  className="mt-2 text-qxnet-600 hover:underline text-sm"
                >
                  Clear industry filter
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
