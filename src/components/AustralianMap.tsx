"use client";

import React, { useState, useRef, useEffect } from "react";
import '@/styles/svg-map.css';
import { AustralianMapFallback } from "./AustralianMapFallback";
import { AustralianMapFilters } from "./AustralianMapFilters";
import MapSearch from "./MapSearch";
import MapViewControls, { MapView } from './MapViewControls';
import StateComparisonModal from './StateComparisonModal';
import { stateNames } from '@/lib/mapDataUtils';
import { CustomSVGMap } from './CustomSVGMap';

interface AustralianMapProps {
  selectedIndustry?: string;
  setSelectedIndustry?: (industry: string) => void;
}

export function AustralianMap({
  selectedIndustry = 'all',
  setSelectedIndustry = () => {}
}: AustralianMapProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [mapView, setMapView] = useState<MapView>('default');
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: '',
    x: 0,
    y: 0
  });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [stateCounts, setStateCounts] = useState<Record<string, number>>({});

  const stateIdToShort: Record<string, string> = {
    "new-south-wales": "NSW",
    "victoria": "VIC",
    "queensland": "QLD",
    "western-australia": "WA",
    "south-australia": "SA",
    "tasmania": "TAS",
    "northern-territory": "NT",
    "australian-capital-territory": "ACT",
  };

  useEffect(() => {
    setIsMounted(true);
    // 组件挂载后0.5秒设置加载完成
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch('/api/state-company-counts')
      .then(res => res.json())
      .then(setStateCounts);
  }, []);

  // 生成地图数据（只用公司数量，不再用generateMapData）
  const filteredCounts = Object.entries(stateNames).reduce((acc, [id, name]) => {
    const short = stateIdToShort[id] || id;
    acc[id] = {
      id,
      name,
      count: stateCounts[short] || 0
    };
    return acc;
  }, {} as Record<string, {id: string, name: string, count: number}>);

  const getLocationClassName = (location: any) => {
    const stateId = location.id;
    const count = filteredCounts[stateId]?.count || 0;
    
    let className = 'svg-map__location';
    
    if (stateId === selectedState) {
      className += ' svg-map__location--selected';
    } else if (count === 0) {
      className += ' svg-map__location--low';
    } else if (count < 5) {
      className += ' svg-map__location--medium-low';
    } else if (count < 10) {
      className += ' svg-map__location--medium';
    } else {
      className += ' svg-map__location--high';
    }
    
    return className;
  };

  // This function handles search results selection
  const handleSearchResultSelect = (stateId: string, companyId: string) => {
    setSelectedState(stateId);
  };

  // Reset state selection when changing industries or views
  const resetSelection = () => {
    setSelectedState(null);
  };

  const handleLocationMouseOver = (event: React.MouseEvent) => {
    try {
      const locationId = (event.currentTarget as HTMLElement).getAttribute("id");
      if (locationId && locationId in filteredCounts) {
        const state = filteredCounts[locationId as keyof typeof filteredCounts];
        const content = `${state.name}: ${state.count} companies`;

        // Get coordinates relative to the map container
        const rect = mapContainerRef.current?.getBoundingClientRect();
        const offsetX = rect ? event.clientX - rect.left : event.clientX;
        const offsetY = rect ? event.clientY - rect.top : event.clientY;

        // Add a small delay to prevent tooltip flickering
        setTimeout(() => {
          setTooltip({
            visible: true,
            content,
            x: event.clientX,
            y: event.clientY
          });
        }, 100);
      }
    } catch (error) {
      console.error("Error in mouse over handler:", error);
    }
  };

  const handleLocationMouseOut = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const handleLocationMouseMove = (event: React.MouseEvent) => {
    if (tooltip.visible) {
      setTooltip({
        ...tooltip,
        x: event.clientX,
        y: event.clientY
      });
    }
  };

  const handleLocationClick = (event: React.MouseEvent) => {
    try {
      const locationId = (event.currentTarget as HTMLElement).getAttribute("id");
      if (locationId && locationId in filteredCounts) {
        const state = filteredCounts[locationId as keyof typeof filteredCounts];
        if (state.count > 0) {
          setSelectedState(locationId);
          // Add a small animation class
          const element = event.currentTarget as HTMLElement;
          element.classList.add('selected-pulse');
          setTimeout(() => {
            element.classList.remove('selected-pulse');
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error in click handler:", error);
    }
  };

  // If not mounted yet, show nothing
  if (!isMounted) {
    return null;
  }

  return (
    <div className="py-4">
      <div className="mb-6">
        {/* Filters */}
        <AustralianMapFilters
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          resetSelection={resetSelection}
        />
      </div>

      {/* Comparison Modal */}
      {showComparisonModal && (
        <StateComparisonModal
          onClose={() => setShowComparisonModal(false)}
          mapData={{}}
        />
      )}

      {/* Map Component */}
      {!useFallback ? (
        <div className="relative">
          <div
            className={`svg-map-container transition-all duration-700 ease-in-out ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            ref={mapContainerRef}
          >
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-pulse text-gray-600">加载地图中...</div>
              </div>
            ) : (
              <CustomSVGMap
                locationClassName={getLocationClassName}
                onLocationMouseOver={handleLocationMouseOver}
                onLocationMouseOut={handleLocationMouseOut}
                onLocationMouseMove={handleLocationMouseMove}
                onLocationClick={handleLocationClick}
              />
            )}

            {tooltip.visible && (
              <div
                className="tooltip"
                style={{
                  left: tooltip.x,
                  top: tooltip.y,
                  opacity: tooltip.visible ? 1 : 0,
                  transition: 'opacity 0.2s ease'
                }}
              >
                {tooltip.content}
              </div>
            )}
          </div>
        </div>
      ) : (
        <AustralianMapFallback
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
        />
      )}
    </div>
  );
}
