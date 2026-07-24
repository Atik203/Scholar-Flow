import { Calendar } from "lucide-react";

const weeks = [
  {
    week: "Week 1",
    title: "Project Setup",
    color: "bg-emerald-500",
    items: [
      "Initialize monorepo (Turborepo)",
      "Set up CI/CD pipeline",
      "Database schema + migrations",
      "Environment configuration",
    ],
  },
  {
    week: "Week 2",
    title: "Authentication",
    color: "bg-blue-500",
    items: [
      "Better Auth setup (OAuth + JWT)",
      "User registration & login",
      "Role-based access control",
      "Auth middleware + guards",
    ],
  },
  {
    week: "Week 3",
    title: "Paper Upload",
    color: "bg-purple-500",
    items: [
      "PDF/DOCX upload pipeline",
      "AWS S3 presigned URLs",
      "Metadata extraction engine",
      "Paper listing & management",
    ],
  },
  {
    week: "Week 4",
    title: "AI Intelligence",
    color: "bg-rose-500",
    items: [
      "Gemini API integration",
      "Paper summarization",
      "AI chat with papers",
      "Embeddings + semantic search",
    ],
  },
  {
    week: "Week 5",
    title: "Editor & Collections",
    color: "bg-amber-500",
    items: [
      "TipTap rich text editor",
      "Auto-save & drafts",
      "Collections with tagging",
      "Citation auto-generation",
    ],
  },
  {
    week: "Week 6",
    title: "Workspaces & Team",
    color: "bg-cyan-500",
    items: [
      "Team workspaces",
      "Role-based permissions",
      "Shared paper libraries",
      "Real-time collaboration",
    ],
  },
  {
    week: "Week 7",
    title: "AI Chat & Search",
    color: "bg-indigo-500",
    items: [
      "Context-aware AI chat",
      "pgvector semantic search",
      "Literature review generation",
      "PDF annotation system",
    ],
  },
  {
    week: "Week 8",
    title: "Billing & Admin",
    color: "bg-green-500",
    items: [
      "Stripe subscription plans",
      "Webhooks & portal",
      "Admin dashboard",
      "Analytics & metrics",
    ],
  },
  {
    week: "Week 9",
    title: "Testing & Deploy",
    color: "bg-slate-600",
    items: [
      "Integration testing",
      "Performance optimization",
      "Production deployment",
      "Documentation & handoff",
    ],
  },
];

export default function SlideLab13Timeline() {
  return (
    <div className="w-full h-full bg-white p-10 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">
          Implementation Timeline
        </h1>
      </div>

      <div className="flex-1 grid grid-cols-9 gap-2">
        {weeks.map((week, i) => (
          <div
            key={i}
            className="bg-slate-50 rounded-lg border border-slate-200 flex flex-col overflow-hidden"
          >
            <div className={`${week.color} text-white text-center py-1.5`}>
              <p className="text-xs font-bold">{week.week}</p>
            </div>
            <div className="p-2 flex-1">
              <h3 className="font-bold text-black text-xs mb-1.5 text-center">
                {week.title}
              </h3>
              <ul className="space-y-1">
                {week.items.map((item, j) => (
                  <li key={j} className="text-[10px] text-slate-600 leading-tight flex items-start gap-1">
                    <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200 text-center">
        <span className="text-sm font-medium text-slate-700">
          <span className="font-bold text-blue-700">Duration:</span> Late July –
          Late September (9 weeks) · 4 team members · Monorepo + Turborepo
        </span>
      </div>
    </div>
  );
}
