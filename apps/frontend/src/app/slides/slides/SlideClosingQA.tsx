import { MailQuestion, Sparkles } from "lucide-react";

export default function SlideClosingQA() {
  return (
    <div className="w-full h-full bg-white p-14 flex flex-col items-center justify-center gap-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
      <div className="absolute -right-24 top-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute -left-24 bottom-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center gap-4">
        <div className="flex items-center gap-3 bg-white/80 border border-slate-200 rounded-full px-6 py-2 shadow-sm backdrop-blur">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-semibold text-slate-700">
            Feasibility Analysis · ScholarFlow
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
          Any Questions?
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Happy to dive deeper into the survey results, feature roadmap, or
          launch strategy. Let us know what you want to explore next.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 bg-indigo-50 text-indigo-700 px-5 py-3 rounded-2xl border border-indigo-100">
            <MailQuestion className="w-5 h-5" />
            <span className="font-semibold">team@scholarflow.ai</span>
          </div>
        </div>
      </div>
    </div>
  );
}
