"use client";

import React from 'react';
import { Grid2X2, Flame, BarChart, TrendingUp } from 'lucide-react';

export type MapView = 'default' | 'heatmap' | 'density' | 'growth';

interface MapViewControlsProps {
  activeView: MapView;
  onViewChange: (view: MapView) => void;
}

const MapViewControls: React.FC<MapViewControlsProps> = ({ activeView, onViewChange }) => {
  const views = [
    { id: 'default', label: 'Standard', icon: Grid2X2 },
    { id: 'heatmap', label: 'Heatmap', icon: Flame },
    { id: 'density', label: 'Density', icon: BarChart },
    { id: 'growth', label: 'Growth', icon: TrendingUp },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id as MapView)}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeView === view.id
                ? 'bg-qxnet text-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon size={16} className="mr-1.5" />
            {view.label}
          </button>
        );
      })}
    </div>
  );
};

export default MapViewControls;
