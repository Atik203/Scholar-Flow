import { ArrowRight, Brain, DollarSign, Lightbulb, Shield, Target, Users, Zap } from "lucide-react";

const motivations = [
  {
    icon: Zap,
    title: "Productivity Loss",
    description: "Researchers switch between 4+ apps daily, losing hours that should go into actual research work.",
    impact: "3+ hrs/week lost to tool switching",
    color: "from-rose-500 to-red-600",
    impactBg: "bg-rose-50 border-rose-200 text-rose-700",
  },
  {
    icon: Users,
    title: "Collaboration Gaps",
    description: "No shared platform for teams leads to version conflicts, lost feedback, and siloed research groups.",
    impact: "78% struggle to collaborate",
    color: "from-amber-500 to-orange-600",
    impactBg: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    icon: Brain,
    title: "No AI Assistance",
    description: "Hours are spent manually reading papers — AI can extract the same key insights in seconds.",
    impact: "91% receive zero AI help",
    color: "from-purple-500 to-indigo-600",
    impactBg: "bg-purple-50 border-purple-200 text-purple-700",
  },
  {
    icon: DollarSign,
    title: "Unaffordable Tools",
    description: "Commercial tools charge $50–$250/month, making essential research infrastructure inaccessible to students.",
    impact: "Out of reach for most students",
    color: "from-emerald-500 to-teal-600",
    impactBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
];

const goals = [
  { icon: "🎯", title: "Unified Platform", desc: "One place for all research papers & teams" },
  { icon: "🤖", title: "AI-First Design", desc: "Summaries, search & Q&A built-in" },
  { icon: "💰", title: "Accessible Pricing", desc: "Generous free tier for every student" },
  { icon: "🔐", title: "Secure & Private", desc: "Role-based access & data protection" },
  { icon: "⚡", title: "Modern Experience", desc: "Fast, responsive & intuitive to use" },
];

export default function SlideLab03Motivation() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Blur Blobs */}
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-10">
        {/* Top accent bar */}
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full opacity-60" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-purple-600 mb-0.5">Slide 03 · Motivation</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">Why We Built ScholarFlow</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <span className="text-xl font-bold text-slate-900">Our Team's Real Experience</span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="flex-1 grid grid-cols-11 gap-3 relative z-10 my-3 min-h-0">

        {/* Left — 4 Motivation Cards (6 cols) */}
        <div className="col-span-6 grid grid-cols-2 gap-3">
          {motivations.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 border-2 border-slate-100 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">{item.title}</h3>
                </div>
                {/* font-normal → font-semibold, text-black → text-slate-900 */}
                <p className="text-xl font-semibold text-slate-900 leading-snug text-justify">
                  {item.description}
                </p>
              </div>

              {/* Impact badge bumped from text-base to text-xl */}
              <div className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl border-2 font-bold text-xl ${item.impactBg}`}>
                <span>⚠️</span>
                <span className="leading-tight">{item.impact}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Center Arrow Connector */}
        <div className="col-span-1 flex flex-col items-center justify-center gap-2">
          <div className="flex-1 w-px bg-gradient-to-b from-transparent via-purple-300 to-transparent" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 w-px bg-gradient-to-b from-transparent via-purple-300 to-transparent" />
        </div>

        {/* Right — Goals Card (4 cols) — dark blue matching Slide 2 style */}
        <div className="col-span-4 bg-gradient-to-br from-purple-700 via-indigo-700 to-indigo-900 rounded-2xl p-5 shadow-2xl shadow-indigo-500/30 flex flex-col border border-white/10">
          {/* Card Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-amber-300">🎯</span>
                <span className="text-base font-extrabold uppercase tracking-widest text-purple-200">Our Goals</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white leading-tight">What ScholarFlow Achieves</h2>
            </div>
          </div>

          {/* Vision statement — amber left border */}
          <p className="text-xl font-bold text-white leading-snug mb-3 border-l-4 border-amber-400 pl-3">
            Built by researchers, for researchers — to eliminate the pain we faced ourselves.
          </p>

          {/* Goals list — subtitles at text-lg (bumped from text-base) */}
          <div className="flex flex-col gap-2 flex-1">
            {goals.map((goal, i) => (
              <div key={i} className="bg-white/20 rounded-xl px-3 py-2.5 border border-white/25 flex items-center gap-3">
                <span className="text-2xl flex-shrink-0 leading-none">{goal.icon}</span>
                <div className="min-w-0">
                  <p className="text-xl font-extrabold text-white leading-tight">{goal.title}</p>
                  <p className="text-lg font-bold text-purple-100 leading-tight truncate">{goal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer Quote Banner — solid blue gradient, text-xl non-italic ── */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl px-6 py-3 shadow-lg shadow-purple-500/20 border border-purple-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">
          ✨ &ldquo;Researchers deserve tools as intelligent as the work they do — <span className="text-amber-300">ScholarFlow makes that possible.</span>&rdquo;
        </p>
      </div>
    </div>
  );
}