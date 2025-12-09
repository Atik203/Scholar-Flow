import {
  Brain,
  FolderKanban,
  LineChart,
  PencilRuler,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Unified Paper Library",
    stat: "55.2% want collections & search",
    description:
      "Smart collections, advanced search (full-text, author, tags), drag-and-drop bulk upload, AI metadata extraction, duplicate detection.",
    icon: FolderKanban,
  },
  {
    title: "Rich PDF & Notes",
    stat: "69% need in-browser annotation",
    description:
      "Contextual highlights, linked notes, TipTap editor, export to PDF/DOCX, auto-save with status badges, keyboard shortcuts.",
    icon: PencilRuler,
  },
  {
    title: "AI Research Assistant",
    stat: "65.5% want comparisons & mind maps",
    description:
      "Gemini-first with OpenAI fallback; summaries, paper Q&A, cached responses, rate limits, streaming, roadmap for comparisons.",
    icon: Brain,
  },
  {
    title: "Collaboration & Roles",
    stat: "62.1% need role-based access",
    description:
      "Shared workspaces, 5-tier permissions, invitations with email, activity logs, collection-level controls, solo-to-shared messaging.",
    icon: Users,
  },
  {
    title: "Analytics & Reliability",
    stat: "55.2% want reading overview",
    description:
      "Personal/workspace dashboards, streaks, upload trends, health monitoring (CPU/memory/DB), auto-refresh with polling.",
    icon: LineChart,
  },
];

export default function Slide03SelectedFeatures() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
      <div className="absolute top-0 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

      <header className="relative z-10 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Product Direction
          </p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">
            List of Selected Features
          </h1>
          <p className="text-lg text-slate-600 mt-2 max-w-4xl">
            Feature shortlist grounded entirely in survey validation to keep
            scope tight and high-impact for launch.
          </p>
        </div>
        <div className="bg-white/80 border border-slate-200 rounded-2xl px-5 py-3 shadow-sm backdrop-blur max-w-sm">
          <p className="text-xs text-slate-500">Validation snapshot</p>
          <p className="font-semibold text-slate-800">
            • 75%+ express need · 81%+ show interest · 0% uninterested in AI
          </p>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    Survey-backed
                  </p>
                  <p className="font-semibold text-slate-900">{feature.stat}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed flex-1">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
