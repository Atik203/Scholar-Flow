import { GraduationCap, MessageCircleQuestion, Github, Globe } from "lucide-react";

export default function SlideLab15ThankYou() {
  return (
    <div className="w-full h-full bg-white p-14 flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
      <div className="absolute -right-24 top-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute -left-24 bottom-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center gap-5">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
          <MessageCircleQuestion className="w-16 h-16 text-white" />
        </div>

        <h1 className="text-6xl font-bold text-black">Thank You</h1>
        <p className="text-xl text-slate-600">Any Questions?</p>

        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 rounded-full shadow-lg mt-2">
          <GraduationCap className="w-6 h-6 text-white" />
          <span className="text-lg font-bold text-white">
            Team: Phantom Devs
          </span>
        </div>

        <div className="flex items-center gap-6 mt-2">
          <a
            href="https://github.com/Atik203/Scholar-Flow"
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="text-sm">GitHub</span>
          </a>
          <a
            href="https://scholar-flow-ai.vercel.app"
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm">Live Demo</span>
          </a>
        </div>
      </div>
    </div>
  );
}
