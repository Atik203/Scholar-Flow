import { ShieldCheck } from "lucide-react";

const strengths = [
  "72.4% need validation · 58.6% high interest",
  "Dual AI stack (Gemini + OpenAI) ready",
  "UIU concentration (47.4%) enables campus-first beta",
  "Annotation + search are top asks; we already scoped them",
  "Clear privacy posture drafted; easy to message trust",
];

const weaknesses = [
  "New brand with limited social proof",
  "Solo-founder bandwidth and complexity of realtime + AI",
  "Privacy & pricing uncertainty raised in feedback",
  "Reliance on third-party services (OAuth, S3, Stripe, AI APIs)",
  "Support/process still forming (runbooks, SLAs, status comms)",
  "Need burn controls for AI so costs stay predictable",
];

export default function Slide04SwotStrategy() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50" />
      <div className="absolute top-6 right-6 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

      <header className="relative z-10 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Go-to-Market
          </p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">
            SWOT (Strengths & Weaknesses)
          </h1>
          <p className="text-lg text-slate-600 mt-2 max-w-4xl">
            Two-column table centered for clarity. Strengths guide our launch
            stance; weaknesses highlight focus areas to shore up before scale.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 border border-slate-200 rounded-2xl px-5 py-3 shadow-sm backdrop-blur">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <div>
            <p className="text-xs text-slate-500">Guardrails</p>
            <p className="font-semibold text-slate-800">
              Privacy clarity · Cost caps · MVP discipline
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="bg-white/90 border border-slate-200 rounded-3xl shadow-lg w-full max-w-[1200px] overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-500 text-white px-10 py-6 text-center font-semibold text-lg">
            Strengths and weaknesses with immediate launch moves
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="p-8">
              <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold mb-3">
                Strengths
              </p>
              <ul className="space-y-2 text-sm text-slate-800 leading-relaxed list-disc list-inside">
                {strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-medium text-slate-900">
                Launch move: run an AI-forward beta at UIU with annotation,
                search, and note flows polished; gather testimonials within 2
                weeks.
              </div>
            </div>
            <div className="p-8">
              <p className="text-sm uppercase tracking-wide text-amber-600 font-semibold mb-3">
                Weaknesses
              </p>
              <ul className="space-y-2 text-sm text-slate-800 leading-relaxed list-disc list-inside">
                {weaknesses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-medium text-slate-900">
                Mitigation: publish privacy copy, pre-set AI spend caps,
                simplify scope to annotations+collections, and set a lightweight
                support playbook.
              </div>
            </div>
          </div>
          <div className="bg-slate-50 border-t border-slate-200 px-10 py-6 text-sm text-black leading-relaxed">
            <p className="text-base font-semibold text-slate-900 mb-2">
              Strategy
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-800">
              <li>Campus-first beta at UIU with curated cohort</li>
              <li>Ship trust center and AI cost caps before promotions</li>
              <li>Collect testimonials fast, then widen invites</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
