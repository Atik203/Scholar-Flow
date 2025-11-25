"use client";

import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Import all slides
import Slide01Title from "./slides/Slide01Title";
import Slide02Problem from "./slides/Slide02Problem";
import Slide03Solution from "./slides/Slide03Solution";
import Slide04Motivation from "./slides/Slide04Motivation";
import Slide05FeaturesA from "./slides/Slide05FeaturesA";
import Slide05FeaturesB from "./slides/Slide05FeaturesB";
import Slide05Scope from "./slides/Slide05Scope";
import Slide06TechStack from "./slides/Slide06TechStack";
import Slide08Competitors from "./slides/Slide08Competitors";
import Slide09Comparison from "./slides/Slide09Comparison";
import Slide10Advantage from "./slides/Slide10Advantage";
import Slide11GapAnalysis from "./slides/Slide11GapAnalysis";
import Slide15Conclusion from "./slides/Slide15Conclusion";

const slides = [
  { id: 1, title: "Title", component: Slide01Title },
  { id: 2, title: "Problem Statement", component: Slide02Problem },
  { id: 3, title: "Proposed Solution", component: Slide03Solution },
  { id: 4, title: "Motivation", component: Slide04Motivation },
  { id: 5, title: "Project Scope", component: Slide05Scope },
  { id: 6, title: "Features (1/2)", component: Slide05FeaturesA },
  { id: 7, title: "Features (2/2)", component: Slide05FeaturesB },
  { id: 8, title: "Tech Stack", component: Slide06TechStack },
  { id: 9, title: "Competitors", component: Slide08Competitors },
  { id: 10, title: "Comparison", component: Slide09Comparison },
  { id: 11, title: "Competitive Advantage", component: Slide10Advantage },
  { id: 12, title: "Gap Analysis", component: Slide11GapAnalysis },
  { id: 13, title: "Conclusion", component: Slide15Conclusion },
];

export default function SlidesPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const toggleFullscreen = async () => {
    if (!slideContainerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await slideContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Control Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <div className="h-6 w-px bg-slate-200" />
          <span className="text-sm font-medium text-slate-700">
            ScholarFlow Presentation
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-slate-600" />
            ) : (
              <Maximize2 className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        {/* Slide Container - 16:9 Aspect Ratio (1920x1080) */}
        <div
          ref={slideContainerRef}
          className={cn(
            "relative bg-white rounded-lg shadow-2xl overflow-hidden",
            "w-full max-w-[1200px] aspect-[16/9]",
            isFullscreen && "!max-w-none !rounded-none w-screen h-screen"
          )}
          id="slide-container"
        >
          <CurrentSlideComponent />
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-slate-200 px-4 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            disabled={currentSlide === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
              currentSlide === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {/* Slide Thumbnails */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto max-w-[600px] px-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "w-8 h-8 rounded text-xs font-medium transition-all flex-shrink-0",
                  index === currentSlide
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {slide.id}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={currentSlide === slides.length - 1}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
              currentSlide === slides.length - 1
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
