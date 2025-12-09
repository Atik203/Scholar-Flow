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

// Feasibility deck slides
import Slide01SurveyStats from "./slides/Slide01SurveyStats";
import Slide02SurveyTable from "./slides/Slide02SurveyTable";
import Slide03SelectedFeatures from "./slides/Slide03SelectedFeatures";
import Slide04SwotStrategy from "./slides/Slide04SwotStrategy";

const slides = [
  { id: 1, title: "Survey Attendee Stats", component: Slide01SurveyStats },
  { id: 2, title: "Survey Result Table", component: Slide02SurveyTable },
  { id: 3, title: "Selected Features", component: Slide03SelectedFeatures },
  { id: 4, title: "SWOT & Strategy", component: Slide04SwotStrategy },
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
