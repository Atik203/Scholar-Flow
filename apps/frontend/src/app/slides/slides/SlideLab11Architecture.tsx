import { ArrowDown, Bot, Cloud, Database, Monitor, Server, User } from "lucide-react";

const FlowArrow = () => (
  <div className="flex justify-center py-0.5">
    <ArrowDown className="w-5 h-5 text-blue-400" strokeWidth={3} />
  </div>
);

export default function SlideLab11Architecture() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Server className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-black">System Architecture</h1>
      </div>

      <div className="flex-1 flex flex-col">
        {/* User Layer */}
        <div className="bg-slate-200 rounded-xl p-3 text-center border-2 border-slate-300">
          <div className="flex items-center justify-center gap-2 text-black">
            <User className="w-6 h-6" />
            <span className="font-bold text-2xl">USER LAYER</span>
          </div>
          <p className="text-2xl font-normal text-black">Browser (Desktop &amp; Mobile) · API Consumers</p>
        </div>

        <FlowArrow />

        {/* Frontend Layer */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white border-2 border-blue-400 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="w-7 h-7" />
              <div>
                <h3 className="font-bold text-2xl">Frontend (Next.js 16)</h3>
                <p className="text-blue-100 text-lg">App Router · RTK Query · Better Auth · Tailwind CSS</p>
              </div>
            </div>
            <span className="bg-white/20 px-3 py-1.5 rounded-full text-base font-semibold">Vercel</span>
          </div>
        </div>

        <FlowArrow />

        {/* Backend Layer */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 text-white border-2 border-emerald-400 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-7 h-7" />
              <div>
                <h3 className="font-bold text-2xl">Backend API (Express.js)</h3>
                <p className="text-emerald-100 text-lg">Auth · Papers · Collections · Workspaces · AI · Billing · Notifications</p>
              </div>
            </div>
            <span className="bg-white/20 px-3 py-1.5 rounded-full text-base font-semibold">Vercel/Railway</span>
          </div>
        </div>

        {/* Data Layer with branching arrows */}
        <div className="relative mt-1 mb-1">
          <div className="flex justify-center">
            <div className="flex gap-16 items-center">
              <ArrowDown className="w-5 h-5 text-purple-400" strokeWidth={3} />
              <ArrowDown className="w-5 h-5 text-orange-400" strokeWidth={3} />
              <ArrowDown className="w-5 h-5 text-blue-400" strokeWidth={3} />
            </div>
          </div>
          <div className="absolute top-3 left-[15%] right-[15%] h-0.5 bg-slate-300 -z-0" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white border-2 border-purple-400 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-7 h-7" />
              <span className="font-bold text-2xl">PostgreSQL</span>
            </div>
            <p className="text-purple-100 text-lg">+ pgvector vector search</p>
            <p className="text-purple-100 text-lg">+ Redis caching layer</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white border-2 border-orange-400 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-7 h-7" />
              <span className="font-bold text-2xl">AWS S3</span>
            </div>
            <p className="text-orange-100 text-lg">Presigned URL file storage</p>
            <p className="text-orange-100 text-lg">PDF/DOCX document hosting</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white border-2 border-blue-400 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-7 h-7" />
              <span className="font-bold text-2xl">AI APIs</span>
            </div>
            <p className="text-blue-100 text-lg">Gemini 2.5 Flash Pro</p>
            <p className="text-blue-100 text-lg">OpenAI GPT-4o</p>
          </div>
        </div>
      </div>
    </div>
  );
}