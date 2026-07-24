import { Calendar } from "lucide-react";

const weeks = [
  { week: "W1", title: "Setup", color: "bg-emerald-500", items: ["Initialize Turborepo monorepo with Yarn Berry and build config", "Set up CI/CD pipeline with ESLint, Prettier, and type-checking", "Define Prisma schema, run initial DB migrations with pgvector", "Configure environment variables, adapters, and dev tooling"] },
  { week: "W2", title: "Auth", color: "bg-blue-500", items: ["Implement Better Auth with Google OAuth and GitHub OAuth login", "Build user registration, login, password reset, and email verify", "Set up role-based access control with admin and member roles", "Create auth middleware and route protection for all API routes"] },
  { week: "W3", title: "Upload", color: "bg-purple-500", items: ["Build PDF/DOCX upload pipeline with secure AWS S3 presigned URLs", "Implement AI-powered metadata extraction for title, authors, abstract", "Create paper listing, search, filtering, and pagination system", "Add paper detail view with download and delete functionality"] },
  { week: "W4", title: "AI Core", color: "bg-rose-500", items: ["Integrate Gemini and OpenAI APIs for paper summarization feature", "Implement key findings extraction with methodology and conclusions", "Build AI chat interface for interactive paper Q&A sessions", "Generate vector embeddings for pgvector-powered semantic search"] },
  { week: "W5", title: "Editor", color: "bg-amber-500", items: ["Integrate TipTap rich text editor with collaborative editing", "Implement auto-save with debounce, draft/publish state workflows", "Build collections with tagging, filtering, and full-text search", "Create citation auto-generation for APA, MLA, IEEE, Chicago, BibTeX"] },
  { week: "W6", title: "Team", color: "bg-cyan-500", items: ["Build team workspace creation, invitation, and management system", "Implement role-based permissions — viewer, editor, and admin roles", "Create shared paper libraries within team workspaces", "Add real-time collaboration with presence and activity tracking"] },
  { week: "W7", title: "AI Chat", color: "bg-indigo-500", items: ["Implement context-aware AI chat across papers and collections", "Build pgvector-powered semantic search for full-text discovery", "Create automated literature review generation from collections", "Implement PDF annotation system with highlights, notes, bookmarks"] },
  { week: "W8", title: "Billing", color: "bg-green-500", items: ["Integrate Stripe subscription plans with tiered pricing model", "Implement webhook handlers for payment events and lifecycle", "Build admin dashboard for user, subscription, and system management", "Add analytics dashboard with usage metrics and visual reports"] },
  { week: "W9", title: "Deploy", color: "bg-slate-600", items: ["Write comprehensive integration tests and end-to-end test suite", "Performance optimization with caching, lazy loading, code splitting", "Production deployment to Vercel for frontend and Railway for backend", "Final documentation, demo preparation, and project handoff"] },
];

export default function SlideLab14Timeline() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">Implementation Timeline</h1>
      </div>

      <div className="flex-1 grid grid-cols-9 gap-1.5">
        {weeks.map((week, i) => (
          <div key={i} className="bg-slate-50 rounded-lg border border-slate-200 flex flex-col overflow-hidden">
            <div className={`${week.color} text-white text-center py-1.5`}>
              <p className="text-sm font-bold">{week.week}</p>
            </div>
            <div className="p-1.5 flex-1">
              <h3 className="font-bold text-black text-xs mb-1 text-center">{week.title}</h3>
              <ul className="space-y-1">
                {week.items.map((item, j) => (
                  <li key={j} className="text-[10px] text-black font-semibold leading-tight flex items-start gap-1">
                    <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200 text-center">
        <span className="text-xl font-bold text-black">
          <span className="text-blue-700">Duration:</span> Late July – Late September (9 weeks) · 4 team members · Monorepo with Turborepo
        </span>
      </div>
    </div>
  );
}