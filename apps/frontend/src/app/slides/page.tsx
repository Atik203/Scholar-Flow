import { Metadata } from "next";
import SlidesPresentation from "./SlidesPresentation";

export const metadata: Metadata = {
  title: "Project Proposal & Benchmark Analysis - ScholarFlow",
  description:
    "ScholarFlow project proposal and benchmark analysis presentation slides",
};

export default function SlidesPage() {
  return <SlidesPresentation />;
}
