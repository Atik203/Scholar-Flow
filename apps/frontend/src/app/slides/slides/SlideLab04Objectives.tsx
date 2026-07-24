import { CheckCircle, DollarSign, Sparkles, Target, Users } from "lucide-react";

const objectives = [
  {
    icon: Target,
    title: "Unified Platform",
    description:
      "Centralized platform for paper management and team collaboration",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description: "Intelligent paper summarization, Q&A, and literature review",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: CheckCircle,
    title: "Automated Metadata",
    description:
      "Auto-extract title, authors, abstract, and citations from uploaded PDFs",
    color: "from-green-500 to-green-600",
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    description:
      "Generous free tier with affordable pro plans for teams and individuals",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Role-based workspaces with real-time collaboration and shared libraries",
    color: "from-rose-500 to-rose-600",
  },
];

export default function SlideLab04Objectives() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">
          Project Objectives
        </h2>
        <p className="text-lg text-slate-600">What We Aim to Achieve</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <div className="flex justify-center gap-5">
          {objectives.slice(0, 3).map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 group w-72"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-5">
          {objectives.slice(3, 5).map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 group w-72"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
