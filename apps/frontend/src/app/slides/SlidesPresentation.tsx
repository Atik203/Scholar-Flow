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

// SE Lab Proposal Slides
import SlideLab01Title from "./slides/SlideLab01Title";
import SlideLab02Problem from "./slides/SlideLab02Problem";
import SlideLab03Motivation from "./slides/SlideLab03Motivation";
import SlideLab04Objectives from "./slides/SlideLab04Objectives";
import SlideLab05Scope from "./slides/SlideLab05Scope";
import SlideLab06FeaturesA from "./slides/SlideLab06FeaturesA";
import SlideLab07FeaturesB from "./slides/SlideLab07FeaturesB";
import SlideLab08Benchmark from "./slides/SlideLab08Benchmark";
import SlideLab09Comparison from "./slides/SlideLab09Comparison";
import SlideLab10TechStack from "./slides/SlideLab10TechStack";
import SlideLab11Architecture from "./slides/SlideLab11Architecture";
import SlideLab12UI from "./slides/SlideLab12UI";
import SlideLab13UI2 from "./slides/SlideLab13UI2";
import SlideLab14Timeline from "./slides/SlideLab14Timeline";
import SlideLab15Conclusion from "./slides/SlideLab15Conclusion";
import SlideLab16ThankYou from "./slides/SlideLab16ThankYou";

const slides = [
  { id: 1, title: "Title", component: SlideLab01Title },
  { id: 2, title: "Problem & Project Description", component: SlideLab02Problem },
  { id: 3, title: "Motivation", component: SlideLab03Motivation },
  { id: 4, title: "Project Objectives", component: SlideLab04Objectives },
  { id: 5, title: "Project Scope", component: SlideLab05Scope },
  { id: 6, title: "Features (1/2)", component: SlideLab06FeaturesA },
  { id: 7, title: "Features (2/2)", component: SlideLab07FeaturesB },
  { id: 8, title: "Benchmark Analysis", component: SlideLab08Benchmark },
  { id: 9, title: "Feature Comparison Matrix", component: SlideLab09Comparison },
  { id: 10, title: "Technology Stack & Justification", component: SlideLab10TechStack },
  { id: 11, title: "System Architecture", component: SlideLab11Architecture },
  { id: 12, title: "UI Preview (1/2)", component: SlideLab12UI },
  { id: 13, title: "UI Preview (2/2)", component: SlideLab13UI2 },
  { id: 14, title: "Implementation Timeline", component: SlideLab14Timeline },
  { id: 15, title: "Conclusion", component: SlideLab15Conclusion },
  { id: 16, title: "Thank You & Q&A", component: SlideLab16ThankYou },
];

export default function SlidesPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    slideContainerRef.current?.focus();
  }, [currentSlide]);

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
            SE Lab Project Proposal
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

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div
          ref={slideContainerRef}
          className={cn(
            "relative bg-white rounded-lg shadow-2xl overflow-hidden",
            "w-full max-w-[1200px] aspect-[16/9]",
            isFullscreen && "!max-w-none !rounded-none w-screen h-screen"
          )}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === " ") {
              e.preventDefault();
              goToNext();
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              goToPrevious();
            }
          }}
          id="slide-container"
        >
          <CurrentSlideComponent />
          <div className="absolute bottom-4 right-4 text-xs text-slate-700 bg-white/80 border border-slate-200 rounded-full px-3 py-1 shadow-sm pointer-events-none">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 px-4 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
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