import { Crown, Rocket, TrendingUp, Zap } from "lucide-react";

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
    <div className="w-full h-full bg-white p-16 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
          <Crown className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-black">
            Competitive Advantage
          </h1>
          <p className="text-black text-lg font-medium">
            Why ScholarFlow Stands Out
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Left: Bar Chart */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
          <h3 className="text-xl font-bold text-black mb-5 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Feature Score Comparison
          </h3>
          <div className="space-y-4">
            {advantages.map((adv, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between text-base">
                  <span className="text-black font-semibold">{adv.name}</span>
                  <span className="text-blue-700 font-bold">
                    {adv.scholarFlow}%
                  </span>
                </div>
                <div className="relative h-6 bg-slate-200 rounded-full overflow-hidden">
                  {/* ScholarFlow Bar */}
                  <div
                    className={`absolute left-0 top-0 h-full bg-gradient-to-r ${adv.color} rounded-full transition-all duration-500`}
                    style={{ width: `${adv.scholarFlow}%` }}
                  />
                  {/* Competitors Average (dashed line marker) */}
                  <div
                    className="absolute top-0 h-full w-0.5 bg-red-600"
                    style={{ left: `${adv.others}%` }}
                  />
                </div>
                <div className="text-right text-sm text-red-700 font-semibold">
                  Avg. Competitors: {adv.others}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Unique Advantages */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-black flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            What Sets Us Apart
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {uniqueAdvantages.map((adv, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{adv.icon}</span>
                  <div>
                    <h4 className="text-base font-bold text-black">
                      {adv.title}
                    </h4>
                    <p className="text-sm text-black mt-1 font-medium">
                      {adv.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="w-5 h-5" />
              <h4 className="font-bold text-lg">The ScholarFlow Difference</h4>
            </div>
            <p className="text-sm text-blue-100">
              We're building the first{" "}
              <span className="font-bold text-white">
                AI-native research collaboration platform
              </span>{" "}
              designed for modern research teams who want to accelerate their
              workflow with intelligent tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
