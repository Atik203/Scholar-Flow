import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collaborate - Scholar Flow',
  description: 'Discover how Scholar Flow enables seamless collaboration between researchers worldwide.',
};

export default function CollaboratePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Collaborate with Researchers Worldwide
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Real-time Collaboration
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Work together on research papers, share insights, and collaborate 
              in real-time with researchers from around the world. Our platform 
              makes it easy to connect and work together on groundbreaking research.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Shared Collections
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Create and manage shared collections of research papers with your 
              team. Organize papers by topic, project, or research area and 
              collaborate on analysis and insights.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              AI-Powered Insights
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Leverage AI to discover connections between papers, identify 
              research gaps, and generate insights that enhance your collaborative 
              research efforts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
