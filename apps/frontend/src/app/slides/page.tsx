import { Metadata } from "next";
import SlidesPresentation from "./SlidesPresentation";

export const metadata: Metadata = {
  title: "SE Lab Project Proposal - ScholarFlow",
  description:
    "Software Engineering Lab project proposal presentation for ScholarFlow — an AI-powered collaborative research management platform.",
};

export default function SlidesPage() {
  return <SlidesPresentation />;
}
