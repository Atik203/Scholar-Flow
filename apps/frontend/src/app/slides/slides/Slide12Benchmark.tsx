import { BarChart3, Clock, Gauge, Search, Zap } from "lucide-react";

const metrics = [
  {
    icon: Clock,
    label: "Page Load Time",
    value: "1.2s",
    target: "< 2s",
    status: "excellent",
    comparison: "43% faster than Mendeley",
  },
  {
    icon: Zap,
    label: "API Response",
    value: "150ms",
    target: "< 300ms",
    status: "excellent",
    comparison: "2x faster than industry avg",
  },
  {
    icon: Gauge,
    label: "Lighthouse Score",
    value: "93",
    target: "90+",
    status: "excellent",
    comparison: "Top 10% of web apps",
  },
  {
    icon: Search,
    label: "Search Latency",
    value: "320ms",
    target: "< 500ms",
    status: "good",
    comparison: "Full-text + semantic search",
  },
];

const aiMetrics = [
  { label: "AI Summary Generation", value: "3-5s", note: "Per paper" },
  {
    label: "Literature Review Draft",
    value: "15-30s",
    note: "Up to 50 papers",
  },
  { label: "Chat Response Time", value: "< 2s", note: "Context-aware" },
  { label: "Citation Extraction", value: "< 1s", note: "BibTeX/APA/MLA" },
];

const infraMetrics = [
  { label: "Uptime SLA", value: "99.9%", icon: "🟢" },
  { label: "CDN Regions", value: "50+", icon: "🌍" },
  { label: "Database", value: "PostgreSQL", icon: "🐘" },
  { label: "File Storage", value: "AWS S3", icon: "☁️" },
];

export default function Slide12Benchmark() {
  return (
    <div className="w-full h-full bg-white p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          Performance Benchmarks
        </h1>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4">
        {/* Core Performance Metrics */}
        <div className="col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 mb-3">
            Core Performance
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-3 border border-slate-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <metric.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    {metric.label}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-800">
                      {metric.value}
                    </div>
                    <div className="text-xs text-slate-400">
                      Target: {metric.target}
                    </div>
                  </div>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    ✓ {metric.status}
                  </span>
                </div>
                <div className="mt-2 text-xs text-blue-600">
                  {metric.comparison}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* AI Response Times */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
            <h3 className="text-sm font-bold text-slate-700 mb-2">
              🤖 AI Response Times
            </h3>
            <div className="space-y-2">
              {aiMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-slate-600">{metric.label}</span>
                  <div className="text-right">
                    <span className="font-bold text-purple-700">
                      {metric.value}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      ({metric.note})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
            <h3 className="text-sm font-bold text-slate-700 mb-2">
              ⚙️ Infrastructure
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {infraMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-white/60 rounded-lg p-2 text-center"
                >
                  <div className="text-lg mb-0.5">{metric.icon}</div>
                  <div className="text-xs text-slate-500">{metric.label}</div>
                  <div className="text-sm font-bold text-emerald-700">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="mt-3 grid grid-cols-4 gap-3">
        <div className="bg-blue-600 text-white rounded-xl p-3 text-center">
          <div className="text-2xl font-bold">93+</div>
          <div className="text-xs text-blue-100">Lighthouse Score</div>
        </div>
        <div className="bg-emerald-600 text-white rounded-xl p-3 text-center">
          <div className="text-2xl font-bold">&lt;2s</div>
          <div className="text-xs text-emerald-100">Time to Interactive</div>
        </div>
        <div className="bg-purple-600 text-white rounded-xl p-3 text-center">
          <div className="text-2xl font-bold">A+</div>
          <div className="text-xs text-purple-100">Security Rating</div>
        </div>
        <div className="bg-amber-600 text-white rounded-xl p-3 text-center">
          <div className="text-2xl font-bold">99.9%</div>
          <div className="text-xs text-amber-100">Uptime Target</div>
        </div>
      </div>
    </div>
  );
}
