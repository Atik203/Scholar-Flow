import { Lightbulb, PieChart } from "lucide-react";
import Image from "next/image";

interface SurveyItem {
  id: number;
  title: string;
  stat: string;
  insight: string;
  image?: string;
}

const surveyItems: SurveyItem[] = [
  {
    id: 1,
    title: "Role distribution",
    stat: "86.2% undergrad · 3.4% masters · 3.4% PhD · 3.4% faculty",
    insight: "Student-first UX and onboarding are mandatory for adoption.",
    image: "/response_image/1.png",
  },
  {
    id: 2,
    title: "Field of study",
    stat: "~67% CS/IT · 15% engineering · 10% medical · 8% social science",
    insight: "Tech-forward audience expects AI-native workflows and speed.",
    image: "/response_image/2.png",
  },
  {
    id: 3,
    title: "Academic level",
    stat: "58.6% 3rd-year · 17.2% 2nd-year · 6.9% masters · 6.9% non-students",
    insight: "Peak research workload years—need fast import and organization.",
    image: "/response_image/3.png",
  },
  {
    id: 4,
    title: "Age distribution",
    stat: "75.9% ages 22–25 · 13.8% 18–21 · 10.3% 26–30",
    insight:
      "Gen-Z users expect crisp UI, mobile-friendly flows, and instant feedback.",
    image: "/response_image/4.png",
  },
  {
    id: 5,
    title: "Institution footprint",
    stat: "47.4% UIU · 10 universities represented",
    insight:
      "Campus-first beta at UIU then expand via ambassadors to other campuses.",
    image: "/response_image/5.png",
  },
  {
    id: 6,
    title: "Current tools",
    stat: "Browser PDFs 34.5% · Local folders 31% · Cloud 31% · No tool 27.6%",
    insight:
      "Build one-click importers and highlight upgrade from ad-hoc workflows.",
    image: "/response_image/6.png",
  },
  {
    id: 7,
    title: "Reading cadence",
    stat: "48.3% rarely · 20.7% multi/day · 20.7% weekly · 9.4% monthly",
    insight:
      "Design dual journeys: nudge light readers; power mode for heavy users.",
    image: "/response_image/7.png",
  },
  {
    id: 8,
    title: "Pain points",
    stat: "Notes 44.8% · Finding papers 37.9% · Organization 31%",
    insight: "Lead with annotations, tagging, and fast retrieval.",
    image: "/response_image/8.png",
  },
  {
    id: 9,
    title: "Collaboration style",
    stat: "Work alone 55.2% · Share via chat/email 20.7% · Shared folders 9.4%",
    insight:
      "Position ScholarFlow as the upgrade path from solo to structured teamwork.",
    image: "/response_image/9.png",
  },
  {
    id: 10,
    title: "Satisfaction with current tools",
    stat: "Avg 3.31/5 · 41.4% rate 3",
    insight: "Low loyalty—clear space to win with UX and reliability.",
    image: "/response_image/10.png",
  },
  {
    id: 11,
    title: "Need intensity",
    stat: "72.4% report moderate-to-extreme need",
    insight: "Validated problem space—prioritize onboarding and quick wins.",
    image: "/response_image/11.png",
  },
  {
    id: 12,
    title: "Interest in ScholarFlow",
    stat: "51.7% very interested · 6.9% extremely · 18.8% moderately",
    insight: "Convert warm intent with demos, social proof, and waitlist CTA.",
    image: "/response_image/12.png",
  },
  {
    id: 13,
    title: "Organization & search",
    stat: "59.4% want upload/store · 59.4% collections · 59.4% advanced search",
    insight:
      "Collections + unified library must be above the fold in product tours.",
    image: "/response_image/13.png",
  },
  {
    id: 14,
    title: "Reading & note-taking",
    stat: "71.9% want in-browser highlights · 56.3% centralized notes",
    insight: "Ship PDF annotations + linked notes as day-one experience.",
    image: "/response_image/14.png",
  },
  {
    id: 15,
    title: "AI features",
    stat: "68.8% mind maps · 65.6% summaries · 62.5% Q&A · 62.5% related papers",
    insight:
      "AI copilot is core—not a side feature—prioritize stability and cost caps.",
    image: "/response_image/15.png",
  },
  {
    id: 16,
    title: "Collaboration & workspaces",
    stat: "62.1% role-based access · 58.6% shared workspaces · 56.3% comments",
    insight:
      "Role-aware invites with clear permissions reduce sharing friction.",
    image: "/response_image/16.png",
  },
  {
    id: 17,
    title: "Analytics & tracking",
    stat: "59.4% reading overview · 56.3% progress tracking · 53.1% dashboards",
    insight:
      "Lightweight analytics dashboards justify continued usage and upgrades.",
    image: "/response_image/17.png",
  },
  {
    id: 18,
    title: "Willingness to try free tier",
    stat: "31.3% very likely · 31.3% likely · 21.9% not sure",
    insight:
      "Freemium is expected; add upgrade hooks via storage and AI quotas.",
    image: "/response_image/18.png",
  },
  {
    id: 19,
    title: "Concerns",
    stat: "Privacy & cost top concerns; also AI reliability and simplicity",
    insight:
      "Publish trust center, transparent pricing, and guardrails for AI outputs.",
    image: "/response_image/19.png",
  },
  {
    id: 20,
    title: "Additional feature requests",
    stat: "LMS sync, plagiarism checks, offline, advanced referencing (~10% each)",
    insight: "Log as backlog items; keep MVP slim while communicating roadmap.",
    image: "/response_image/20.png",
  },
  {
    id: 21,
    title: "Comments & feedback",
    stat: "Positive initiative; pricing sensitivity; simplicity emphasized",
    insight:
      "Stay focused on reliability, affordability, and clean UX before scale.",
    image: "/response_image/21.png",
  },
];

function makeSurveySlide(startIndex: number) {
  return function SurveySlide() {
    const items = surveyItems.slice(startIndex, startIndex + 2);
    const rangeLabel =
      items.length === 1
        ? `Question ${items[0].id}`
        : `Questions ${items[0].id}–${items[items.length - 1].id}`;

    return (
      <div className="w-full h-full bg-white p-12 flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
        <div className="absolute top-6 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

        <header className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Survey Insights
            </p>
            <h1 className="text-4xl font-bold text-slate-900 mt-2">
              {rangeLabel}
            </h1>
            <p className="text-lg text-slate-600 mt-2 max-w-4xl">
              Two-question snapshot with concise takeaways to guide build and
              launch decisions.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/80 border border-slate-200 rounded-2xl px-5 py-3 shadow-sm backdrop-blur">
            <PieChart className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-xs text-slate-500">Survey size</p>
              <p className="font-semibold text-slate-800">
                32 respondents · 21 questions
              </p>
            </div>
          </div>
        </header>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    Q{item.id}
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wide text-slate-500">
                      Key finding
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {item.title}
                    </p>
                  </div>
                </div>
                <Lightbulb className="w-5 h-5 text-amber-500" />
              </div>

              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {item.stat}
              </p>

              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold">
                  →
                </div>
                <p className="text-sm font-medium text-slate-900 leading-relaxed">
                  {item.insight}
                </p>
              </div>

              {item.image ? (
                <div className="mt-4 relative w-full h-48 rounded-2xl overflow-hidden bg-white border border-slate-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  };
}

export const SlideSurvey01 = makeSurveySlide(0);
export const SlideSurvey02 = makeSurveySlide(2);
export const SlideSurvey03 = makeSurveySlide(4);
export const SlideSurvey04 = makeSurveySlide(6);
export const SlideSurvey05 = makeSurveySlide(8);
export const SlideSurvey06 = makeSurveySlide(10);
export const SlideSurvey07 = makeSurveySlide(12);
export const SlideSurvey08 = makeSurveySlide(14);
export const SlideSurvey09 = makeSurveySlide(16);
export const SlideSurvey10 = makeSurveySlide(18);
export const SlideSurvey11 = makeSurveySlide(20);
