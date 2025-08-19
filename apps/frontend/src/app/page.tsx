"use client";
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
    <div className="relative overflow-x-hidden before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_20%_15%,theme(colors.primary/12),transparent_60%)] after:absolute after:inset-0 after:-z-10 after:bg-[radial-gradient(circle_at_80%_85%,theme(colors.primary/8),transparent_55%)]">
      <Navbar />
      <main>
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
