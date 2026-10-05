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
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-5 md:p-6 lg:px-8 lg:py-5 flex flex-col justify-between relative overflow-hidden select-none">
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Background Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
      />

      {/* ── Header (Streamlined to maximize image canvas) ── */}
      <div className="relative z-10 flex-shrink-0">
        <div className="absolute -top-5 md:-top-6 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-60" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className={cn("w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-md flex-shrink-0", gradient, shadow)}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-black uppercase tracking-widest text-blue-600 leading-none mb-1">{kicker}</p>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">
                {title} {accent && <span className="text-blue-600">{accent}</span>}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-white px-4 py-2 rounded-xl border-2 border-slate-200 shadow-sm flex-shrink-0">
            <span className="text-xl md:text-2xl">{routeIcon}</span>
            <span className="text-lg md:text-xl font-mono font-black text-slate-900">{route}</span>
          </div>
        </div>

        {/* ── Explainer + chips ── */}
        <div className="flex items-center justify-between gap-4 mt-2">
          <p className="text-base lg:text-lg font-bold text-slate-700 leading-snug text-left flex-1 max-w-4xl">{explainer}</p>
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            {chips.map((chip, i) => (
              <span key={i} className="text-xs md:text-sm font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-0.5 rounded-lg shadow-xs">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Screenshots Area ── */}
      <div
        className={cn(
          "flex-1 relative z-10 my-2 min-h-0",
          twoUp
            ? "grid grid-cols-2 gap-4 lg:gap-6 items-center justify-center max-w-[1520px] xl:max-w-[1640px] 2xl:max-w-[1720px] mx-auto w-full my-auto"
            : "flex justify-center"
        )}
      >
        {shots.map((s, i) => (
          <div
            key={i}
            className={cn(
              "bg-white rounded-2xl border-2 border-slate-200 shadow-xl flex flex-col overflow-hidden min-h-0 min-w-0",
              twoUp
                ? "w-full mx-auto shadow-xl"
                : "w-full max-w-[1240px] xl:max-w-[1300px] mx-auto flex-1"
            )}
          >
            {/* Desktop browser mockup header */}
            <div
              className={cn(
                "bg-slate-950 border-b border-slate-800 flex items-center justify-between flex-shrink-0 px-3.5 py-1.5"
              )}
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded px-2.5 py-0.5 text-xs font-mono font-medium text-slate-300 truncate max-w-[280px]">
                scholarflow.com/{route}
              </div>
              <div className="w-10" />
            </div>

            <div
              className={cn(
                "relative bg-[#0B0F17] overflow-hidden flex items-center justify-center",
                twoUp
                  ? "w-full aspect-[2.08/1]"
                  : "flex-1 min-h-0 p-1"
              )}
            >
              <Image
                src={s.src}
                alt={s.title}
                fill
                className="object-contain p-1"
                sizes={twoUp ? "50vw" : "90vw"}
                priority
              />
            </div>
            <div
              className={cn(
                "border-t border-slate-100 flex-shrink-0 bg-white px-4 py-2"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "font-black uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-300 rounded-full flex-shrink-0 text-xs px-2.5 py-0.5"
                    )}
                  >
                    {s.badge}
                  </span>
                  <h3
                    className={cn(
                      "font-black text-slate-900 truncate text-base md:text-lg"
                    )}
                  >
                    {s.title}
                  </h3>
                </div>
                <p
                  className={cn(
                    "font-medium text-slate-600 truncate text-right text-xs md:text-sm flex-1"
                  )}
                >
                  {s.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl px-6 py-2 shadow-md border border-blue-400/30 relative z-10 flex-shrink-0">
        <p className="text-center text-lg md:text-xl font-black text-white tracking-wide">{footer}</p>
      </div>
    </div>
  );
}
