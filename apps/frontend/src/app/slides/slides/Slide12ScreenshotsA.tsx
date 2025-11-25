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
    <div className="w-full h-full bg-white p-16 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Monitor className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-black">UI/UX Screenshots</h1>
        <span className="text-slate-500 ml-2 text-lg">(1/2)</span>
      </div>

      {/* Screenshots Grid - 2 columns centered */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="grid grid-cols-2 gap-8 w-full max-w-7xl">
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
              <div className="p-5 bg-white border-t border-slate-200">
                <h3 className="font-bold text-black text-lg mb-2">
                  {screenshot.title}
                </h3>
                <p className="text-black text-base font-medium">
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
