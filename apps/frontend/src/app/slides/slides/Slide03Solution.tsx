import {
  BarChart3,
  Bot,
  CheckCircle2,
  Lightbulb,
  Upload,
  Users,
} from "lucide-react";

const solutions = [
  {
    icon: Upload,
    title: "Smart Upload",
    description: "PDF/DOCX with auto metadata extraction",
    color: "bg-blue-500",
  },
  {
    icon: Bot,
    title: "AI Insights",
    description: "Gemini AI summarization & chat Q&A",
    color: "bg-emerald-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Workspaces with role-based access",
    color: "bg-orange-500",
  },
  {
    icon: BarChart3,
    title: "Research Analytics",
    description: "Citations, annotations & insights",
    color: "bg-purple-500",
  },
];

const benefits = [
  "Centralized cloud storage with AWS S3",
  "Multi-provider AI (Gemini + OpenAI)",
  "Role-based workspaces & permissions",
  "Automated PDF processing pipeline",
  "Modern Next.js 15 + PostgreSQL stack",
  "Affordable pricing with free tier",
];

export default function Slide03Solution() {
  return (
    <div className="w-full h-full bg-white p-16 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Lightbulb className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-black">Proposed Solution</h1>
          <p className="text-black text-lg">Introducing ScholarFlow</p>
        </div>
      </div>

      {/* Tagline */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl py-4 px-8 text-center mb-8">
        <span className="text-white text-2xl font-bold">
          ONE PLATFORM. ALL RESEARCH. AI-POWERED.
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* Left - Solution Cards */}
        <div className="grid grid-cols-2 gap-4">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div
                className={`w-14 h-14 ${solution.color} rounded-xl flex items-center justify-center mb-3`}
              >
                <solution.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-black mb-2 text-lg">
                {solution.title}
              </h3>
              <p className="text-black text-base">{solution.description}</p>
            </div>
          ))}
        </div>

        {/* Right - Benefits List */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-100">
          <h3 className="text-xl font-bold text-black mb-5 flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            Solution Approach
          </h3>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-black text-base leading-relaxed font-medium">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision Statement */}
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <p className="text-slate-700 text-center">
          <span className="text-blue-600 font-bold">Vision:</span> Transform how
          researchers
          <span className="text-emerald-600 font-medium"> discover</span>,
          <span className="text-orange-600 font-medium"> organize</span>,
          <span className="text-purple-600 font-medium"> collaborate</span>, and
          <span className="text-pink-600 font-medium">
            {" "}
            extract insights
          </span>{" "}
          from academic papers
        </p>
      </div>
    </div>
  );
}
