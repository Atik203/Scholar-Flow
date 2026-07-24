import { CheckCircle, Github, Globe } from "lucide-react";

const takeaways = [
  {
    title: "Real Problem",
    desc: "Addresses critical gaps in research tooling — fragmented tools, no AI, poor collaboration",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Technically Feasible",
    desc: "Built with modern stack: Next.js 16, Express, PostgreSQL + pgvector, AI APIs",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Clear Plan",
    desc: "9-week structured timeline with defined milestones and weekly deliverables",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Team Ready",
    desc: "4-member team with full-stack expertise, monorepo workflow, CI/CD in place",
    color: "from-amber-500 to-amber-600",
  },
];

export default function SlideLab14Conclusion() {
  return (
    <div className="w-full h-full bg-white p-14 flex flex-col">
      <h1 className="text-4xl font-bold text-black text-center mb-2">
        Conclusion
      </h1>
      <p className="text-slate-500 text-center mb-8 text-lg">
        Why ScholarFlow is Ready to Build
      </p>

      <div className="flex-1 grid grid-cols-2 gap-5 mb-6">
        {takeaways.map((item, i) => (
          <div
            key={i}
            className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex gap-4"
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}
            >
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-black text-xl mb-2">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-8">
        <a
          href="https://github.com/Atik203/Scholar-Flow"
          className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-700 transition-colors"
        >
          <Github className="w-5 h-5" />
          GitHub Repository
        </a>
        <a
          href="https://scholar-flow-ai.vercel.app"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          <Globe className="w-5 h-5" />
          Live Demo
        </a>
      </div>
    </div>
  );
}
