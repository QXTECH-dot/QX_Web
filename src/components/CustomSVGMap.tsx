"use client";

import React, { useEffect, useRef, useState } from 'react';
import { australianMapData } from '@/lib/australianMapData';
import { StateKey,StateMap } from '@/lib/const';


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
  
  const [labelPositions, setLabelPositions] = useState<Record<StateKey, { x: number, y: number }>>({}as Record<StateKey, { x: number; y: number }>);
  const pathRefs = useRef<Record<StateKey, SVGPathElement | null>>({} as Record<StateKey, SVGPathElement | null>);

  useEffect(() => {
    const newPositions: Record<StateKey, { x: number, y: number }> = {} as Record<StateKey, { x: number, y: number }>;

    (Object.keys(australianMapData) as StateKey[]).forEach((key) => {
      const path = pathRefs.current[key];
      if (path) {
        const bbox = path.getBBox();
        newPositions[key] = {
          x: bbox.x + bbox.width / 2,
          y: bbox.y + bbox.height / 2,
        };
      }
    });
    setLabelPositions(newPositions);
  }, []);

  const offset : Record<StateKey, Array<number>> = {
    [StateKey.WA]: [20,20],
    [StateKey.NT]: [0,20],
    [StateKey.QLD]: [-50,50],
    [StateKey.SA]: [0,-60],
    [StateKey.NSW]: [0,-20],
    [StateKey.VIC]: [-10,15],
    [StateKey.TAS]: [10,10],
  };

  return (
    <svg
      viewBox="0 0 1000 1000"
      className="w-full h-full"
      style={{ maxHeight: '600px' }}
    >
      {locations.map((location) => (
        <path
          key={location.id}
          id={location.id}
          ref={(el) => {pathRefs.current[location.id as StateKey] = el}}
          d={location.path}
          style={{
            stroke: 'gray',  
            strokeWidth: '1px', 
          }}
          className={locationClassName?.(location) || ''}
          onMouseOver={onLocationMouseOver}
          onMouseOut={onLocationMouseOut}
          onMouseMove={onLocationMouseMove}
          onClick={onLocationClick}
        />
      ))}

        {Object.entries(labelPositions).map(([key, pos]) => (
          <text
            key={key}
            x={pos.x + offset[key as StateKey][0]}
            y={pos.y + offset[key as StateKey][1]}
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="24"
            fill="black"
          >
            {StateMap[(key as StateKey)]}
          </text>
        ))}
    </svg>
  );
}; 