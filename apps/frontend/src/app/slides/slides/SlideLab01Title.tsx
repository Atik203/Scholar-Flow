import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function SlideLab01Title() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <div className="flex items-center justify-center mb-4">
          <div className="w-36 h-36 relative drop-shadow-xl">
            <Image
              src="/logo.png"
              alt="ScholarFlow Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <h1 className="text-5xl font-bold text-black mb-3">
          Scholar<span className="text-blue-600">Flow</span>
        </h1>

        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full mb-6 shadow-lg">
          <Sparkles className="w-6 h-6" />
          <span className="text-xl font-bold">
            AI-Powered Research Collaboration Platform
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-12 py-6 shadow-xl max-w-3xl w-full">
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-4">
            Software Engineering Lab Project Proposal
          </h2>

          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-black font-semibold text-lg">Course</p>
              <p className="font-bold text-black text-xl">
                Software Engineering Laboratory
              </p>
            </div>
            <div>
              <p className="text-black font-semibold text-lg">Team</p>
              <p className="font-bold text-black text-xl">Phantom Devs</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 text-center">
            <a
              href="https://scholar-flow-ai.vercel.app"
              className="text-blue-600 hover:text-blue-700 font-bold text-xl"
            >
              scholar-flow-ai.vercel.app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}