import { MapPin } from "lucide-react";
import Image from "next/image";

const chartImagesSecondary = [
  { src: "/response_image/4.png", alt: "Age Distribution" },
  { src: "/response_image/5.png", alt: "Institution Footprint" },
  { src: "/response_image/8.png", alt: "Pain Points" },
];

export default function Slide01SurveyStatsPart2() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
      <div className="absolute top-0 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

      <header className="relative z-10 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-700">
            Feasibility Analysis
          </p>
          <h1 className="text-4xl font-bold text-black mt-2">
            Survey Attendee Statistics (2/2)
          </h1>
          <p className="text-lg text-black mt-2 max-w-4xl">
            Enlarged charts to keep every demographic signal legible on
            projector screens; focused on age, campus footprint, cadence, pain
            points, and collaboration.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 border border-slate-200 rounded-2xl px-5 py-3 shadow-sm backdrop-blur">
          <MapPin className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-xs text-slate-700">Readability</p>
            <p className="font-semibold text-black">
              Large charts · No overflow
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex-1 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-700">Expanded visuals</p>
            <p className="text-xl font-semibold text-black">
              Demographic depth
            </p>
          </div>
          <span className="text-sm text-slate-700">Charts 4–6</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1">
          {chartImagesSecondary.map((chart) => (
            <div
              key={chart.src}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col"
            >
              <div className="relative w-full h-64 rounded-xl overflow-hidden bg-white">
                <Image
                  src={chart.src}
                  alt={chart.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 90vw, 45vw"
                />
              </div>
              <p className="text-sm font-semibold text-black mt-3">
                {chart.alt}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-black leading-relaxed">
          Signals to act on: campus-first launch at UIU; emphasize cadence and
          low-friction sharing to shift solo users into structured workspaces.
        </div>
      </div>
    </div>
  );
}
