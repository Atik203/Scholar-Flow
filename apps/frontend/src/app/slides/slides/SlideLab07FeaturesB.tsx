import { BarChart3, BookOpen, CreditCard, Highlighter, Settings, Shield } from "lucide-react";

const features = [
  { num: "07", icon: BookOpen, title: "Citation Generator", desc: "Automatically generate citations in APA, MLA, IEEE, Chicago, and BibTeX formats from paper metadata. No manual formatting or copy-pasting required at all.", color: "from-indigo-500 to-indigo-600" },
  { num: "08", icon: Highlighter, title: "PDF Annotations", desc: "Highlight important text passages, add notes and comments, and bookmark key sections directly on PDF documents for easy reference and collaborative review.", color: "from-amber-500 to-amber-600" },
  { num: "09", icon: BarChart3, title: "Analytics Dashboard", desc: "Track reading progress, view usage statistics, monitor research activity, and gain insights into individual and team productivity with visual reports.", color: "from-cyan-500 to-cyan-600" },
  { num: "10", icon: CreditCard, title: "Subscription Billing", desc: "Stripe-powered subscription management with a generous free tier, pro features for power users, and flexible team plans with usage-based pricing options.", color: "from-green-500 to-green-600" },
  { num: "11", icon: Settings, title: "Admin Panel", desc: "Comprehensive administration dashboard for user management, system monitoring, subscription oversight, analytics reports, and platform configuration settings.", color: "from-slate-600 to-slate-700" },
  { num: "12", icon: Shield, title: "Enterprise Security", desc: "OAuth and JWT authentication, rate limiting, input validation, HTTPS encryption, CORS protection, and regular security audits to keep all data safe.", color: "from-red-500 to-red-600" },
];

export default function SlideLab07FeaturesB() {
  return (
    <div className="w-full h-full bg-white p-6 flex flex-col">
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-base font-bold mb-2">
          <span>🚀</span> Advanced Features
        </div>
        <h1 className="text-3xl font-bold text-black">Key Features <span className="text-indigo-600">(2/2)</span></h1>
      </div>
      <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`w-9 h-9 bg-gradient-to-br ${feature.color} rounded-lg text-white text-base font-bold flex items-center justify-center`}>{feature.num}</span>
            </div>
            <h3 className="font-bold text-black text-2xl mb-2">{feature.title}</h3>
            <p className="text-2xl font-normal text-black leading-snug flex-1">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}