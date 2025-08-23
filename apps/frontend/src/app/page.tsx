"use client";
import { CTA } from "@/components/marketing/CTA";
import { Features } from "@/components/marketing/Features";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { LogosMarquee } from "@/components/marketing/LogosMarquee";
import { Reviews } from "@/components/marketing/Reviews";
import { Testimonials } from "@/components/marketing/Testimonials";

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
