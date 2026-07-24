import {
  AlertTriangle,
  Bot,
  Clock,
  DollarSign,
  FolderX,
  Monitor,
  Users,
} from "lucide-react";

const problems = [
  {
    icon: FolderX,
    title: "Fragmented Tools",
    description: "Researchers juggle multiple disconnected apps — Mendeley, Dropbox, Slack — with no unified workflow.",
    stat: "65%",
    statText: "use 4+ different tools",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: Bot,
    title: "No AI Integration",
    description: "No intelligent assistance for paper summarization, literature review, or research analysis.",
    stat: "91%",
    statText: "lack AI assistance",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Users,
    title: "Poor Collaboration",
    description: "Existing tools lack real-time collaboration features and role-based team access control.",
    stat: "78%",
    statText: "struggle with team work",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Clock,
    title: "Manual Processes",
    description: "Time-consuming metadata entry, citation management, and paper organization done entirely by hand.",
    stat: "82%",
    statText: "manually extract metadata",
    color: "from-blue-500 to-indigo-600",
  },
];

export default function SlideLab02Problem() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-black">Problem Statement</h1>
          <p className="text-xl text-black font-semibold">The Research Management Crisis</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-5 gap-4">
        <div className="col-span-3 grid grid-cols-2 gap-3">
          {problems.map((problem, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${problem.color} flex items-center justify-center flex-shrink-0`}>
                  <problem.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-1">{problem.title}</h3>
                  <p className="text-xl font-semibold text-black mb-2 leading-snug">{problem.description}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl font-bold bg-gradient-to-r ${problem.color} bg-clip-text text-transparent`}>{problem.stat}</span>
                    <span className="text-lg font-bold text-black">{problem.statText}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Monitor className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-black">What is ScholarFlow?</h2>
          </div>
          <p className="text-xl font-semibold text-black mb-4 leading-snug">
            An AI-powered collaborative research management platform that unifies paper upload, intelligent analysis, team workspaces, and citation management into a single affordable solution.
          </p>
          <div className="space-y-2 flex-1">
            {[{ icon: "🤖", text: "AI-powered summarization, chat Q&A, and literature review" },
              { icon: "👥", text: "Role-based team workspaces with real-time collaboration" },
              { icon: "☁️", text: "Scalable cloud storage with AWS S3 presigned URLs" },
              { icon: "💰", text: "Affordable pricing with generous free tier for students" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl px-4 py-3 border border-slate-200 flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-xl font-bold text-black">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-white">
          <DollarSign className="w-6 h-6" />
          <span className="text-xl font-bold">Commercial tools cost $50–250/month — Students need affordable solutions</span>
        </div>
      </div>
    </div>
  );
}