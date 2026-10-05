import { cn } from "@/lib/utils";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

export interface FinalShot {
  src: string;
  title: string;
  badge: string;
  description: string;
}

interface FinalFeatureSlideProps {
  icon: LucideIcon;
  kicker: string;
  title: string;
  accent?: string;
  explainer: string;
  chips: string[];
  route: string;
  routeIcon?: string;
  shots: FinalShot[];
  footer: string;
  gradient?: string;
  shadow?: string;
}

export default function FinalFeatureSlide({
  icon: Icon,
  kicker,
  title,
  accent,
  explainer,
  chips,
  route,
  routeIcon = "🖥️",
  shots,
  footer,
  gradient = "from-blue-600 to-indigo-600",
  shadow = "shadow-blue-500/30",
}: FinalFeatureSlideProps) {
  const twoUp = shots.length > 1;

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-10 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
      />

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg", gradient, shadow)}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-lg font-black uppercase tracking-widest text-blue-600 mb-0.5">{kicker}</p>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                {title} {accent && <span className="text-blue-600">{accent}</span>}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border-2 border-slate-200 shadow-md flex-shrink-0">
            <span className="text-3xl">{routeIcon}</span>
            <span className="text-2xl font-mono font-black text-slate-900">{route}</span>
          </div>
        </div>

        {/* ── Explainer + chips ── */}
        <p className="text-2xl font-bold text-slate-800 leading-relaxed text-left mt-3 max-w-5xl">{explainer}</p>
        <div className="flex flex-wrap gap-2.5 mt-2.5">
          {chips.map((chip, i) => (
            <span key={i} className="text-base font-black uppercase tracking-wider text-blue-700 bg-blue-50 border-2 border-blue-200 px-3.5 py-1 rounded-xl shadow-sm">
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* ── Screenshots ── */}
      <div className={cn("flex-1 relative z-10 my-3 min-h-0", twoUp ? "grid grid-cols-2 gap-5" : "flex")}>
        {shots.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg flex flex-col overflow-hidden min-h-0 min-w-0 flex-1">
            <div className="relative flex-1 bg-slate-100 min-h-0">
              <Image src={s.src} alt={s.title} fill className="object-contain p-2" sizes={twoUp ? "40vw" : "80vw"} />
            </div>
            <div className="p-5 border-t-2 border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-300 px-3 py-0.5 rounded-full">{s.badge}</span>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-1">{s.title}</h3>
              <p className="text-xl font-bold text-slate-700 leading-snug">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-8 py-3.5 shadow-lg shadow-blue-500/20 border-2 border-blue-400/30 relative z-10">
        <p className="text-center text-2xl font-black text-white tracking-wide">{footer}</p>
      </div>
    </div>
  );
}
