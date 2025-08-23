import { Footer } from "@/components/customUI/Footer";
import { Navbar } from "@/components/customUI/Navbar";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
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
              <Toaster
                theme="system"
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  duration: 3000,
                  classNames: {
                    toast:
                      "bg-card text-card-foreground border border-border shadow-sm",
                    title: "font-medium",
                    description: "text-muted-foreground",
                    actionButton:
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                    cancelButton: "bg-muted text-foreground hover:bg-muted/90",
                    success: "border-l-4 border-l-green-500",
                    error: "border-l-4 border-l-red-500",
                    warning: "border-l-4 border-l-yellow-500",
                    loading: "opacity-90",
                  },
                }}
              />
            </ThemeProvider>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
