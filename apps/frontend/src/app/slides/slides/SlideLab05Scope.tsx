import { CheckCircle2, Globe, Layers, Settings, XCircle } from "lucide-react";

const inScope = [
  {
    icon: Layers, title: "Paper Upload & Processing",
    items: "PDF/DOCX upload with AI metadata extraction (title, authors, abstract, keywords) stored securely in AWS S3 with presigned URLs.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: CheckCircle2, title: "AI-Powered Features",
    items: "Automatic paper summarization, context-aware chat Q&A with documents, and AI-generated literature review drafts from your paper collections.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Globe, title: "Collaboration & Workspaces",
    items: "Team workspaces with role-based access control, shared paper libraries, real-time annotations, and activity tracking for research groups.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Settings, title: "Editor & Billing System",
    items: "TipTap rich text editor with auto-save and PDF/DOCX export. Stripe subscription billing with free tier, pro plans, and team pricing.",
    color: "from-amber-500 to-amber-600",
  },
];

const outScope = [
  "Native mobile applications (iOS/Android) — web-only responsive design",
  "Offline mode or desktop application — requires active internet connection",
  "Third-party reference manager data import — manual upload only",
];

export default function SlideLab05Scope() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      <div className="text-center mb-3">
        <h2 className="text-3xl font-bold text-black mb-1">Project Scope</h2>
        <p className="text-2xl font-bold text-black">What is Included and What is Not</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3">
        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-black">In Scope</h3>
          </div>
          <div className="flex-1 space-y-2">
            {inScope.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-emerald-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-black text-2xl">{item.title}</span>
                </div>
                <p className="text-2xl font-normal text-black leading-snug ml-12">{item.items}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50/50 rounded-xl p-4 border border-red-200 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-black">Out of Scope</h3>
          </div>
          <div className="flex-1 space-y-2">
            {outScope.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-red-100 flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-2xl font-normal text-black leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}