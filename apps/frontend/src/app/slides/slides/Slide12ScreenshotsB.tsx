"use client";

import { Layout } from "lucide-react";
import Image from "next/image";

const screenshots = [
  {
    src: "/slides/annotations.png",
    title: "PDF Annotations",
    description: "Highlight text and add notes directly on papers",
  },
  {
    src: "/slides/ai_chat.png",
    title: "AI Chat & Insights",
    description: "Ask questions and get AI-powered summaries",
  },
];

export default function Slide12ScreenshotsB() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
          <Layout className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">UI/UX Screenshots</h1>
        <span className="text-slate-400 ml-2">(2/2)</span>
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
