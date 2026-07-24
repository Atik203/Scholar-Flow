import { GraduationCap, MessageCircleQuestion, Github, Globe } from "lucide-react";

export default function SlideLab16ThankYou() {
  return (
    <div className="w-full h-full bg-white p-10 flex flex-col items-center justify-center gap-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
      <div className="absolute -right-24 top-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute -left-24 bottom-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center gap-4">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
          <MessageCircleQuestion className="w-14 h-14 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-black">Thank You</h1>
        <p className="text-2xl font-bold text-black">Any Questions?</p>

        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 rounded-full shadow-lg">
          <GraduationCap className="w-5 h-5 text-white" />
          <span className="text-lg font-bold text-white">Team: Phantom Devs</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="https://github.com/Atik203/Scholar-Flow" className="flex items-center gap-2 text-slate-800 hover:text-blue-600 transition-colors font-bold text-lg">
            <Github className="w-5 h-5" /> GitHub
          </a>
          <a href="https://scholar-flow-ai.vercel.app" className="flex items-center gap-2 text-slate-800 hover:text-blue-600 transition-colors font-bold text-lg">
            <Globe className="w-5 h-5" /> Live Demo
          </a>
        </div>
      </div>
    </div>
  );
}