import { Layout } from "lucide-react";
import Image from "next/image";

const screenshots = [
  {
    src: "/slides/annotations.png",
    title: "PDF Annotations",
    badge: "✏️ Inline Annotation",
    description: "Highlight passages, add sticky notes, bookmark sections directly on PDFs. Annotations persist and are shareable with the team.",
  },
  {
    src: "/slides/ai_chat.png",
    title: "AI Chat & Paper Insights",
    badge: "🧠 AI Q&A",
    description: "Ask questions about any paper — Gemini & OpenAI provide context-aware answers, summaries, and cross-paper comparisons.",
  },
];

export default function SlideLab13UI2() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/40 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-pink-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Layout className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-purple-600 mb-0.5">Slide 13 · UI/UX Preview</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Interface Preview <span className="text-purple-600">(Part 2 of 2)</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-2xl">🖥️</span>
            <span className="text-xl font-bold text-slate-900">Screens 3 &amp; 4 of 4</span>
          </div>
        </div>
      </div>

      {/* ── Screenshots ── */}
      <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 my-3 min-h-0">
        {screenshots.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-slate-200 shadow-md flex flex-col overflow-hidden">
            <div className="relative flex-1 bg-slate-100 min-h-0">
              <Image src={s.src} alt={s.title} fill className="object-contain p-2" sizes="40vw" />
            </div>
            <div className="p-4 border-t-2 border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base font-extrabold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">{s.badge}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{s.title}</h3>
              <p className="text-xl font-semibold text-slate-800 leading-snug">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-xl px-6 py-3 shadow-lg border border-purple-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white">
          🤖 AI features powered by <span className="text-amber-300">Gemini 2.5 Flash Pro + OpenAI GPT-4o</span> with multi-provider fallback
        </p>
      </div>
    </div>
  );
}