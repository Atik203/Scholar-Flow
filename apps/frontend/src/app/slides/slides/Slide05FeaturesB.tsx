import {
  BarChart3,
  BookOpen,
  CreditCard,
  Highlighter,
  Settings,
  Shield,
} from "lucide-react";

const features = [
  {
    num: "07",
    icon: BookOpen,
    title: "Citation Generator",
    desc: "Auto-generate citations in APA, MLA, IEEE, Chicago, and BibTeX formats from paper metadata automatically.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    num: "08",
    icon: Highlighter,
    title: "PDF Annotations",
    desc: "Highlight text, add notes, and bookmark important sections directly on PDF documents for easy reference.",
    color: "from-amber-500 to-amber-600",
  },
  {
    num: "09",
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track reading progress, view usage statistics, and get insights on research activity and productivity.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    num: "10",
    icon: CreditCard,
    title: "Subscription Billing",
    desc: "Stripe-powered subscription plans with generous free tier, pro features, and flexible team plans.",
    color: "from-green-500 to-green-600",
  },
  {
    num: "11",
    icon: Settings,
    title: "Admin Panel",
    desc: "Comprehensive dashboard for user management, system monitoring, analytics and configuration.",
    color: "from-slate-600 to-slate-700",
  },
  {
    num: "12",
    icon: Shield,
    title: "Enterprise Security",
    desc: "OAuth/JWT authentication, rate limiting, input validation, HTTPS encryption and CORS protection.",
    color: "from-red-500 to-red-600",
  },
];

export default function Slide05FeaturesB() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-16 flex flex-col">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-5 py-2 rounded-full text-base font-semibold mb-4">
          <span>🚀</span> Advanced Features
        </div>
        <h1 className="text-4xl font-bold text-black">
          Key Features <span className="text-indigo-600">(2/2)</span>
        </h1>
      </div>

      {/* Features Grid - 2x3 */}
      <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all group"
          >
            {/* Header Row */}
            <div className="flex items-center gap-3 mb-3">
              {/* Icon */}
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              {/* Number Badge */}
              <span
                className={`w-8 h-8 bg-gradient-to-br ${feature.color} rounded-lg text-white text-sm font-bold flex items-center justify-center`}
              >
                {feature.num}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-black text-xl mb-3">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-black text-base leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
