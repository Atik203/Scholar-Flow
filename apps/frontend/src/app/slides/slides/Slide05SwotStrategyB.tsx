import { ShieldCheck } from "lucide-react";

const opportunities = [
  "Low switching costs (mostly free tools today)",
  "82%+ AI interest and mind-map/comparison demand",
  "Campus network effects with ambassadors and class cohorts",
  "Freemium appetite (58.6% willing to try free tier)",
];

const threats = [
  "Incumbents: Drive/Notion/Zotero and academic habits",
  "Price-sensitive students; AI cost volatility",
  "Compliance/privacy overhead (GDPR/CCPA) and trust",
  "Feature creep risk across diverse requests",
];

export default function Slide05SwotStrategyB() {
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
            SWOT (Opportunities & Threats)
          </h1>
          <p className="text-lg text-slate-600 mt-2 max-w-4xl">
            Opportunities we can lean into and threats we must guard against.
            Two-column table remains centered for readability.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 border border-slate-200 rounded-2xl px-5 py-3 shadow-sm backdrop-blur">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-xs text-slate-500">Guardrails</p>
            <p className="font-semibold text-slate-800">
              Cost caps · Trust center · MVP discipline
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="bg-white/85 border border-slate-200 rounded-3xl shadow-lg w-full max-w-[1100px] overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-4 text-center font-semibold">
            Centered SWOT table for feasibility review
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="p-6">
              <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold mb-3">
                Opportunities
              </p>
              <ul className="space-y-2 text-sm text-slate-800 leading-relaxed list-disc list-inside">
                {opportunities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-medium text-slate-900">
                Plan: campus-first growth with ambassadors, showcase AI
                workflows, and lean freemium to convert warm intent.
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm uppercase tracking-wide text-rose-600 font-semibold mb-3">
                Threats
              </p>
              <ul className="space-y-2 text-sm text-slate-800 leading-relaxed list-disc list-inside">
                {threats.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="mt-4 text-sm font-medium text-slate-900">
                Mitigation: differentiate on student-first UX + AI; cap AI
                spend; publish trust/privacy posture; avoid feature creep.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
