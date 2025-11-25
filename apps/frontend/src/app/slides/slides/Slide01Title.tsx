import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function Slide01Title() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {/* Logo - Large and prominent */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-40 h-40 relative drop-shadow-xl">
            <Image
              src="/logo.png"
              alt="ScholarFlow Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold text-slate-800 text-center mb-4">
          Scholar<span className="text-blue-600">Flow</span>
        </h1>

        {/* Tagline */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full mb-10 shadow-lg">
          <Sparkles className="w-6 h-6" />
          <span className="text-xl font-semibold">
            AI-Powered Research Paper Collaboration Hub
          </span>
        </div>

        {/* Info Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-12 py-10 shadow-xl max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-8 flex items-center justify-center gap-3">
            <span className="text-4xl">📝</span> PROJECT PROPOSAL & BENCHMARK
            ANALYSIS
          </h2>

          <div className="grid grid-cols-2 gap-8 text-slate-700">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📚</span>
              <div>
                <p className="text-slate-500 text-base">Course</p>
                <p className="font-semibold text-slate-800 text-lg">
                  System Analysis and Design Laboratory
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-3xl">👻</span>
              <div>
                <p className="text-slate-500 text-base">Team</p>
                <p className="font-semibold text-slate-800 text-lg">
                  Phantom Devs
                </p>
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-center gap-4 pt-4">
              <span className="text-3xl">🔗</span>
              <a
                href="https://scholar-flow-ai.vercel.app"
                className="text-blue-600 hover:text-blue-700 font-semibold text-xl transition-colors"
              >
                scholar-flow-ai.vercel.app
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
