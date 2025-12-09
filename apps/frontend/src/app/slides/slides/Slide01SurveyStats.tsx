import { BarChart2, MapPin, Target, Users } from "lucide-react";

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
    detail: "Student-first design required",
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
    description: "Younger cohort expects refined, responsive UX",
  },
];

export default function Slide01SurveyStats() {
  return (
    <div className="w-full h-full bg-white p-12 flex flex-col gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
      <div className="absolute -right-24 top-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute -left-20 bottom-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

      <header className="relative z-10 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-700">
            Feasibility Analysis
          </p>
          <h1 className="text-4xl font-bold text-black mt-2">
            Survey Attendee Statistics (1/2)
          </h1>
          <p className="text-lg text-black mt-2 max-w-3xl">
            Demographics validate a student-first launch: concentrated at UIU,
            heavily CS/IT, and overwhelmingly early-career researchers who
            expect modern, AI-native workflows.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/80 border border-slate-200 rounded-2xl px-5 py-3 shadow-sm backdrop-blur">
          <MapPin className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-xs text-slate-700">Survey Period</p>
            <p className="font-semibold text-black">
              Nov–Dec 2025 · 10 universities
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-col gap-5 flex-1 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1">
          <div className="col-span-1 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {headlineStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-medium text-black">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-3xl font-bold text-black">
                      {item.value}
                    </p>
                    <p className="text-sm text-black mt-1">{item.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-span-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {segmentCards.map((card) => (
              <div
                key={card.title}
                className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white rounded-2xl p-6 shadow-md"
              >
                <p className="text-sm uppercase tracking-wide text-white mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold mb-1">{card.stat}</p>
                <p className="text-sm text-white leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col gap-3">
          <div>
            <p className="text-sm text-slate-700">Summary</p>
            <p className="text-xl font-semibold text-black">
              Concentrated, student-first audience
            </p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-sm text-black leading-relaxed">
            CS/IT-heavy undergraduates clustered at UIU with strong interest and
            need. Prioritize fast onboarding, AI-native UX, and campus beta
            outreach.
          </div>
        </div>
      </div>
    </div>
  );
}
