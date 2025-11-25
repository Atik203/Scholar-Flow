import { Crown, TrendingUp } from "lucide-react";

const advantages = [
  {
    name: "AI Features",
    scholarFlow: 100,
    others: 15,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Modern Tech Stack",
    scholarFlow: 100,
    others: 40,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    name: "Team Collaboration",
    scholarFlow: 95,
    others: 35,
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Price/Value",
    scholarFlow: 90,
    others: 45,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    name: "User Experience",
    scholarFlow: 95,
    others: 50,
    color: "from-orange-500 to-orange-600",
  },
  {
    name: "API & Extensibility",
    scholarFlow: 90,
    others: 40,
    color: "from-cyan-500 to-cyan-600",
  },
];

const uniqueAdvantages = [
  {
    icon: "🤖",
    title: "AI-First Architecture",
    desc: "Native Gemini + GPT integration, not bolted-on",
  },
  {
    icon: "⚡",
    title: "Modern Stack (2025)",
    desc: "Next.js 15, TypeScript, PostgreSQL + pgvector",
  },
  {
    icon: "👥",
    title: "True Team Workspaces",
    desc: "Real-time collaboration, not just sharing",
  },
  {
    icon: "💰",
    title: "Generous Free Tier",
    desc: "100 papers free, competitors limit to 300MB",
  },
  {
    icon: "🔓",
    title: "Open Architecture",
    desc: "API-first design, no vendor lock-in",
  },
  {
    icon: "📝",
    title: "Rich Text Editor",
    desc: "Write papers directly in the platform",
  },
];

export default function Slide10Advantage() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          Competitive Advantage
        </h1>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* Left: Bar Chart */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Feature Score Comparison
          </h3>
          <div className="space-y-3">
            {advantages.map((adv, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">{adv.name}</span>
                  <span className="text-blue-600 font-bold">
                    {adv.scholarFlow}%
                  </span>
                </div>
                <div className="relative h-5 bg-slate-200 rounded-full overflow-hidden">
                  {/* ScholarFlow Bar */}
                  <div
                    className={`absolute left-0 top-0 h-full bg-gradient-to-r ${adv.color} rounded-full transition-all duration-500`}
                    style={{ width: `${adv.scholarFlow}%` }}
                  />
                  {/* Competitors Average (dashed line marker) */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-red-400 border-l-2 border-dashed border-red-400"
                    style={{ left: `${adv.others}%` }}
                  />
                </div>
                <div className="text-right text-xs text-red-400">
                  Avg. Competitors: {adv.others}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Unique Advantages */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700">
            What Sets Us Apart
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {uniqueAdvantages.map((adv, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">{adv.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {adv.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">{adv.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white">
            <h4 className="font-bold mb-1">💎 The ScholarFlow Difference</h4>
            <p className="text-sm text-blue-100">
              We're not just another reference manager. We're the first{" "}
              <span className="font-bold text-white">
                AI-native research platform
              </span>{" "}
              built with modern technology for teams who want to accelerate
              their research workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
