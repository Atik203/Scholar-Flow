import { Monitor } from "lucide-react";
import Image from "next/image";

const screenshots = [
  {
    src: "/slides/dashboard_overview.png",
    title: "Dashboard Overview",
    description: "Clean interface for managing research papers",
  },
  {
    src: "/slides/text_editor.png",
    title: "Rich Text Editor",
    description: "Collaborative notes with real-time sync",
  },
  {
    src: "/slides/annotations.png",
    title: "PDF Annotations",
    description: "Highlight and add notes on papers",
  },
  {
    src: "/slides/ai_chat.png",
    title: "AI Chat & Insights",
    description: "Ask questions, get AI-powered summaries",
  },
];

export default function SlideLab12UI() {
  return (
    <div className="w-full h-full bg-white p-10 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Monitor className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">UI/UX Preview</h1>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {screenshots.map((screenshot, i) => (
          <div
            key={i}
            className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="relative aspect-[16/9] bg-slate-100">
              <Image
                src={screenshot.src}
                alt={screenshot.title}
                fill
                className="object-contain p-1"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="p-3 bg-white border-t border-slate-200">
              <h3 className="font-bold text-black text-sm mb-1">
                {screenshot.title}
              </h3>
              <p className="text-black text-xs font-medium">
                {screenshot.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
