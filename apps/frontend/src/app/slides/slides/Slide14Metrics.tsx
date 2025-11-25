import { Activity, Bug, FileCode, GitCommit, Star } from "lucide-react";

const codeStats = [
  { label: "Version", value: "v1.1.9", icon: Star },
  { label: "Total Commits", value: "500+", icon: GitCommit },
  { label: "Lines of Code", value: "25K+", icon: FileCode },
  { label: "Test Coverage", value: "85%+", icon: Bug },
];

const techMetrics = [
  {
    category: "Frontend",
    items: [
      { label: "Components", value: "60+" },
      { label: "Pages/Routes", value: "20+" },
      { label: "API Endpoints", value: "35+" },
      { label: "Form Validations", value: "15+" },
    ],
  },
  {
    category: "Backend",
    items: [
      { label: "API Modules", value: "8" },
      { label: "Database Tables", value: "12+" },
      { label: "Prisma Models", value: "12" },
      { label: "Middleware", value: "10+" },
    ],
  },
  {
    category: "DevOps",
    items: [
      { label: "CI/CD Pipelines", value: "3" },
      { label: "Test Files", value: "25+" },
      { label: "Documentation", value: "15 docs" },
      { label: "Scripts", value: "10+" },
    ],
  },
];

const highlights = [
  { emoji: "🔐", text: "Production-grade OAuth & JWT authentication" },
  { emoji: "📄", text: "Full PDF processing with metadata extraction" },
  { emoji: "☁️", text: "AWS S3 integration with presigned URLs" },
  { emoji: "⚡", text: "Performance monitoring & rate limiting" },
  { emoji: "🎨", text: "Responsive UI with dark/light mode" },
  { emoji: "🧪", text: "Comprehensive test suite with Jest" },
];

export default function Slide14Metrics() {
  return (
    <div className="w-full h-full bg-white p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Project Metrics</h1>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-4">
        {/* Left: Code Stats */}
        <div className="col-span-4 space-y-4">
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-2">
            {codeStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-3 text-center text-white"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <h3 className="text-sm font-bold text-slate-700 mb-2">
              🏆 Key Achievements
            </h3>
            <div className="space-y-1.5">
              {highlights.map((h, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span>{h.emoji}</span>
                  <span className="text-slate-600">{h.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Tech Metrics */}
        <div className="col-span-8 grid grid-cols-3 gap-3">
          {techMetrics.map((section, index) => (
            <div
              key={index}
              className={`rounded-xl p-4 border ${
                index === 0
                  ? "bg-blue-50 border-blue-200"
                  : index === 1
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-purple-50 border-purple-200"
              }`}
            >
              <h3
                className={`text-sm font-bold mb-3 ${
                  index === 0
                    ? "text-blue-700"
                    : index === 1
                      ? "text-emerald-700"
                      : "text-purple-700"
                }`}
              >
                {section.category}
              </h3>
              <div className="space-y-3">
                {section.items.map((item, iIndex) => (
                  <div
                    key={iIndex}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span
                      className={`text-sm font-bold ${
                        index === 0
                          ? "text-blue-600"
                          : index === 1
                            ? "text-emerald-600"
                            : "text-purple-600"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Developer Info */}
      <div className="mt-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              MA
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Md. Atikur Rahaman</h4>
              <p className="text-sm text-slate-500">
                Full-Stack Developer • CSE Undergraduate
              </p>
            </div>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-slate-700">CSE 4104</div>
              <div className="text-slate-400">Database Course</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-700">2025</div>
              <div className="text-slate-400">Academic Year</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-700">CUET</div>
              <div className="text-slate-400">Institution</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
