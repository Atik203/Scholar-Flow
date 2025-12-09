import { Metadata } from "next";
import SlidesPresentation from "./SlidesPresentation";

export const metadata: Metadata = {
  title: "Feasibility Analysis Slides - ScholarFlow",
  description:
    "Survey-backed feasibility deck covering attendee statistics, key results, selected features, and SWOT with strategy.",
};

export default function SlidesPage() {
  return <SlidesPresentation />;
}
