import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
  openGraph: {
    title: "ScholarFlow - AI-Powered Research Paper Hub",
    description:
      "ScholarFlow is an AI-powered platform for organizing, annotating, and collaborating on research papers. Streamline your academic workflow with intelligent document management.",
    type: "website",
    siteName: "ScholarFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScholarFlow - AI-Powered Research Paper Hub",
    description:
      "Organize, annotate, and collaborate on research papers with AI assistance",
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
      </head>
      <body className={inter.className}>
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
