import { Layout } from "lucide-react";
import Image from "next/image";

const screenshots = [
  {
    src: "/slides/annotations.png",
    title: "PDF Annotations",
    description: "Highlight important text passages, add sticky notes, and bookmark key sections directly on PDF documents. Annotations are saved per-user and persist across sessions. Share annotated papers with team members for collaborative review.",
  },
  {
    src: "/slides/ai_chat.png",
    title: "AI Chat & Paper Insights",
    description: "Ask questions about your papers and get instant, context-aware answers powered by Gemini and OpenAI. The AI understands the full document content, can summarize sections, explain concepts, and generate literature comparisons across papers.",
  },
];

export default function SlideLab13UI2() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
          <Layout className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">UI/UX Preview</h1>
        <span className="text-lg font-bold text-black">(2/2)</span>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-3">
        {screenshots.map((screenshot, i) => (
          <div key={i} className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <div className="relative aspect-[16/10] bg-slate-100">
              <Image src={screenshot.src} alt={screenshot.title} fill className="object-contain p-2" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
              <h3 className="font-bold text-black text-2xl mb-1">{screenshot.title}</h3>
              <p className="text-2xl font-normal text-black leading-snug">{screenshot.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}