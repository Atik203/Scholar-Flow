import {
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  CreditCard,
  FileEdit,
  FolderOpen,
  Highlighter,
  MessageSquare,
  Settings,
  Shield,
  Upload,
} from "lucide-react";

const features = [
  {
    num: "01",
    icon: Upload,
    title: "Smart Upload",
    desc: "Upload PDF/DOCX files with automatic metadata extraction including title, authors, abstract, and keywords.",
    color: "bg-blue-500",
  },
  {
    num: "02",
    icon: Bot,
    title: "AI Summarize",
    desc: "Generate instant AI-powered summaries with key findings, methodology insights, and main conclusions.",
    color: "bg-emerald-500",
  },
  {
    num: "03",
    icon: MessageSquare,
    title: "AI Chat Q&A",
    desc: "Chat with your papers using context-aware AI that understands paper content and answers questions.",
    color: "bg-teal-500",
  },
  {
    num: "04",
    icon: FileEdit,
    title: "Rich Editor",
    desc: "Built-in TipTap editor for writing papers with real-time collaboration and PDF/DOCX export.",
    color: "bg-purple-500",
  },
  {
    num: "05",
    icon: FolderOpen,
    title: "Collections",
    desc: "Organize papers into collections with advanced filtering, tagging, and full-text search capabilities.",
    color: "bg-orange-500",
  },
  {
    num: "06",
    icon: Building2,
    title: "Workspaces",
    desc: "Create team workspaces with role-based access control and shared paper libraries.",
    color: "bg-pink-500",
  },
  {
    num: "07",
    icon: BookOpen,
    title: "Citations",
    desc: "Auto-generate citations in APA, MLA, IEEE, Chicago, and BibTeX formats from paper metadata.",
    color: "bg-indigo-500",
  },
  {
    num: "08",
    icon: Highlighter,
    title: "Annotations",
    desc: "Highlight text, add notes, and bookmark important sections directly on PDF documents.",
    color: "bg-amber-500",
  },
  {
    num: "09",
    icon: BarChart3,
    title: "Analytics",
    desc: "Track reading progress, view usage statistics, and get insights on research activity.",
    color: "bg-cyan-500",
  },
  {
    num: "10",
    icon: CreditCard,
    title: "Billing",
    desc: "Stripe-powered subscription plans with free tier, pro features, and team plans.",
    color: "bg-green-500",
  },
  {
    num: "11",
    icon: Settings,
    title: "Admin Panel",
    desc: "Comprehensive dashboard for user management, system monitoring, and configuration.",
    color: "bg-slate-600",
  },
  {
    num: "12",
    icon: Shield,
    title: "Security",
    desc: "OAuth/JWT authentication, rate limiting, input validation, and HTTPS encryption.",
    color: "bg-red-500",
  },
];

export default function Slide05Features() {
  return (
    <div className="w-full h-full bg-white p-5 flex flex-col">
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          ✨ Complete Feature Set
        </h1>
        <p className="text-slate-500 text-sm">12 Production-Ready Features</p>
      </div>

      {/* Features Grid */}
      <div className="flex-1 grid grid-cols-4 gap-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              {/* Number Badge */}
              <span
                className={`w-5 h-5 ${feature.color} rounded text-white text-[10px] font-bold flex items-center justify-center`}
              >
                {feature.num}
              </span>
              {/* Icon */}
              <div
                className={`w-6 h-6 ${feature.color} rounded-md flex items-center justify-center`}
              >
                <feature.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 text-xs">
                {feature.title}
              </h3>
            </div>
            <p className="text-slate-600 text-[10px] leading-relaxed line-clamp-2">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Stats */}
      <div className="mt-3 grid grid-cols-4 gap-3">
        {[
          { label: "API Endpoints", value: "50+", icon: "🔌" },
          { label: "Database Tables", value: "20+", icon: "🗄️" },
          { label: "TypeScript", value: "100%", icon: "💙" },
          { label: "Test Coverage", value: "95%+", icon: "✅" },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-2 border border-slate-100 text-center"
          >
            <span className="text-lg">{stat.icon}</span>
            <div className="text-lg font-bold text-blue-600">{stat.value}</div>
            <div className="text-[10px] text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
