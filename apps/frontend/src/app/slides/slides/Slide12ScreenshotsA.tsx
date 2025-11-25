"use client";

import { Monitor } from "lucide-react";
import Image from "next/image";

const screenshots = [
  {
    src: "/slides/dashboard_overview.png",
    title: "Dashboard Overview",
    description: "Clean, intuitive interface for managing research papers",
  },
  {
    src: "/slides/text_editor.png",
    title: "Rich Text Editor",
    description: "Collaborative notes with real-time sync and export",
  },
];

export default function Slide12ScreenshotsA() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Monitor className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">UI/UX Screenshots</h1>
        <span className="text-slate-400 ml-2">(1/2)</span>
      </div>

      {/* Screenshots Grid - 2 columns centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-6 w-full max-w-6xl">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative aspect-[16/10] bg-slate-100">
                <Image
                  src={screenshot.src}
                  alt={screenshot.title}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-4 bg-white border-t border-slate-200">
                <h3 className="font-bold text-slate-800 text-base mb-1">
                  {screenshot.title}
                </h3>
                <p className="text-slate-500 text-sm">
                  {screenshot.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
