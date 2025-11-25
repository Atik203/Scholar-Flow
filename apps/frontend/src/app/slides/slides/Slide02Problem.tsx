import {
  AlertTriangle,
  Bot,
  Clock,
  DollarSign,
  FolderX,
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

export default function Slide02Problem() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Problem Statement
          </h1>
          <p className="text-slate-500">The Research Management Crisis</p>
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div className="flex-1 grid grid-cols-2 gap-4">
        {problems.map((problem, index) => (
          <div
            key={index}
            className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center flex-shrink-0`}
              >
                <problem.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  {problem.title}
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  {problem.description}
                </p>

                {/* Stat Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-2xl font-bold bg-gradient-to-r ${problem.color} bg-clip-text text-transparent`}
                  >
                    {problem.stat}
                  </span>
                  <span className="text-slate-500 text-sm">
                    {problem.statText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Banner */}
      <div className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-white">
          <DollarSign className="w-5 h-5" />
          <span className="font-medium">
            Commercial tools cost $50-250/month — Students need affordable
            solutions
          </span>
        </div>
      </div>
    </div>
  );
}
