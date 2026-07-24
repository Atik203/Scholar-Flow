import { AlertTriangle, Bot, Clock, DollarSign, FolderX, Monitor, Sparkles, Users } from "lucide-react";

const problems = [
  {
    icon: FolderX,
    title: "Fragmented Tools",
    description: "Researchers juggle 4+ disconnected apps — Mendeley, Dropbox, Slack — with no unified workflow or central repository for their papers.",
    stat: "65%",
    statText: "use 4+ different tools",
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-50 border-rose-100",
  },
  {
    icon: Bot,
    title: "No AI Integration",
    description: "No intelligent assistance for paper summarization, literature review, or research analysis. Everything is done manually.",
    stat: "91%",
    statText: "lack AI assistance",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 border-amber-100",
  },
  {
    icon: Users,
    title: "Poor Collaboration",
    description: "Existing tools lack real-time collaboration features and role-based team access control for research groups.",
    stat: "78%",
    statText: "struggle with team work",
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-50 border-purple-100",
  },
  {
    icon: Clock,
    title: "Manual Processes",
    description: "Time-consuming metadata entry, citation management, and paper organization are still done entirely by hand.",
    stat: "82%",
    statText: "manually extract metadata",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 border-blue-100",
  },
];

export default function SlideLab02Problem() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-12 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs uppercase tracking-wider font-extrabold text-rose-600 bg-rose-100/80 px-2.5 py-0.5 rounded-full border border-rose-200">
                Key Challenges
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Problem Statement</h1>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200/90 shadow-sm">
          <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
          <span className="text-lg font-bold text-slate-800">The Research Management Crisis</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-5 gap-4 relative z-10 min-h-0">
        {/* Left Side: 4 Problems Grid (3 columns) */}
        <div className="col-span-3 grid grid-cols-2 gap-4">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/90 shadow-md shadow-slate-100 flex flex-col justify-between hover:border-blue-300 transition-all duration-200"
            >
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center flex-shrink-0 shadow-md shadow-slate-200`}>
                    <problem.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{problem.title}</h3>
                </div>

                <p className="text-xl font-medium text-slate-700 leading-snug text-justify mb-3">
                  {problem.description}
                </p>
              </div>

              <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${problem.bgColor}`}>
                <span className={`text-3xl font-black bg-gradient-to-r ${problem.color} bg-clip-text text-transparent`}>
                  {problem.stat}
                </span>
                <span className="text-lg font-bold text-slate-800 leading-tight">
                  {problem.statText}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: What is ScholarFlow Solution (2 columns) */}
        <div className="col-span-2 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-2xl p-5 shadow-xl shadow-indigo-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-blue-100 bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
                  The Solution
                </span>
                <h2 className="text-2xl font-extrabold text-white">What is ScholarFlow?</h2>
              </div>
            </div>

            <p className="text-xl font-medium text-white leading-snug text-justify mb-3">
              An AI-powered collaborative research management platform that unifies paper upload, intelligent analysis, team workspaces, and citation management into a single affordable solution.
            </p>

            <div className="space-y-2">
              {[
                { icon: "🤖", text: "AI-powered paper summarization, chat Q&A, and literature review" },
                { icon: "👥", text: "Role-based team workspaces with real-time collaboration" },
                { icon: "🔍", text: "pgvector semantic search for instant literature discovery" },
                { icon: "📝", text: "TipTap rich text editor with auto-save & PDF/DOCX export" },
                { icon: "☁️", text: "Scalable cloud storage with AWS S3 presigned URLs" },
                { icon: "💰", text: "Affordable pricing with generous free tier for students" },
              ].map((item, i) => (
                <div key={i} className="bg-white/12 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20 flex items-center gap-2.5">
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <span className="text-xl font-bold text-white leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Commercial Cost Banner */}
      <div className="mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-xl p-3 text-center shadow-lg shadow-blue-500/20 border border-blue-400/30 relative z-10">
        <div className="flex items-center justify-center gap-2.5 text-white">
          <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-amber-300">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-wide">
            Commercial tools cost <span className="text-amber-300 font-extrabold">$50–$250/month</span> — Students & Researchers need an accessible, unified solution.
          </span>
        </div>
      </div>
    </div>
  );
}