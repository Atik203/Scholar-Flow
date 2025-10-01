import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Viewport configuration (separate from metadata in Next.js 15+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// Optimize font loading with display swap and fallbacks
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Prevent invisible text during font load
  preload: true,
  fallback: ["system-ui", "arial", "sans-serif"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ScholarFlow - AI-Powered Research Paper Hub",
  description:
    "ScholarFlow is an AI-powered platform for organizing, annotating, and collaborating on research papers. Streamline your academic workflow with intelligent document management, advanced search, and team collaboration features.",
  keywords: [
    "research papers",
    "academic collaboration",
    "paper management",
    "AI research assistant",
    "document organization",
    "scientific literature",
    "research workflow",
    "academia",
  ],
  authors: [{ name: "ScholarFlow Team" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "ScholarFlow - AI-Powered Research Paper Hub",
    description:
      "ScholarFlow is an AI-powered platform for organizing, annotating, and collaborating on research papers. Streamline your academic workflow with intelligent document management.",
    type: "website",
    siteName: "ScholarFlow",
    url: "https://scholarflow.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScholarFlow - AI-Powered Research Paper Hub",
    description:
      "Organize, annotate, and collaborate on research papers with AI assistance",
    site: "@scholarflow",
    creator: "@scholarflow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ScholarFlow",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  return (
    <html lang="en" suppressHydrationWarning data-lt-installed="true">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* PWA Meta Tags */}
        <meta name="application-name" content="ScholarFlow" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ScholarFlow" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3b82f6" />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ScholarFlow",
              description:
                "AI-Powered Research Paper Collaboration Hub for organizing, annotating, and collaborating on research papers",
              applicationCategory: "EducationalApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "256",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        <NextAuthProvider>
          <ReduxProvider>
            <ThemeProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
              <ToastProvider />
            </ThemeProvider>
          </ReduxProvider>
        </NextAuthProvider>
        <Analytics />
        {gaId && <GoogleAnalytics measurementId={gaId} />}
      </body>
    </html>
  );
}
