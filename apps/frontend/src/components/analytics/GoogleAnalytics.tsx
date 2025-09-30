"use client";

import Script from "next/script";

interface GoogleAnalyticsProps {
  measurementId: string;
}

export const GoogleAnalytics = ({ measurementId }: GoogleAnalyticsProps) => {
  if (!measurementId) {
    console.warn("Google Analytics measurement ID is not provided");
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

// Hook for sending custom events to Google Analytics
export const useGoogleAnalytics = () => {
  const sendEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", eventName, eventParams);
    }
  };

  const sendPageView = (url: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
      });
    }
  };

  return { sendEvent, sendPageView };
};
