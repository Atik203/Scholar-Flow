import { GraduationCap, Sparkles } from "lucide-react";

export default function Slide01Title() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-white via-blue-50 to-indigo-100 p-8 flex flex-col">
      {/* Header decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/10 to-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Logo & Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-slate-800 text-center mb-4">
          ScholarFlow
        </h1>

        {/* Tagline */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full mb-8">
          <Sparkles className="w-5 h-5" />
          <span className="text-lg font-medium">
            AI-Powered Research Paper Collaboration Hub
          </span>
        </div>

        {/* Subtitle Box */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl px-8 py-6 shadow-lg max-w-2xl">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">
            📄 PROJECT PROPOSAL & BENCHMARK ANALYSIS
          </h2>

          <div className="grid grid-cols-2 gap-4 text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <span>Course: Software Analysis & Design</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👥</span>
              <span>Team: Phantom Devs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <span>Date: November 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🔗</span>
              <span className="text-blue-600">scholar-flow-ai.vercel.app</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-slate-500 text-sm">
        Version 1.1.9 • Open Source • Apache 2.0 License
      </div>
    </div>
  );
}
