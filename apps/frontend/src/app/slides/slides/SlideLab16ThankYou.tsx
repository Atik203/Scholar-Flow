import { GraduationCap, Globe, MessageCircleQuestion, Sparkles } from "lucide-react";
import Image from "next/image";
import { SiGithub } from "react-icons/si";

const teamMembers = [
  { id: "0112310298", name: "Md. Atikur Rahaman", initial: "A" },
  { id: "0112310484", name: "Md. Salman Rohoman Nayeem", initial: "S" },
  { id: "0112310163", name: "Pratay Paul", initial: "P" },
  { id: "0112310302", name: "Md. Sarowar Alam Sourov", initial: "S" },
];

export default function SlideLab16ThankYou() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 p-10 flex flex-col items-center justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-70 z-10" />

      {/* ── Center content ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 gap-6 w-full max-w-3xl mx-auto">

        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 relative drop-shadow-2xl">
            <Image src="/logo.png" alt="ScholarFlow Logo" fill className="object-contain" priority />
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
            <MessageCircleQuestion className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-7xl font-extrabold text-slate-900 tracking-tight">Thank You!</h1>
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg">
            <Sparkles className="w-6 h-6 text-amber-300" />
            <span className="text-2xl font-bold tracking-wide">Any Questions?</span>
          </div>
        </div>

        {/* Team pill */}
        <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-slate-200 px-6 py-2.5 rounded-2xl shadow-md">
          <GraduationCap className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <span className="text-2xl font-extrabold text-slate-900">Team: Phantom Devs</span>
        </div>

        {/* Team member grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {teamMembers.map((m) => (
            <div key={m.id} className="bg-white rounded-xl px-4 py-2.5 border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  {m.initial}
                </div>
                <span className="text-xl font-bold text-slate-900">{m.name}</span>
              </div>
              <span className="text-xl font-mono font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 flex-shrink-0 ml-2">
                {m.id}
              </span>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <a href="https://github.com/Atik203/Scholar-Flow" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-slate-900 text-white px-7 py-3 rounded-xl font-extrabold text-xl shadow-md hover:bg-slate-800 transition-colors">
            <SiGithub className="w-6 h-6" /> github.com/Atik203/Scholar-Flow
          </a>
          <a href="https://scholar-flow-ai.vercel.app" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-blue-600 text-white px-7 py-3 rounded-xl font-extrabold text-xl shadow-md hover:bg-blue-700 transition-colors">
            <Globe className="w-6 h-6" /> scholar-flow-ai.vercel.app
          </a>
        </div>
      </div>
    </div>
  );
}