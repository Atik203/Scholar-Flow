import { Brain, DollarSign, Shield, Target, Users, Zap } from "lucide-react";

const motivations = [
  {
    icon: Zap,
    title: "Productivity Loss",
    problem: "Researchers juggle 4+ disconnected applications",
    impact: "3+ hours/week wasted on tool switching",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: Users,
    title: "Collaboration Gaps",
    problem: "No centralized platform for team paper management",
    impact: "78% struggle with research collaboration",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Brain,
    title: "No AI Assistance",
    problem: "Manual reading and analysis of papers",
    impact: "Hours spent on what AI can do in seconds",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: DollarSign,
    title: "High Costs",
    problem: "Commercial tools: $50-250/month",
    impact: "Unaffordable for students & individuals",
    color: "from-emerald-500 to-teal-600",
  },
];

const goals = [
  { icon: "🎯", text: "Unified platform for paper management & collaboration" },
  { icon: "🤖", text: "AI-powered summarization & contextual chat" },
  { icon: "💰", text: "Affordable with generous free tier" },
  { icon: "🔐", text: "Enterprise-grade security & permissions" },
  { icon: "📱", text: "Modern, responsive user experience" },
];

export default function Slide04Motivation() {
  return (
    <div className="w-full h-full bg-white p-16 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
          <Target className="w-7 h-7 text-purple-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-black">Motivation</h1>
          <p className="text-black text-lg">Why We Built ScholarFlow</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-3 gap-5">
        {/* Left - Problem Cards (2 columns) */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {motivations.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-4 border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-black text-lg">
                  {item.title}
                </h3>
              </div>
              <p className="text-black text-base mb-3">{item.problem}</p>
              <div className="bg-white rounded-lg px-3 py-2 border border-slate-200">
                <span className="text-sm font-medium text-red-600">
                  ⚠️ {item.impact}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right - Goals */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <h3 className="text-xl font-bold text-black mb-5 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Solution Goals
          </h3>
          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="bg-white rounded-lg px-3 py-2.5 border border-slate-200 flex items-center gap-2"
              >
                <span className="text-lg">{goal.icon}</span>
                <span className="text-black text-base font-medium">{goal.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Quote */}
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <p className="text-center text-slate-700 italic">
          &quot;Researchers deserve tools that are as intelligent as the work
          they do —
          <span className="text-blue-600 font-medium">
            {" "}
            ScholarFlow makes that possible.
          </span>
          &quot;
        </p>
      </div>
    </div>
  );
}
