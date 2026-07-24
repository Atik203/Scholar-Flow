import { Calendar } from "lucide-react";

const weeks = [
  { week: "W1 - Setup", color: "bg-emerald-500", items: ["Initialize Turborepo monorepo with Yarn Berry and all build configs", "Set up CI/CD pipeline with ESLint, Prettier, and type-check on every PR", "Define Prisma schema with pgvector extension, run initial DB migrations", "Configure all environment variables, adapters, and development tooling"] },
  { week: "W2 - Auth", color: "bg-blue-500", items: ["Implement Better Auth with Google OAuth, GitHub OAuth, email/password", "Build user registration, login, password reset, and email verification", "Set up role-based access control (RBAC) with admin and member roles", "Create auth middleware and route protection for all API endpoints"] },
  { week: "W3 - Upload", color: "bg-purple-500", items: ["Build PDF/DOCX upload pipeline with secure AWS S3 presigned URLs", "Implement AI-powered metadata extraction for title, authors, and abstract", "Create paper listing with search, filtering, sorting, and pagination", "Add paper detail view, download, and delete functionality"] },
  { week: "W4 - AI Core", color: "bg-rose-500", items: ["Integrate Gemini and OpenAI APIs for automatic paper summarization", "Implement key findings extraction with methodology and conclusions", "Build AI chat interface for interactive paper Q&A sessions", "Generate vector embeddings for pgvector semantic search"] },
  { week: "W5 - Editor", color: "bg-amber-500", items: ["Integrate TipTap rich text editor with real-time collaborative editing", "Implement auto-save with debounce and draft/publish state workflows", "Build collections with tagging, filtering, and full-text search", "Create citation auto-generation for APA, MLA, IEEE, Chicago, BibTeX"] },
];

const weeks2 = [
  { week: "W6 - Team", color: "bg-cyan-500", items: ["Build team workspace creation, invitations, and member management", "Implement role-based permissions with viewer, editor, and admin roles", "Create shared paper libraries within team workspaces", "Add real-time collaboration with presence indicators and activity feed"] },
  { week: "W7 - AI Chat", color: "bg-indigo-500", items: ["Implement context-aware AI chat across all papers and collections", "Build pgvector-powered semantic search for full-text discovery", "Create automated literature review generation from collections", "Implement PDF annotation system with highlights, notes, and bookmarks"] },
  { week: "W8 - Billing", color: "bg-green-500", items: ["Integrate Stripe subscription plans with free, pro, and team tiers", "Implement webhook handlers for payment events and lifecycle management", "Build admin dashboard for user, subscription, and system management", "Add analytics dashboard with usage metrics and visual reports"] },
  { week: "W9 - Deploy", color: "bg-slate-600", items: ["Write comprehensive integration tests and end-to-end test coverage", "Performance optimization with caching, lazy loading, and code splitting", "Production deployment to Vercel (frontend) and Railway (backend)", "Create final documentation, demo preparation, and project handoff"] },
];

interface TimelineWeek {
  week: string;
  color: string;
  items: string[];
}

function TimelineRow({ weeks, startIndex }: { weeks: TimelineWeek[]; startIndex: number }) {
  return (
    <div className="grid grid-cols-5 gap-2 flex-1">
      {weeks.map((week, i) => (
        <div key={i} className="bg-slate-50 rounded-lg border border-slate-200 flex flex-col overflow-hidden">
          <div className={`${week.color} text-white text-center py-1.5`}>
            <p className="text-sm font-bold">{week.week}</p>
          </div>
          <div className="p-2 flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {week.items.map((item, j) => (
                <li key={j} className="text-[11px] text-black leading-tight flex items-start gap-1">
                  <span className="text-blue-600 mt-0.5 flex-shrink-0 font-bold">•</span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SlideLab14Timeline() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">Implementation Timeline</h1>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <TimelineRow weeks={weeks} startIndex={0} />
        <TimelineRow weeks={weeks2} startIndex={5} />
      </div>

      <div className="mt-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-2 border border-blue-200 text-center">
        <span className="text-lg font-bold text-black">
          <span className="text-blue-700">Duration:</span> Late July – Late September (9 weeks) · 4 team members · Monorepo with Turborepo
        </span>
      </div>
    </div>
  );
}