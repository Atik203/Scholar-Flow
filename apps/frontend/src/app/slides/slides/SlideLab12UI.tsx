import { Monitor } from "lucide-react";
import Image from "next/image";

const screenshots = [
  {
    src: "/slides/dashboard_overview.png",
    title: "Dashboard Overview",
    description: "Clean, intuitive interface for managing all your research papers in one place. View recent uploads, track reading progress, and access collections with a single click. Features a smart search bar and quick-action buttons for common tasks like upload, share, and export.",
  },
  {
    src: "/slides/text_editor.png",
    title: "Rich Text Editor (TipTap)",
    description: "Full-featured collaborative editor with real-time sync, auto-save functionality, and PDF/DOCX export. Supports headings, tables, images, citations, and LaTeX math. Multiple users can edit the same document simultaneously with live cursor presence indicators.",
  },
];

export default function SlideLab12UI() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Monitor className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">UI/UX Preview</h1>
        <span className="text-lg font-bold text-black">(1/2)</span>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {screenshots.map((screenshot, i) => (
          <div key={i} className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <div className="relative aspect-[16/10] bg-slate-100">
              <Image src={screenshot.src} alt={screenshot.title} fill className="object-contain p-2" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
              <h3 className="font-bold text-black text-xl mb-1">{screenshot.title}</h3>
              <p className="text-xl font-semibold text-black leading-snug">{screenshot.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}