import {
  AlertTriangle,
  Bot,
  Clock,
  FolderX,
  Monitor,
  Users,
} from "lucide-react";

const problems = [
  {
    icon: FolderX,
    title: "Fragmented Tools",
    description:
      "Researchers juggle multiple disconnected apps (Mendeley, Dropbox, Slack)",
    stat: "65%",
    statText: "use 4+ different tools",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: Bot,
    title: "No AI Integration",
    description:
      "Lack of intelligent assistance for paper summarization and analysis",
    stat: "91%",
    statText: "lack AI assistance",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Users,
    title: "Poor Collaboration",
    description:
      "Existing tools lack real-time collaboration and role-based access",
    stat: "78%",
    statText: "struggle with team work",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Clock,
    title: "Manual Processes",
    description: "Time-consuming metadata entry and citation management",
    stat: "82%",
    statText: "manually extract metadata",
    color: "from-blue-500 to-indigo-600",
  },
];

export default function SlideLab02Problem() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-black">Problem Statement</h1>
          <p className="text-black text-lg">The Research Management Crisis</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-5 gap-5">
        {/* Left: Problem cards */}
        <div className="col-span-3 grid grid-cols-2 gap-4">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-4 border border-slate-100"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center flex-shrink-0`}
                >
                  <problem.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black mb-1">
                    {problem.title}
                  </h3>
                  <p className="text-black text-sm mb-2">
                    {problem.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-2xl font-bold bg-gradient-to-r ${problem.color} bg-clip-text text-transparent`}
                    >
                      {problem.stat}
                    </span>
                    <span className="text-black text-sm font-medium">
                      {problem.statText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Project Description */}
        <div className="col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Monitor className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-black">
              What is ScholarFlow?
            </h2>
          </div>
          <p className="text-black text-base mb-5 leading-relaxed">
            An AI-powered collaborative research management platform that unifies
            paper upload, intelligent analysis, team workspaces, and citation
            management into a single, affordable solution.
          </p>
          <div className="space-y-3">
            {[
              { icon: "🤖", text: "AI-powered paper summarization & chat" },
              { icon: "👥", text: "Role-based team collaboration" },
              { icon: "☁️", text: "Cloud storage with AWS S3" },
              { icon: "💰", text: "Affordable pricing with free tier" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-lg px-4 py-2.5 border border-slate-200 flex items-center gap-3"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-black text-sm font-medium">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
