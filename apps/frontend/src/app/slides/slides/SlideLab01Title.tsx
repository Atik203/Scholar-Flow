import { BookOpen, GraduationCap, Sparkles, User, Users } from "lucide-react";
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

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-5 text-center">
          <div className="w-28 h-28 relative drop-shadow-xl mb-3">
            <Image src="/logo.png" alt="ScholarFlow Logo" fill className="object-contain" priority />
          </div>

          <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 mb-3">
            Scholar<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Flow</span>
          </h1>

          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg shadow-blue-500/20 mb-3">
            <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            <span className="text-2xl font-bold tracking-wide">AI-Powered Research Collaboration Platform</span>
          </div>

          {/* Presentation badge — bumped to text-xl */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-blue-100/90 border border-blue-200 text-blue-800 font-bold text-xl">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>Project Proposal Presentation</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-xl shadow-slate-200/60 w-full">

          {/* Course & Team Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                {/* Label bumped from text-xs to text-base */}
                <p className="text-base font-extrabold uppercase tracking-widest text-slate-500 mb-0.5">Course</p>
                <p className="text-xl font-bold text-slate-900 truncate">Software Engineering Laboratory</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-extrabold uppercase tracking-widest text-slate-500 mb-0.5">Team</p>
                <p className="text-xl font-bold text-slate-900 truncate">Phantom Devs</p>
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
            {/* Section header label bumped from text-sm to text-base */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <User className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-base font-extrabold uppercase tracking-widest text-slate-700">Team Members</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar bumped from w-9 h-9 text-base to w-11 h-11 text-lg */}
                    <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      {member.initial}
                    </div>
                    <span className="text-xl font-bold text-slate-900 truncate">{member.name}</span>
                  </div>
                  {/* Student ID bumped from text-lg to text-xl */}
                  <span className="text-xl font-mono font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 flex-shrink-0 ml-2">
                    {member.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GitHub Link — bumped from text-base to text-xl */}
          <div className="flex items-center justify-center">
            <a
              href="https://github.com/Atik203/Scholar-Flow"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-blue-700 font-bold bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-xl transition-all duration-200 border border-blue-200 shadow-sm"
            >
              <SiGithub className="w-5 h-5 flex-shrink-0" />
              <span className="text-xl font-bold">github.com/Atik203/Scholar-Flow</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}