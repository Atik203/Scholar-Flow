import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function SlideLab01Title() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="flex items-center justify-center mb-3">
          <div className="w-32 h-32 relative drop-shadow-xl">
            <Image src="/logo.png" alt="ScholarFlow Logo" fill className="object-contain" />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-black mb-2">
          Scholar<span className="text-blue-600">Flow</span>
        </h1>

        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full mb-5 shadow-lg">
          <Sparkles className="w-6 h-6" />
          <span className="text-xl font-bold">AI-Powered Research Collaboration Platform</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-10 py-5 shadow-xl max-w-3xl w-full">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-3">
            Software Engineering Lab Project Proposal
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
              <p className="text-lg font-bold text-black">Course</p>
              <p className="text-xl font-bold text-black">Software Engineering Laboratory</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
              <p className="text-lg font-bold text-black">Team</p>
              <p className="text-xl font-bold text-black">Phantom Devs</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 text-center">
            <a href="https://scholar-flow-ai.vercel.app" className="text-blue-600 hover:text-blue-700 font-bold text-lg">
              scholar-flow-ai.vercel.app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}