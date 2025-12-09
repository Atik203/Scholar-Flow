import { BarChart2, MapPin, Target, Users } from "lucide-react";
import Image from "next/image";

const headlineStats = [
  {
    label: "Total Responses",
    value: "32",
    detail: "29 analyzed after cleaning",
    icon: Users,
  },
  {
    label: "Need/Interest",
    value: "75% need · 81% interested",
    detail: "Clear demand signal",
    icon: Target,
  },
  {
    label: "Primary Role",
    value: "86.2% Undergraduate",
    detail: "Gen-Z, student-first design",
    icon: BarChart2,
  },
];

const segmentCards = [
  {
    title: "Field of Study",
    stat: "67% CS/IT",
    description: "Tech-forward audience ready for AI workflows",
  },
  {
    title: "Campus Footprint",
    stat: "47.4% UIU",
    description: "Ideal beta launch campus; 10 universities represented",
  },
  {
    title: "Age Focus",
    stat: "75.9% ages 22–25",
    description: "Modern UX expectations and mobile-first usage",
  },
];

const chartImages = [
  { src: "/response_image/1.png", alt: "Role Distribution" },
  { src: "/response_image/2.png", alt: "Field of Study" },
  { src: "/response_image/3.png", alt: "Academic Level" },
  { src: "/response_image/4.png", alt: "Age Distribution" },
  { src: "/response_image/5.png", alt: "Institution Footprint" },
];

export default function Slide01SurveyStats() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col gap-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
      <div className="absolute -right-24 top-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute -left-20 bottom-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

      <header className="relative z-10 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
            Feasibility Analysis
          </p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">
            Survey Attendee Statistics
          </h1>
          <p className="text-lg text-slate-600 mt-2 max-w-3xl">
            Demographics validate a student-first launch: concentrated at UIU,
            heavily CS/IT, and overwhelmingly Gen-Z researchers who expect
            modern, AI-native workflows.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/70 border border-slate-200 rounded-2xl px-5 py-3 shadow-sm backdrop-blur">
          <MapPin className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-xs text-slate-500">Survey Period</p>
            <p className="font-semibold text-slate-800">
              Nov–Dec 2025 · 10 universities
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
        {/* Left: Highlights */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            {headlineStats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {item.value}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{item.detail}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3">
            {segmentCards.map((card) => (
              <div
                key={card.title}
                className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl p-5 shadow-md"
              >
                <p className="text-sm uppercase tracking-wide text-white/80 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold mb-1">{card.stat}</p>
                <p className="text-sm text-white/90 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chart collage */}
        <div className="col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Source: Google Forms charts
              </p>
              <p className="text-lg font-semibold text-slate-900">
                Key demographic distributions
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
              <span>Charts auto-generated from 21-question survey</span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
            {chartImages.map((chart) => (
              <div
                key={chart.src}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col"
              >
                <div className="relative w-full h-32 rounded-xl overflow-hidden bg-white">
                  <Image
                    src={chart.src}
                    alt={chart.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <p className="text-sm font-semibold text-slate-800 mt-3">
                  {chart.alt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
