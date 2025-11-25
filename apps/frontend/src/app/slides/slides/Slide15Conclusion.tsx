import { GraduationCap, MessageCircleQuestion } from "lucide-react";

export default function Slide15Conclusion() {
  return (
    <div className="w-full h-full bg-white p-16 flex flex-col items-center justify-center">
      {/* Main Content */}
      <div className="text-center">
        {/* Icon */}
        <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-10 shadow-xl">
          <MessageCircleQuestion className="w-20 h-20 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-7xl font-bold text-black mb-8">Any Questions?</h1>

        {/* Subtitle */}
        <p className="text-3xl text-black font-medium mb-14">
          Thank you for your attention
        </p>

        {/* Team Badge */}
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 rounded-full shadow-lg">
          <GraduationCap className="w-7 h-7 text-white" />
          <span className="text-xl font-bold text-white">
            Team: Phantom Devs
          </span>
        </div>
      </div>
    </div>
  );
}
