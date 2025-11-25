import { GraduationCap, MessageCircleQuestion } from "lucide-react";

export default function Slide15Conclusion() {
  return (
    <div className="w-full h-full bg-white p-8 flex flex-col items-center justify-center">
      {/* Main Content */}
      <div className="text-center">
        {/* Icon */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-xl">
          <MessageCircleQuestion className="w-16 h-16 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-slate-800 mb-6">
          Any Questions?
        </h1>

        {/* Subtitle */}
        <p className="text-2xl text-slate-500 mb-12">
          Thank you for your attention
        </p>

        {/* Team Badge */}
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 rounded-full shadow-lg">
          <GraduationCap className="w-6 h-6 text-white" />
          <span className="text-lg font-medium text-white">
            Team: Phantom Devs
          </span>
        </div>
      </div>
    </div>
  );
}
