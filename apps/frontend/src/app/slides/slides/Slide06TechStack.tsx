import { Layers } from "lucide-react";
import {
  SiAmazons3,
  SiDocker,
  SiExpress,
  SiJsonwebtokens,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiRedis,
  SiRedux,
  SiStripe,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiZod,
} from "react-icons/si";

const frontendStack = [
  { icon: SiNextdotjs, name: "Next.js 15", color: "#000000" },
  { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
  { icon: SiTailwindcss, name: "Tailwind CSS", color: "#06B6D4" },
  { icon: SiReact, name: "React 18", color: "#61DAFB" },
  { icon: SiRedux, name: "Redux Toolkit", color: "#764ABC" },
  { icon: SiZod, name: "Zod", color: "#3E67B1" },
];

const backendStack = [
  { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
  { icon: SiExpress, name: "Express.js", color: "#000000" },
  { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
  { icon: SiPrisma, name: "Prisma ORM", color: "#2D3748" },
  { icon: SiJsonwebtokens, name: "JWT Auth", color: "#000000" },
  { icon: SiZod, name: "Zod", color: "#3E67B1" },
];

const infraStack = [
  { icon: SiPostgresql, name: "PostgreSQL", color: "#4169E1" },
  { icon: SiRedis, name: "Redis Cache", color: "#DC382D" },
  { icon: SiAmazons3, name: "AWS S3", color: "#569A31" },
  { icon: SiVercel, name: "Vercel", color: "#000000" },
  { icon: SiStripe, name: "Stripe", color: "#635BFF" },
  { icon: SiDocker, name: "Docker", color: "#2496ED" },
];

const TechBadge = ({
  icon: Icon,
  name,
  color,
}: {
  icon: any;
  name: string;
  color: string;
}) => (
  <div className="bg-white rounded-lg px-3 py-2 border border-slate-200 flex items-center gap-2 hover:shadow-md transition-shadow">
    <Icon className="w-5 h-5" style={{ color }} />
    <span className="text-slate-700 text-sm font-medium">{name}</span>
  </div>
);

export default function Slide06TechStack() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">
          Modern Technology Stack
        </h1>
      </div>

      {/* Stack Sections */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Frontend */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <h2 className="text-lg font-bold text-slate-800">🖥️ Frontend</h2>
            <span className="text-slate-400 text-sm ml-auto">
              App Router + SSR
            </span>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {frontendStack.map((tech, index) => (
              <TechBadge key={index} {...tech} />
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            ↓
          </div>
        </div>

        {/* Backend */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h2 className="text-lg font-bold text-slate-800">⚙️ Backend API</h2>
            <span className="text-slate-400 text-sm ml-auto">
              REST API + Raw SQL
            </span>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {backendStack.map((tech, index) => (
              <TechBadge key={index} {...tech} />
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
            ↓
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <h2 className="text-lg font-bold text-slate-800">
              🗄️ Database & Infrastructure
            </h2>
            <span className="text-slate-400 text-sm ml-auto">Cloud-Native</span>
          </div>
          <div className="grid grid-cols-6 gap-3">
            {infraStack.map((tech, index) => (
              <TechBadge key={index} {...tech} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
