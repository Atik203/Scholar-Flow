import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function SlideLab01Title() {
  return (
    <div className="w-full h-full bg-white p-16 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
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

        <h1 className="text-7xl md:text-8xl font-bold text-black text-center mb-5">
          Scholar<span className="text-blue-600">Flow</span>
        </h1>

        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-full mb-10 shadow-lg">
          <Sparkles className="w-7 h-7" />
          <span className="text-2xl font-semibold">
            AI-Powered Research Collaboration Platform
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-14 py-10 shadow-xl max-w-3xl w-full">
          <h2 className="text-3xl font-bold text-blue-600 text-center mb-8">
            Software Engineering Lab Project Proposal
          </h2>

          <div className="grid grid-cols-2 gap-8 text-black">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📚</span>
              <div>
                <p className="text-slate-600 text-lg font-medium">Course</p>
                <p className="font-bold text-black text-xl">
                  Software Engineering Laboratory
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-3xl">👻</span>
              <div>
                <p className="text-slate-600 text-lg font-medium">Team</p>
                <p className="font-bold text-black text-xl">Phantom Devs</p>
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
