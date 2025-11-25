"use client";

import { Layout } from "lucide-react";
import Image from "next/image";

const screenshots = [
  {
    src: "/slides/collection_details.png",
    title: "Collection Management",
    description: "Organize papers into smart collections",
  },
  {
    src: "/slides/text_editor.png",
    title: "Rich Text Editor",
    description: "Collaborative notes with real-time sync",
  },
  {
    src: "/slides/ai_insights.png",
    title: "AI Insights",
    description: "AI-powered paper summaries and analysis",
  },
];

export default function Slide12ScreenshotsB() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
          <Layout className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">UI/UX Screenshots</h1>
        <span className="text-slate-400 ml-2">(2/2)</span>
      </div>

      {/* Screenshots Grid */}
      <div className="flex-1 grid grid-cols-3 gap-4">
        {screenshots.map((screenshot, index) => (
          <div
            key={index}
            className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative flex-1 min-h-0">
              <Image
                src={screenshot.src}
                alt={screenshot.title}
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="p-3 bg-white border-t border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm mb-1">
                {screenshot.title}
              </h3>
              <p className="text-slate-500 text-xs">{screenshot.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center pt-3 border-t border-slate-200 mt-3">
        <p className="text-sm text-slate-500">
          ScholarFlow • Built with Next.js 15 + Tailwind CSS
        </p>
      </div>
    </div>
  );
}
