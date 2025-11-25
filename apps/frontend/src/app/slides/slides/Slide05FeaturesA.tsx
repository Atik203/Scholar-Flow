import {
  Bot,
  Building2,
  FileEdit,
  FolderOpen,
  MessageSquare,
  Upload,
} from "lucide-react";

const features = [
  {
    num: "01",
    icon: Upload,
    title: "Smart Upload",
    desc: "Upload PDF/DOCX files with automatic metadata extraction including title, authors, abstract, and keywords.",
    color: "from-blue-500 to-blue-600",
  },
  {
    num: "02",
    icon: Bot,
    title: "AI Summarize",
    desc: "Generate instant AI-powered summaries with key findings, methodology insights, and main conclusions.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    num: "03",
    icon: MessageSquare,
    title: "AI Chat Q&A",
    desc: "Chat with your papers using context-aware AI that understands paper content and answers questions.",
    color: "from-teal-500 to-teal-600",
  },
  {
    num: "04",
    icon: FileEdit,
    title: "Rich Text Editor",
    desc: "Built-in TipTap editor for writing papers with real-time collaboration and PDF/DOCX export capability.",
    color: "from-purple-500 to-purple-600",
  },
  {
    num: "05",
    icon: FolderOpen,
    title: "Collections",
    desc: "Organize papers into collections with advanced filtering, tagging, and full-text search capabilities.",
    color: "from-orange-500 to-orange-600",
  },
  {
    num: "06",
    icon: Building2,
    title: "Team Workspaces",
    desc: "Create team workspaces with role-based access control and shared paper libraries for collaboration.",
    color: "from-pink-500 to-pink-600",
  },
];

export default function Slide05FeaturesA() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-white via-slate-50 to-blue-50 p-16 flex flex-col">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-base font-semibold mb-4">
          <span>✨</span> Core Features
        </div>
        <h1 className="text-4xl font-bold text-black">
          Key Features <span className="text-blue-600">(1/2)</span>
        </h1>
      </div>

      {/* Features Grid - 2x3 */}
      <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all group"
          >
            {/* Header Row */}
            <div className="flex items-center gap-3 mb-3">
              {/* Icon */}
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              {/* Number Badge */}
              <span
                className={`w-8 h-8 bg-gradient-to-br ${feature.color} rounded-lg text-white text-sm font-bold flex items-center justify-center`}
              >
                {feature.num}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-black text-xl mb-3">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-black text-base leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
