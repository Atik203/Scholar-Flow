import { GraduationCap, MessageCircleQuestion, Sparkles } from "lucide-react";
import Image from "next/image";
import { SiGithub } from "react-icons/si";

export default function SlideLab16ThankYou() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 p-10 flex flex-col items-center justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-70 z-10" />

      {/* ── Center content ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-8 w-full max-w-3xl mx-auto">

        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-28 h-28 relative drop-shadow-2xl">
            <Image src="/logo.png" alt="ScholarFlow Logo" fill className="object-contain" priority />
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
            <MessageCircleQuestion className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-7xl font-extrabold text-slate-900 tracking-tight">Thank You!</h1>
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-3.5 rounded-full shadow-lg">
            <Sparkles className="w-6 h-6 text-amber-300" />
            <span className="text-2xl font-bold tracking-wide">Any Questions?</span>
          </div>
        </div>

        {/* Team pill */}
        <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-slate-200 px-8 py-3 rounded-2xl shadow-md">
          <GraduationCap className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <span className="text-2xl font-extrabold text-slate-900">Team: Phantom Devs</span>
        </div>

        {/* GitHub link */}
        <a
          href="https://github.com/Atik203/Scholar-Flow"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-extrabold text-xl shadow-lg hover:bg-slate-800 transition-colors"
        >
          <SiGithub className="w-6 h-6" /> github.com/Atik203/Scholar-Flow
        </a>
      </div>
    </div>
  );
}