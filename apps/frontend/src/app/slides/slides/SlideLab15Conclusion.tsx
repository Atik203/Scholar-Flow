import { CheckCircle, Globe, Target } from "lucide-react";
import { SiGithub } from "react-icons/si";

const takeaways = [
  {
    icon: "🎯",
    title: "Real Problem Solved",
    desc: "Addresses fragmented tools, no AI, poor collaboration, and high costs — pain points felt by 91% of researchers today.",
    color: "from-emerald-500 to-teal-600",
    accent: "border-emerald-200 bg-emerald-50/60",
  },
  {
    icon: "🛠️",
    title: "Technically Proven",
    desc: "Next.js 16 + Express.js + pgvector + AWS S3 + multi-AI providers. Production-deployed, fully scalable, cloud-native.",
    color: "from-blue-500 to-indigo-600",
    accent: "border-blue-200 bg-blue-50/60",
  },
  {
    icon: "📅",
    title: "Clear 9-Week Plan",
    desc: "Structured milestones with concrete deliverables per week. CI/CD, automated testing, and typed monorepo from day one.",
    color: "from-purple-500 to-indigo-600",
    accent: "border-purple-200 bg-purple-50/60",
  },
  {
    icon: "👥",
    title: "Team Ready to Deliver",
    desc: "4-member full-stack team. Existing codebase with 20+ features already built and live at scholar-flow-ai.vercel.app.",
    color: "from-amber-500 to-orange-600",
    accent: "border-amber-200 bg-amber-50/60",
  },
];

export default function SlideLab15Conclusion() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-emerald-50/20 to-blue-50/40 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-emerald-600 mb-0.5">Slide 15 · Conclusion</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Why ScholarFlow is Ready</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span className="text-xl font-bold text-slate-900">4 Key Takeaways</span>
          </div>
        </div>
      </div>

      {/* ── 4 takeaway cards ── */}
      <div className="flex-1 grid grid-cols-2 gap-4 relative z-10 my-3 min-h-0">
        {takeaways.map((item, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border-2 ${item.accent} shadow-md flex gap-4 items-start`}>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
              <span className="text-2xl">{item.icon}</span>
            </div>
            <div className="min-w-0">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1.5 leading-tight">{item.title}</h3>
              <p className="text-xl font-semibold text-slate-800 leading-snug text-justify">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer with links ── */}
      <div className="flex items-stretch gap-3 relative z-10">
        <div className="flex-1 bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 rounded-xl px-6 py-3 shadow-lg border border-emerald-400/30 flex items-center justify-center">
          <p className="text-xl font-extrabold text-white text-center">
            ✅ All features <span className="text-amber-300">built, tested & deployed</span> — ScholarFlow is production-ready today
          </p>
        </div>
        <a href="https://github.com/Atik203/Scholar-Flow" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-slate-900 text-white px-6 py-3 rounded-xl font-extrabold text-xl shadow-md hover:bg-slate-800 transition-colors flex-shrink-0">
          <SiGithub className="w-6 h-6" /> GitHub
        </a>
        <a href="https://scholar-flow-ai.vercel.app" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-blue-600 text-white px-6 py-3 rounded-xl font-extrabold text-xl shadow-md hover:bg-blue-700 transition-colors flex-shrink-0">
          <Globe className="w-6 h-6" /> Live Demo
        </a>
      </div>
    </div>
  );
}