import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Scholar Flow',
  description: 'Learn about Scholar Flow and our mission to revolutionize academic research collaboration.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            About Scholar Flow
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Scholar Flow is dedicated to revolutionizing academic research collaboration 
              by providing AI-powered tools that streamline the research process, enhance 
              collaboration, and accelerate scientific discovery.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What We Do
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We provide researchers with intelligent tools for paper management, 
              collaborative analysis, and AI-driven insights that help accelerate 
              the pace of scientific discovery.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To create a world where researchers can focus on what matters most - 
              discovery and innovation - while our platform handles the complexities 
              of research management and collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
