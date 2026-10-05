import { GraduationCap, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import { SiGithub } from "react-icons/si";

const teamMembers = [
  { name: "Pratay Paul", id: "0112310163", initial: "P" },
  { name: "Md. Atikur Rahaman", id: "0112310298", initial: "A" },
  { name: "Md. Salman Rohoman Nayeem", id: "0112310484", initial: "S" },
  { name: "Md. Sarowar Alam Sourov", id: "0112310302", initial: "S" },
];

export default function SlideFinal12ThankYou() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-70 z-10" />

      {/* ── Top Header Section ── */}
      <div className="flex flex-col items-center justify-center text-center relative z-10 pt-2">
        <div className="w-20 h-20 relative drop-shadow-xl mb-2">
          <Image src="/logo.png" alt="ScholarFlow Logo" fill className="object-contain" priority />
        </div>
        <h1 className="text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-none mb-3">
          Thank You!
        </h1>
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-2.5 rounded-full shadow-lg">
          <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
          <span className="text-2xl font-black tracking-wide">Ready for Questions &amp; Live Demo</span>
        </div>
      </div>

      {/* ── Middle: Team Roster Showcase (Examiner Reference) ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto my-3">
        <div className="bg-white/90 backdrop-blur-md border-2 border-slate-200 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-black text-slate-900 uppercase tracking-widest">
                Team Phantom Devs
              </span>
            </div>
            <span className="text-sm font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              Software Engineering Laboratory
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-base flex items-center justify-center flex-shrink-0 shadow-xs">
                    {member.initial}
                  </div>
                  <span className="text-lg font-black text-slate-900 leading-tight">
                    {member.name}
                  </span>
                </div>
                <span className="text-base font-mono font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 flex-shrink-0">
                  {member.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom: GitHub Repository CTA ── */}
      <div className="flex items-center justify-center relative z-10 pb-1">
        <a
          href="https://github.com/Atik203/Scholar-Flow"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3.5 bg-slate-900 hover:bg-slate-800 text-white px-10 py-3.5 rounded-2xl font-black text-2xl shadow-xl transition-all duration-200 border border-slate-700 hover:scale-[1.02]"
        >
          <SiGithub className="w-7 h-7 flex-shrink-0" />
          <span>github.com/Atik203/Scholar-Flow</span>
        </a>
      </div>
    </div>
  );
}
