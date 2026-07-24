import { Bot, Cloud, Database, Monitor, Server } from "lucide-react";

export default function SlideLab11Architecture() {
  return (
    <div className="w-full h-full bg-white p-10 flex flex-col">
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Server className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">
          System Architecture
        </h1>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {/* User Layer */}
        <div className="bg-slate-100 rounded-xl p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-700">
            <Monitor className="w-5 h-5" />
            <span className="font-bold text-sm">USER LAYER</span>
          </div>
          <p className="text-slate-500 text-xs">Browser · API Consumers</p>
        </div>

        <div className="flex justify-center">
          <div className="text-blue-500 text-xl">▼</div>
        </div>

        {/* Frontend */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base">Frontend (Next.js 16)</h3>
              <p className="text-blue-100 text-sm">
                App Router · RTK Query · Better Auth · Tailwind CSS · Redux Toolkit
              </p>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Vercel
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="text-emerald-500 text-xl">▼</div>
        </div>

        {/* Backend */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base">Backend API (Express.js)</h3>
              <p className="text-emerald-100 text-sm">
                Auth · Papers · Collections · Workspaces · AI · Billing · Notifications
              </p>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Vercel/Railway
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-8">
            <div className="text-purple-500 text-xl">▼</div>
            <div className="text-orange-500 text-xl">▼</div>
            <div className="text-blue-500 text-xl">▼</div>
          </div>
        </div>

        {/* Data Layer */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5" />
              <span className="font-bold text-sm">PostgreSQL</span>
            </div>
            <p className="text-purple-100 text-xs">+ pgvector + Redis</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-3 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Cloud className="w-5 h-5" />
              <span className="font-bold text-sm">AWS S3</span>
            </div>
            <p className="text-orange-100 text-xs">Presigned URLs</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-5 h-5" />
              <span className="font-bold text-sm">AI APIs</span>
            </div>
            <p className="text-blue-100 text-xs">Gemini · OpenAI GPT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
