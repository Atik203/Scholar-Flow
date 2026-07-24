import { Brain, DollarSign, Shield, Target, Users, Zap } from "lucide-react";

const motivations = [
  {
    icon: Zap, title: "Productivity Loss",
    problem: "Researchers juggle 4+ disconnected applications daily, wasting valuable time switching between tools instead of doing actual research.",
    impact: "3+ hours/week wasted on tool switching",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: Users, title: "Collaboration Gaps",
    problem: "No centralized platform for team paper management leads to version conflicts, lost feedback, and siloed work across research groups.",
    impact: "78% struggle with research collaboration",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Brain, title: "No AI Assistance",
    problem: "Researchers spend hours manually reading and analyzing papers when AI can extract key insights and findings in just seconds.",
    impact: "Hours spent on what AI can do in seconds",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: DollarSign, title: "High Costs",
    problem: "Commercial reference managers charge $50–250/month, putting essential research tools out of reach for students and independent researchers.",
    impact: "Unaffordable for students & individuals",
    color: "from-emerald-500 to-teal-600",
  },
];

const goals = [
  { icon: "🎯", text: "Unified platform for paper management and team collaboration" },
  { icon: "🤖", text: "AI-powered paper summarization and contextual chat Q&A with your documents" },
  { icon: "💰", text: "Affordable pricing with a generous free tier accessible to all researchers" },
  { icon: "🔐", text: "Enterprise-grade security, permissions, and data protection for academic work" },
  { icon: "📱", text: "Modern, responsive user experience built with latest web technologies" },
];

export default function SlideLab03Motivation() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
          <Target className="w-7 h-7 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-black">Motivation</h1>
          <p className="text-2xl font-bold text-black">Why We Built ScholarFlow</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-3">
        <div className="col-span-2 grid grid-cols-2 gap-3">
          {motivations.map((item, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black">{item.title}</h3>
              </div>
              <p className="text-2xl font-normal text-black mb-2 leading-snug">{item.problem}</p>
              <div className="bg-white rounded-lg px-3 py-2 border border-slate-200">
                <span className="text-base font-bold text-red-600">⚠️ {item.impact}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <h3 className="text-2xl font-bold text-black mb-3 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Solution Goals
          </h3>
          <div className="space-y-2">
            {goals.map((goal, index) => (
              <div key={index} className="bg-white rounded-lg px-3 py-2.5 border border-slate-200 flex items-center gap-2">
                <span className="text-lg">{goal.icon}</span>
                <span className="text-2xl font-bold text-black">{goal.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
        <p className="text-center text-black text-lg font-bold italic">
          &quot;Researchers deserve tools that are as intelligent as the work they do — <span className="text-blue-600">ScholarFlow makes that possible.</span>&quot;
        </p>
      </div>
    </div>
  );
}