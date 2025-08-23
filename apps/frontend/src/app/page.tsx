"use client";
import { CTA } from "@/components/marketing/CTA";
import { Features } from "@/components/marketing/Features";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Navbar } from "@/components/marketing/Navbar";
import { Testimonials } from "@/components/marketing/Testimonials";

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden pt-6 min-h-screen ">
      <Navbar />
      <main className="relative">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
