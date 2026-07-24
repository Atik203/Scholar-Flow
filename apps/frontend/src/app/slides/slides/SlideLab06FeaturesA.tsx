import { Bot, Building2, FileEdit, FolderOpen, MessageSquare, Upload } from "lucide-react";

const features = [
  { num: "01", icon: Upload, title: "Smart Upload", desc: "Upload PDF and DOCX files with automatic AI metadata extraction — title, authors, abstract, and keywords detected without any manual input from the user.", color: "from-blue-500 to-blue-600" },
  { num: "02", icon: Bot, title: "AI Summarize", desc: "Generate instant AI-powered summaries for any paper. Extracts key findings, methodology insights, and main conclusions in seconds using Gemini and OpenAI models.", color: "from-emerald-500 to-emerald-600" },
  { num: "03", icon: MessageSquare, title: "AI Chat Q&A", desc: "Chat with your papers using context-aware AI that understands the full document content. Ask questions, get clarifications, and explore ideas interactively.", color: "from-teal-500 to-teal-600" },
  { num: "04", icon: FileEdit, title: "Rich Text Editor", desc: "Built-in TipTap editor for collaborative writing and editing. Supports real-time editing, auto-save, and export to PDF and DOCX formats with full formatting.", color: "from-purple-500 to-purple-600" },
  { num: "05", icon: FolderOpen, title: "Collections", desc: "Organize papers into customizable collections with advanced filtering, tagging, full-text search, and drag-and-drop organization for quick access to your research.", color: "from-orange-500 to-orange-600" },
  { num: "06", icon: Building2, title: "Team Workspaces", desc: "Create shared workspaces with role-based access control. Share paper libraries, assign view/edit/admin permissions, and collaborate in real time with your team.", color: "from-pink-500 to-pink-600" },
];

export default function SlideLab06FeaturesA() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-base font-bold mb-2">
          <span>✨</span> Core Features
        </div>
        <h1 className="text-3xl font-bold text-black">Key Features <span className="text-blue-600">(1/2)</span></h1>
      </div>
      <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`w-9 h-9 bg-gradient-to-br ${feature.color} rounded-lg text-white text-base font-bold flex items-center justify-center`}>{feature.num}</span>
            </div>
            <h3 className="font-bold text-black text-2xl mb-2">{feature.title}</h3>
            <p className="text-2xl font-normal text-black leading-snug flex-1">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}