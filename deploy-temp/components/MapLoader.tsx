"use client";

import React, { useState, useEffect } from 'react';

export function MapLoader() {
  const [loadingTime, setLoadingTime] = useState(0);
  const [showRetryButton, setShowRetryButton] = useState(false);

  useEffect(() => {
    // Skip running this in SSR
    if (typeof window === 'undefined') return;

    const timer = setInterval(() => {
      setLoadingTime(prev => {
        const newTime = prev + 1;
        // After 8 seconds, show retry button
        if (newTime >= 8) {
          setShowRetryButton(true);
          clearInterval(timer);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRetry = () => {
    // Reload the component by refreshing the page
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <div className="relative w-48 h-48">
        {/* Australia outline */}
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full opacity-30"
        >
          <path
            d="M235.9,162.3c0,0,33.7-4.9,45.1-6.1c11.5-1.2,57.9-9.8,57.9-9.8s61-6.1,75.6-7.3c14.6-1.2,42.7-3.1,56.1-3.7
            c13.4-0.6,44.5-1.8,44.5-1.8s40.2,0,59.8,0.6c19.5,0.6,39,1.8,39,1.8s26.8,4.3,46.3,7.9c19.5,3.7,38.4,8.5,38.4,8.5
            s11,6.7,14.6,11.6c3.7,4.9,5.5,12.2,7.3,17.7c1.8,5.5,1.8,19.5,1.8,19.5s4.9,14,9.1,23.2c4.3,9.1,13.4,23.2,13.4,23.2
            s11.6,15.2,14.6,20.1c3.1,4.9,8,15.2,8,15.2s6.1,16.5,9.1,23.8c3.1,7.3,5.5,15.8,6.7,20.7c1.2,4.9,3.7,17.1,3.7,17.1
            s1.8,22.6,1.8,26.2c0,3.7-3.7,22-3.7,22s-0.6,20.1-1.8,27.4c-1.2,7.3-4.9,20.7-4.9,20.7s-4.9,18.9-7.3,25.6
            c-2.4,6.7-6.7,15.2-6.7,15.2s-7.3,15.2-11,20.7c-3.7,5.5-10.4,14.6-10.4,14.6s-6.7,9.8-9.8,13.4c-3.1,3.7-11.6,14-11.6,14
            s-6.1,7.9-10.4,10.4c-4.3,2.4-41.5,5.5-41.5,5.5s-30.5,0-43.9,0c-13.4,0-35.4,0-35.4,0s-36.6-1.2-47.5-1.8
            c-11-0.6-47.5-6.1-47.5-6.1s-19.5-1.8-26.2-1.8c-6.7,0-29.9,0-29.9,0s-32.3-1.2-46.3-1.2c-14,0-48.1,0-48.1,0s-35.4,0.6-49.9,1.2
            c-14.6,0.6-32.3,3.1-32.3,3.1s-12.8,1.8-20.7,3.1c-7.9,1.2-23.8,1.8-23.8,1.8s-23.2-3.1-29.9-4.3c-6.7-1.2-13.4-4.3-13.4-4.3
            s-7.9-4.9-11-7.9c-3.1-3.1-8.5-9.8-8.5-9.8s-6.1-7.9-7.9-12.2c-1.8-4.3-3.7-14.6-3.7-14.6s0-9.8,0-17.1c0-7.3,1.8-19.5,1.8-19.5
            s3.7-11.6,6.1-19.5c2.4-7.9,6.7-18.3,6.7-18.3s6.1-7.9,9.1-15.2c3.1-7.3,6.7-22,6.7-22s3.1-11.6,3.1-20.7c0-9.1,0-24.4,0-24.4
            s-5.5-10.4-8.5-15.2c-3.1-4.9-9.1-11-9.1-11s-3.7-11-4.9-18.9c-1.2-7.9-1.8-24.4-1.8-24.4s0-14,0.6-23.2c0.6-9.1,4.3-24.4,4.3-24.4
            s4.9-17.7,7.3-24.4C227.4,180,235.9,162.3,235.9,162.3z"
            className="fill-current text-qxnet-200"
          />
        </svg>

        {/* Loading animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-t-4 border-b-4 border-qxnet animate-spin"></div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-gray-700">Loading Australia Map</p>
        <p className="text-sm text-gray-500 mt-2">Preparing interactive state visualization...</p>
        {loadingTime > 3 && (
          <p className="text-sm text-gray-500 mt-2">
            This may take a few moments...
          </p>
        )}
      </div>

      {/* Loading progress dots */}
      <div className="flex mt-4 space-x-2">
        <div className="w-2 h-2 rounded-full bg-qxnet-100 animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-qxnet-200 animate-pulse" style={{ animationDelay: '300ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-qxnet-300 animate-pulse" style={{ animationDelay: '600ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-qxnet animate-pulse" style={{ animationDelay: '900ms' }}></div>
      </div>

      {/* Retry button after timeout */}
      {showRetryButton && (
        <div className="mt-6">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-qxnet hover:bg-qxnet-600 text-black rounded-md transition-colors"
          >
            Reload Map
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Map is taking longer than expected to load.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Or you can continue with the static map version below.
          </p>
        </div>
      )}
    </div>
  );
}
