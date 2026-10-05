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

// Final Presentation Slides
import SlideFinal01Title from "./slides/SlideFinal01Title";
import SlideFinal02Delta from "./slides/SlideFinal02Delta";
import SlideFinal03Notes from "./slides/SlideFinal03Notes";
import SlideFinal04Discussions from "./slides/SlideFinal04Discussions";
import SlideFinal05Notifications from "./slides/SlideFinal05Notifications";
import SlideFinal06Security from "./slides/SlideFinal06Security";
import SlideFinal07Analytics from "./slides/SlideFinal07Analytics";
import SlideFinal08AdminAlerts from "./slides/SlideFinal08AdminAlerts";
import SlideFinal09AdminModeration from "./slides/SlideFinal09AdminModeration";
import SlideFinal10AdminRoundup from "./slides/SlideFinal10AdminRoundup";
import SlideFinal11Conclusion from "./slides/SlideFinal11Conclusion";
import SlideFinal12ThankYou from "./slides/SlideFinal12ThankYou";

const slides = [
  { id: 1, title: "Title", component: SlideFinal01Title },
  { id: 2, title: "Since Last Update", component: SlideFinal02Delta },
  { id: 3, title: "Research Notes", component: SlideFinal03Notes },
  { id: 4, title: "Discussions", component: SlideFinal04Discussions },
  { id: 5, title: "Notifications", component: SlideFinal05Notifications },
  { id: 6, title: "Security", component: SlideFinal06Security },
  { id: 7, title: "Analytics", component: SlideFinal07Analytics },
  { id: 8, title: "Admin Alerts", component: SlideFinal08AdminAlerts },
  { id: 9, title: "Admin Moderation", component: SlideFinal09AdminModeration },
  { id: 10, title: "Admin Roundup", component: SlideFinal10AdminRoundup },
  { id: 11, title: "Conclusion & Future Work", component: SlideFinal11Conclusion },
  { id: 12, title: "Thank You & Q&A", component: SlideFinal12ThankYou },
];

export default function FinalPresentation() {
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
        if (slideContainerRef.current.requestFullscreen) {
          await slideContainerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      // Fallback: toggle CSS fullscreen
      setIsFullscreen((prev) => !prev);
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

  // Global presentation keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "Escape" && isFullscreen && !document.fullscreenElement) {
        e.preventDefault();
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

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
            Final Presentation
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen (F)"}
            id="fullscreen-toggle-btn"
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
            isFullscreen &&
              "fixed inset-0 z-50 !max-w-none !rounded-none !w-screen !h-screen !aspect-auto"
          )}
          tabIndex={0}
          id="slide-container"
        >
          <CurrentSlideComponent />
          {!isFullscreen && (
            <div className="absolute bottom-4 right-4 text-xs text-slate-700 bg-white/80 border border-slate-200 rounded-full px-3 py-1 shadow-sm pointer-events-none">
              {currentSlide + 1} / {slides.length}
            </div>
          )}
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
