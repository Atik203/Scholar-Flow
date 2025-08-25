import { Footer } from "@/components/customUI/Footer";
import { Navbar } from "@/components/customUI/Navbar";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScholarFlow - AI-Powered Research Paper Hub",
  description:
    "Organize, annotate, and collaborate on research papers with AI assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-lt-installed="true">
      <body className={inter.className}>
        <NextAuthProvider>
          <ReduxProvider>
            <ThemeProvider>
              <div className="relative overflow-x-hidden min-h-screen pt-6 flex flex-col">
                <Navbar />
                <main className="flex-1 relative">{children}</main>
                <Footer />
              </div>
              <ToastProvider />
            </ThemeProvider>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
