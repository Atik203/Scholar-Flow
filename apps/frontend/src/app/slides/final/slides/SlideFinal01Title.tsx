import { BookOpen, GraduationCap, Sparkles, User, Users } from "lucide-react";
import Image from "next/image";
import { SiGithub } from "react-icons/si";

const teamMembers = [
  { id: "0112310298", name: "Md. Atikur Rahaman", initial: "A" },
  { id: "0112310484", name: "Md. Salman Rohoman Nayeem", initial: "S" },
  { id: "0112310163", name: "Pratay Paul", initial: "P" },
  { id: "0112310302", name: "Md. Sarowar Alam Sourov", initial: "S" },
];

export default function SlideFinal01Title() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 p-10 flex flex-col relative overflow-hidden select-none">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
      />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-4 text-center">
          <div className="w-28 h-28 relative drop-shadow-xl mb-2">
            <Image src="/logo.png" alt="ScholarFlow Logo" fill className="object-contain" priority />
          </div>

          <h1 className="text-7xl font-black tracking-tight text-slate-900 mb-2">
            Scholar<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Flow</span>
          </h1>

          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-3 rounded-full shadow-lg shadow-blue-500/20 mb-2.5">
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            <span className="text-2xl font-black tracking-wide">AI-Powered Research Collaboration Platform</span>
          </div>

          {/* Presentation badge */}
          <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-800 font-black text-xl shadow-sm">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            <span>Final Project Presentation &amp; Defense</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-md border-2 border-slate-200/90 rounded-2xl p-6 shadow-xl shadow-slate-200/60 w-full">

          {/* Course & Team Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-black uppercase tracking-widest text-slate-500 mb-0.5">Course</p>
                <p className="text-2xl font-black text-slate-900">Software Engineering Laboratory</p>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-black uppercase tracking-widest text-slate-500 mb-0.5">Team</p>
                <p className="text-2xl font-black text-slate-900">Phantom Devs</p>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <User className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-base font-black uppercase tracking-widest text-slate-700">Team Members</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      {member.initial}
                    </div>
                    <span className="text-xl font-black text-slate-900 leading-tight">
                      {member.name}
                    </span>
                  </div>
                  <span className="text-lg font-mono font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border-2 border-blue-200 flex-shrink-0">
                    {member.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Link */}
          <div className="flex items-center justify-center">
            <a
              href="https://github.com/Atik203/Scholar-Flow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-blue-700 font-black bg-blue-50 hover:bg-blue-100 px-8 py-3 rounded-xl transition-all duration-200 border-2 border-blue-200 shadow-sm"
            >
              <SiGithub className="w-6 h-6 flex-shrink-0" />
              <span className="text-2xl font-black">github.com/Atik203/Scholar-Flow</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
