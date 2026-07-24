import { CheckCircle, DollarSign, Sparkles, Target, Users } from "lucide-react";

const objectives = [
  {
    icon: Target,
    title: "Unified Platform",
    description: "Single centralized platform for uploading, managing, collaborating on, and analyzing academic papers without switching between multiple tools.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description: "Cutting-edge AI for automatic paper summarization, intelligent Q&A with documents, and automated literature review generation from paper collections.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: CheckCircle,
    title: "Automated Metadata",
    description: "Eliminate manual data entry by automatically extracting title, authors, abstract, keywords, and references from uploaded PDF documents using AI.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: DollarSign,
    title: "Affordable Pricing",
    description: "Robust free tier for students and individual researchers with affordable premium plans for teams, significantly undercutting existing commercial tools.",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Real-time team collaboration with role-based workspaces, shared paper libraries, annotations, and activity tracking for research groups of any size.",
    color: "from-rose-500 to-rose-600",
  },
];

export default function SlideLab04Objectives() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col">
      <div className="text-center mb-5">
        <h2 className="text-3xl font-bold text-black mb-1">Project Objectives</h2>
        <p className="text-xl text-black font-semibold">What We Aim to Achieve with ScholarFlow</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="flex justify-center gap-4">
          {objectives.slice(0, 3).map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200 w-72">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                <p className="text-xl font-semibold text-black leading-snug">{item.description}</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-4">
          {objectives.slice(3, 5).map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200 w-72">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                <p className="text-xl font-semibold text-black leading-snug">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}