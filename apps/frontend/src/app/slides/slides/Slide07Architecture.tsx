import { Bot, Cloud, Database, Monitor, Network, Server } from "lucide-react";

export default function Slide07Architecture() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
          <Network className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">
          System Architecture
        </h1>
      </div>

      {/* Architecture Diagram */}
      <div className="flex-1 flex flex-col gap-4">
        {/* User Layer */}
        <div className="bg-slate-100 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-700">
            <Monitor className="w-5 h-5" />
            <span className="font-bold">USER LAYER</span>
          </div>
          <p className="text-slate-500 text-sm">
            Browser • Mobile • API Consumers
          </p>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="text-blue-500 text-2xl">▼</div>
        </div>

        {/* Frontend Layer */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Frontend (Next.js 15)</h3>
                <p className="text-blue-100 text-sm">
                  App Router • RTK Query • NextAuth • ShadCN UI
                </p>
              </div>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Vercel
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="text-emerald-500 text-2xl">▼</div>
        </div>

        {/* Backend Layer */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Backend API (Express.js)</h3>
                <p className="text-emerald-100 text-sm">
                  Auth • Papers • Collections • Workspaces • AI • Billing
                </p>
              </div>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Vercel/Railway
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="flex gap-8">
            <div className="text-purple-500 text-2xl">▼</div>
            <div className="text-orange-500 text-2xl">▼</div>
            <div className="text-blue-500 text-2xl">▼</div>
          </div>
        </div>

        {/* Data Layer */}
        <div className="grid grid-cols-3 gap-4">
          {/* Database */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5" />
              <span className="font-bold">PostgreSQL</span>
            </div>
            <p className="text-purple-100 text-sm">+ pgvector</p>
            <p className="text-purple-100 text-sm">+ Redis Cache</p>
          </div>

          {/* Storage */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Cloud className="w-5 h-5" />
              <span className="font-bold">AWS S3</span>
            </div>
            <p className="text-orange-100 text-sm">File Storage</p>
            <p className="text-orange-100 text-sm">PDF/DOCX</p>
          </div>

          {/* AI */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-5 h-5" />
              <span className="font-bold">AI APIs</span>
            </div>
            <p className="text-blue-100 text-sm">Gemini 2.5</p>
            <p className="text-blue-100 text-sm">OpenAI GPT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
