"use client";

import React from 'react';
import { australianMapData } from '@/lib/australianMapData';

interface Location {
  id: string;
  path: string;
}

interface CustomSVGMapProps {
  locationClassName?: (location: Location) => string;
  onLocationMouseOver?: (event: React.MouseEvent) => void;
  onLocationMouseOut?: (event: React.MouseEvent) => void;
  onLocationMouseMove?: (event: React.MouseEvent) => void;
  onLocationClick?: (event: React.MouseEvent) => void;
}

export const CustomSVGMap: React.FC<CustomSVGMapProps> = ({
  locationClassName,
  onLocationMouseOver,
  onLocationMouseOut,
  onLocationMouseMove,
  onLocationClick,
}) => {
  const locations = Object.entries(australianMapData).map(([id, path]) => ({
    id,
    path,
  }));

  return (
    <svg
      viewBox="0 0 800 600"
      className="w-full h-full"
      style={{ maxHeight: '600px' }}
    >
      {locations.map((location) => (
        <path
          key={location.id}
          id={location.id}
          d={location.path}
          className={locationClassName?.(location) || ''}
          onMouseOver={onLocationMouseOver}
          onMouseOut={onLocationMouseOut}
          onMouseMove={onLocationMouseMove}
          onClick={onLocationClick}
        />
      ))}
    </svg>
  );
}; 