import { CheckCircle2, Globe, Layers, Settings, XCircle } from "lucide-react";

const inScope = [
  {
    icon: Layers,
    title: "Paper Upload & Processing",
    items: "PDF/DOCX upload, AI metadata extraction, S3 storage",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: CheckCircle2,
    title: "AI Features",
    items: "Summarization, chat Q&A, literature review generation",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Globe,
    title: "Collaboration",
    items: "Workspaces, role-based access, shared libraries, annotations",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Settings,
    title: "Editor & Billing",
    items: "Rich text editor, Stripe subscriptions, admin dashboard",
    color: "from-amber-500 to-amber-600",
  },
];

const outScope = [
  "Native mobile applications",
  "Offline mode / desktop app",
  "Third-party reference manager import",
];

export default function SlideLab05Scope() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">
          Project Scope
        </h2>
        <p className="text-lg text-slate-600">What&apos;s In &amp; Out of Scope</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* In Scope */}
        <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800">In Scope</h3>
          </div>
          <div className="flex-1 space-y-3">
            {inScope.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-emerald-100"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}
                  >
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-black text-lg">
                    {item.title}
                  </span>
                </div>
                <p className="text-slate-600 text-sm ml-11">{item.items}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Out of Scope */}
        <div className="bg-red-50/50 rounded-2xl p-6 border border-red-200 flex flex-col">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-red-800">Out of Scope</h3>
          </div>
          <div className="flex-1 space-y-3">
            {outScope.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-red-100 flex items-center gap-3"
              >
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-black text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
