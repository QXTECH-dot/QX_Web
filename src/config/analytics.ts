// Google Analytics configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Google Search Console verification
export const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '';

// Bing Webmaster Tools verification  
export const BING_SITE_VERIFICATION = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '';

// Google Analytics events for SEO tracking
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track search events for SEO insights
export const trackSearch = (searchTerm: string, searchType: 'company' | 'abn' | 'industry') => {
  trackEvent('search', 'business_directory', `${searchType}:${searchTerm}`);
};

// Track company view events
export const trackCompanyView = (companyName: string, source: 'search' | 'browse' | 'direct') => {
  trackEvent('view_company', 'company_engagement', `${source}:${companyName}`);
};

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
} 