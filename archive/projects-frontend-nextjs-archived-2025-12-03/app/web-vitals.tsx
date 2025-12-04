/**
 * Web Vitals Reporting
 * Tracks Core Web Vitals and sends to analytics
 * Supports Google Analytics and custom analytics endpoints
 */

"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("Web Vital:", metric);
    }

    // Send to Google Analytics if configured
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (gaId && typeof window !== "undefined" && window.gtag) {
      window.gtag("event", metric.name, {
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Send to custom analytics endpoint (optional)
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metric: metric.name,
          value: metric.value,
          id: metric.id,
          rating: metric.rating,
          navigationType: metric.navigationType,
          timestamp: Date.now(),
          url: window.location.href,
        }),
        keepalive: true,
      }).catch((error) => {
        console.error("Failed to send web vitals:", error);
      });
    }
  });

  return null;
}

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, any>
    ) => void;
  }
}
