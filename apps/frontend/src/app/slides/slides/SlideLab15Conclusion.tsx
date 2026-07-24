import { CheckCircle, Github, Globe } from "lucide-react";

const takeaways = [
  {
    title: "Real Problem Solved",
    desc: "ScholarFlow addresses critical gaps — fragmented tools, no AI integration, poor collaboration, and high costs. Over 91% of researchers currently lack AI assistance in their workflow.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Technically Feasible",
    desc: "Built with a modern stack: Next.js 16, Express.js, PostgreSQL with pgvector for semantic search, AWS S3 for storage, and multi-provider AI from Gemini and OpenAI. Scalable and cloud-native.",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Clear Plan",
    desc: "9-week structured timeline with defined milestones per week. Each phase has concrete deliverables. Monorepo best practices with CI/CD, automated testing, and type-safe development.",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "Team Ready",
    desc: "Four-member team with full-stack expertise: Turborepo monorepo, TypeScript across the stack, React, Express, Prisma ORM, and cloud deployment. Existing codebase with 20+ features built.",
    color: "from-amber-500 to-amber-600",
  },
];

export default function SlideLab15Conclusion() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      <h1 className="text-3xl font-bold text-black text-center mb-1">Conclusion</h1>
      <p className="text-2xl font-bold text-black text-center mb-4">Why ScholarFlow is Ready for Development</p>

      <div className="flex-1 grid grid-cols-2 gap-3 mb-4">
        {takeaways.map((item, i) => (
          <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-black text-2xl mb-1">{item.title}</h3>
              <p className="text-2xl font-normal text-black leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        <a href="https://github.com/Atik203/Scholar-Flow" className="flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-slate-700 transition-colors">
          <Github className="w-5 h-5" /> GitHub
        </a>
        <a href="https://scholar-flow-ai.vercel.app" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors">
          <Globe className="w-5 h-5" /> Live Demo
        </a>
      </div>
    </div>
  );
}