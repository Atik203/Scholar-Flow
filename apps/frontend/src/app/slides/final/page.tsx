import { Metadata } from "next";
import FinalPresentation from "./FinalPresentation";

export const metadata: Metadata = {
  title: "Final Presentation - ScholarFlow",
  description:
    "Final project presentation for ScholarFlow — an AI-powered collaborative research management platform. Project update: Notes, Discussions, Notifications, Security, Help, Analytics and Admin.",
};

export default function FinalSlidesPage() {
  return <FinalPresentation />;
}
