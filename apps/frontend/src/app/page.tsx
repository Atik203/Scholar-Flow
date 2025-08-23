"use client";
import { CTA } from "@/components/customUI/CTA";
import { Features } from "@/components/customUI/Features";
import { Hero } from "@/components/customUI/Hero";
import { HowItWorks } from "@/components/customUI/HowItWorks";
import { LogosMarquee } from "@/components/customUI/LogosMarquee";
import { Reviews } from "@/components/customUI/Reviews";
import { Testimonials } from "@/components/customUI/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <LogosMarquee />
      <HowItWorks />
      <Testimonials />
      <Reviews />
      <CTA />
    </>
  );
}
