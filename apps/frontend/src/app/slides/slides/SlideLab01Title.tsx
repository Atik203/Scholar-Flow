import { BookOpen, ExternalLink, Github, Globe, GraduationCap, Sparkles, User, Users } from "lucide-react";
import Image from "next/image";
import { SiGithub } from "react-icons/si";

const teamMembers = [
  { id: "0112310298", name: "Md. Atikur Rahaman", initial: "A" },
  { id: "0112310484", name: "Md. Salman Rohoman Nayeem", initial: "S" },
  { id: "0112310163", name: "Pratay Paul", initial: "P" },
  { id: "0112310302", name: "Md. Sarowar Alam Sourov", initial: "S" },
];

export default function SlideLab01Title() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/60 p-6 flex flex-col relative overflow-hidden select-none">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
      />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-4 text-center">
          <div className="w-28 h-28 relative drop-shadow-xl mb-2">
            <Image src="/logo.png" alt="ScholarFlow Logo" fill className="object-contain" priority />
          </div>

          <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 mb-3">
            Scholar<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Flow</span>
          </h1>

          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg shadow-blue-500/20 mb-3">
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            <span className="text-2xl font-bold tracking-wide">AI-Powered Research Collaboration Platform</span>
          </div>

          <div className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-blue-100/90 border border-blue-200 text-blue-800 font-bold text-lg">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>Project Proposal Presentation</span>
          </div>
        </div>

        {/* Project Proposal Card Container */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-xl shadow-slate-200/60 w-full">
          {/* Metadata Row: Course & Team */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Course</p>
                <p className="text-xl font-bold text-slate-900 truncate">Software Engineering Laboratory</p>
              </div>
            </div>

            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider font-bold text-slate-500">Team</p>
                <p className="text-xl font-bold text-slate-900 truncate">Phantom Devs</p>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
              <span className="text-sm uppercase tracking-wider font-bold text-slate-700 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Team Members
              </span>
            
            </div>

            <div className="grid grid-cols-2 gap-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center justify-between shadow-sm hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-bold text-base flex items-center justify-center flex-shrink-0 border border-blue-100">
                      {member.initial}
                    </div>
                    <span className="text-xl font-bold text-slate-900 truncate">{member.name}</span>
                  </div>
                  <span className="text-lg font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 flex-shrink-0 ml-2">
                    {member.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Link Footer */}
          <div className="flex items-center justify-center text-base">
            <a
              href="https://scholar-flow-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-blue-600 hover:text-blue-700 font-bold bg-blue-50 hover:bg-blue-100/80 px-5 py-2.5 rounded-xl transition-all duration-200 border border-blue-200 shadow-sm"
            >
              <SiGithub className="w-5 h-5 text-blue-600" />
              <span>https://github.com/Atik203/Scholar-Flow</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}