import { Monitor } from "lucide-react";
import Image from "next/image";

const screenshots = [
  {
    src: "/slides/dashboard_overview.png",
    title: "Dashboard Overview",
    badge: "📊 Paper Management",
    description: "Clean interface to manage all research papers — recent uploads, reading progress, collections and one-click upload, share & export.",
  },
  {
    src: "/slides/text_editor.png",
    title: "Rich Text Editor",
    badge: "✍️ TipTap Editor",
    description: "Collaborative editor with auto-save, PDF/DOCX export, headings, tables, images, citations, and live multi-user presence.",
  },
];

export default function SlideLab12UI() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Monitor className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">Slide 12 · UI/UX Preview</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Interface Preview <span className="text-blue-600">(Part 1 of 2)</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <span className="text-2xl">🖥️</span>
            <span className="text-xl font-bold text-slate-900">Screens 1 &amp; 2 of 4</span>
          </div>
        </div>
      </div>

      {/* ── Screenshots ── */}
      <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 my-3 min-h-0">
        {screenshots.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-slate-200 shadow-md flex flex-col overflow-hidden">
            {/* Screenshot */}
            <div className="relative flex-1 bg-slate-100 min-h-0">
              <Image src={s.src} alt={s.title} fill className="object-contain p-2" sizes="40vw" />
            </div>
            {/* Caption */}
            <div className="p-4 border-t-2 border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">{s.badge}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{s.title}</h3>
              <p className="text-xl font-semibold text-slate-800 leading-snug">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-6 py-3 shadow-lg border border-blue-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white">
          🎨 Built with <span className="text-amber-300">Tailwind CSS + shadcn/ui</span> — modern, responsive, accessible design system
        </p>
      </div>
    </div>
  );
}