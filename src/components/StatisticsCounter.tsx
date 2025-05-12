"use client";

import React, { useState, useEffect } from "react";

type StatItem = {
  value: string | number;
  label: string;
};

interface StatisticsCounterProps {
  items: StatItem[];
  className?: string;
}

export function StatisticsCounter({ items, className = "" }: StatisticsCounterProps) {
  const [counts, setCounts] = useState<Array<number | string>>(items.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Create an Intersection Observer to trigger animation when the component is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe the container element
    const container = document.getElementById('statistics-counter');
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Function to animate counting
    const animateCounts = () => {
      const duration = 2000; // 2 seconds
      const steps = 50;
      const stepTime = duration / steps;

      items.forEach((item, index) => {
        const targetValue = typeof item.value === 'number' 
          ? item.value 
          : parseInt(item.value.replace(/[^0-9]/g, ''));
        
        let startTimestamp: number | null = null;
        const hasPlusSign = typeof item.value === 'string' && item.value.includes('+');
        const hasComma = typeof item.value === 'string' && item.value.includes(',');

        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          
          let currentValue = Math.floor(progress * targetValue);
          let displayValue: string | number = currentValue;
          
          // Format the value based on the original format
          if (hasComma) {
            displayValue = currentValue.toLocaleString('en-US');
          }
          
          // Add '+' if the original value had it
          if (hasPlusSign && progress === 1) {
            displayValue = displayValue + '+';
          }
          
          setCounts(prev => {
            const newCounts = [...prev];
            newCounts[index] = displayValue;
            return newCounts;
          });
          
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };
        
        requestAnimationFrame(step);
      });
    };

    animateCounts();
  }, [isVisible, items]);

  return (
    <div id="statistics-counter" className={`grid grid-cols-1 md:grid-cols-3 gap-8 my-6 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <h3 className="text-4xl md:text-5xl font-bold text-primary mb-1">
            {counts[index]}
          </h3>
          <p className="text-center text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
} 