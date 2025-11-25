"use client";

import { CheckCircle, DollarSign, Sparkles, Target, Users } from "lucide-react";

export default function Slide05Scope() {
  const scopeItems = [
    {
      icon: Target,
      title: "Unified Platform",
      description:
        "Provide a centralized platform for paper management and collaboration",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description:
        "Integrate AI for intelligent paper analysis, summarization, and Q&A",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: CheckCircle,
      title: "Automated Metadata",
      description:
        "Automate metadata extraction and citation management from PDFs",
      color: "from-green-500 to-green-600",
    },
    {
      icon: DollarSign,
      title: "Affordable Pricing",
      description:
        "Offer competitive pricing with a generous free tier for individuals",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Enable real-time collaboration with role-based access control",
      color: "from-rose-500 to-rose-600",
    },
  ];

  return (
    <div className="w-full h-full bg-white p-8 flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">
          Project Scope
        </h2>
        <p className="text-lg text-slate-600">Solution Goals & Objectives</p>
      </div>

      {/* Scope Items - All in one container */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* First row - 3 items */}
        <div className="flex justify-center gap-6">
          {scopeItems.slice(0, 3).map((item, index) => {
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

        {/* Second row - 2 items centered */}
        <div className="flex justify-center gap-6">
          {scopeItems.slice(3, 5).map((item, index) => {
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
