import { Layers } from "lucide-react";
import {
  SiAmazons3,
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
  <div className="bg-white rounded-lg px-5 py-3 border border-slate-200 flex items-center gap-3 hover:shadow-md transition-shadow">
    <Icon className="w-8 h-8" style={{ color }} />
    <span className="text-black text-lg font-semibold">{name}</span>
  </div>
);

export default function Slide06TechStack() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 p-16 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Layers className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-black">
          Modern Technology Stack
        </h1>
      </div>

      {/* Stack Sections */}
      <div className="flex-1 flex flex-col gap-5">
        {/* Frontend */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <h2 className="text-2xl font-bold text-black">🖥️ Frontend</h2>
            <span className="text-black text-lg ml-auto font-medium">
              App Router + SSR
            </span>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {frontendStack.map((tech, index) => (
              <TechBadge key={index} {...tech} />
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
            ↓
          </div>
        </div>

        {/* Backend */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-4 h-4 rounded-full bg-emerald-500" />
            <h2 className="text-2xl font-bold text-black">⚙️ Backend API</h2>
            <span className="text-black text-lg ml-auto font-medium">
              REST API + SQL
            </span>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {backendStack.map((tech, index) => (
              <TechBadge key={index} {...tech} />
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl font-bold">
            ↓
          </div>
        </div>

        {/* Infrastructure */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-4 h-4 rounded-full bg-purple-500" />
            <h2 className="text-2xl font-bold text-black">
              🗄️ Database & Infrastructure
            </h2>
            <span className="text-black text-lg ml-auto font-medium">
              Cloud-Native
            </span>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {infraStack.map((tech, index) => (
              <TechBadge key={index} {...tech} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
