declare module 'react-svg-map' {
  import { ComponentType } from 'react';

  export interface SVGMapProps {
    map: any;
    locationClassName?: string | ((location: any) => string);
    onLocationMouseOver?: (event: any) => void;
    onLocationMouseOut?: (event: any) => void;
    onLocationMouseMove?: (event: any) => void;
    onLocationClick?: (event: any) => void;
  }

  export const SVGMap: ComponentType<SVGMapProps>;
} 