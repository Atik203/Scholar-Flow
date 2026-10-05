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

      {/* ── Header ── */}
      <div className="relative z-10">
        <div className="absolute -top-10 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("w-14 h-14 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg", gradient, shadow)}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-base font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">{kicker}</p>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
                {title} {accent && <span className="text-blue-600">{accent}</span>}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-md flex-shrink-0">
            <span className="text-2xl">{routeIcon}</span>
            <span className="text-xl font-bold text-slate-900 font-mono">{route}</span>
          </div>
        </div>

        {/* ── Explainer + chips ── */}
        <p className="text-xl font-semibold text-slate-800 leading-snug text-justify mt-3 max-w-5xl">{explainer}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {chips.map((chip, i) => (
            <span key={i} className="text-base font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* ── Screenshots ── */}
      <div className={cn("flex-1 relative z-10 my-3 min-h-0", twoUp ? "grid grid-cols-2 gap-4" : "flex")}>
        {shots.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-slate-200 shadow-md flex flex-col overflow-hidden min-h-0 min-w-0 flex-1">
            <div className="relative flex-1 bg-slate-100 min-h-0">
              <Image src={s.src} alt={s.title} fill className="object-contain p-2" sizes={twoUp ? "40vw" : "80vw"} />
            </div>
            <div className="p-4 border-t-2 border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">{s.badge}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{s.title}</h3>
              <p className="text-xl font-semibold text-slate-800 leading-snug">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-6 py-3 shadow-lg shadow-blue-500/20 border border-blue-400/30 relative z-10">
        <p className="text-center text-xl font-extrabold text-white tracking-wide">{footer}</p>
      </div>
    </div>
  );
}
