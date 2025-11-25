import { CheckCircle, Circle, Clock, Map } from "lucide-react";

const phases = [
  {
    number: 1,
    title: "Foundation & MVP",
    timeline: "Aug - Sep 2025",
    status: "completed",
    color: "from-emerald-500 to-emerald-600",
    features: [
      { name: "Authentication System (OAuth + JWT)", done: true },
      { name: "Paper Management (Upload, S3, Metadata)", done: true },
      { name: "User Profile & Settings", done: true },
      { name: "Basic Collections", done: false },
      { name: "Workspace Setup", done: false },
    ],
  },
  {
    number: 2,
    title: "Collaboration & AI",
    timeline: "Oct - Nov 2025",
    status: "upcoming",
    color: "from-blue-500 to-blue-600",
    features: [
      { name: "Team Workspaces & Permissions", done: false },
      { name: "Real-time Collaboration", done: false },
      { name: "AI Paper Summarization", done: false },
      { name: "AI Literature Review", done: false },
      { name: "AI Chat with Papers", done: false },
    ],
  },
  {
    number: 3,
    title: "Growth & Premium",
    timeline: "Dec 2025 - Jan 2026",
    status: "planned",
    color: "from-purple-500 to-purple-600",
    features: [
      { name: "Premium Subscriptions (Stripe)", done: false },
      { name: "Advanced AI Features", done: false },
      { name: "Rich Text Paper Editor", done: false },
      { name: "API & Integrations", done: false },
      { name: "Mobile Optimization", done: false },
    ],
  },
];

export default function Slide13Roadmap() {
  return (
    <div className="w-full h-full bg-white p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Map className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          Development Roadmap
        </h1>
      </div>

      {/* Timeline */}
      <div className="flex-1">
        {/* Timeline Bar */}
        <div className="relative mb-6">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 -translate-y-1/2" />
          <div className="absolute left-0 w-1/3 top-1/2 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 -translate-y-1/2" />
          <div className="flex justify-between relative">
            {phases.map((phase, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${phase.color} flex items-center justify-center text-white font-bold text-sm shadow-lg ${phase.status === "completed" ? "ring-4 ring-emerald-200" : ""}`}
                >
                  {phase.number}
                </div>
                <div className="mt-2 text-sm font-medium text-slate-700">
                  {phase.timeline}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Cards */}
        <div className="grid grid-cols-3 gap-4">
          {phases.map((phase, index) => (
            <div
              key={index}
              className={`rounded-xl border-2 ${phase.status === "completed" ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"} p-4`}
            >
              {/* Phase Header */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-r ${phase.color} flex items-center justify-center text-white font-bold text-sm`}
                >
                  P{phase.number}
                </div>
                {phase.status === "completed" && (
                  <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                    In Progress
                  </span>
                )}
                {phase.status === "upcoming" && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Upcoming
                  </span>
                )}
                {phase.status === "planned" && (
                  <span className="text-xs bg-slate-400 text-white px-2 py-0.5 rounded-full">
                    Planned
                  </span>
                )}
              </div>

              <h3 className="font-bold text-slate-800 mb-2">{phase.title}</h3>
              <p className="text-xs text-slate-500 mb-3">{phase.timeline}</p>

              {/* Features */}
              <div className="space-y-1.5">
                {phase.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-2 text-sm">
                    {feature.done ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    )}
                    <span
                      className={
                        feature.done ? "text-slate-700" : "text-slate-500"
                      }
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 bg-slate-100 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-blue-600">30%</span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full w-[30%] bg-gradient-to-r from-emerald-500 via-blue-500 to-blue-400 rounded-full" />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>3/15 major features complete</span>
          <span>Target: Q1 2026</span>
        </div>
      </div>
    </div>
  );
}
