import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Scholar Flow',
  description: 'Get in touch with the Scholar Flow team for support, partnerships, or general inquiries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Contact Us
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We'd love to hear from you! Whether you have questions about our platform, 
              need technical support, or want to explore partnership opportunities, 
              we're here to help.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  General Inquiries
                </h3>
                <p className="text-gray-600 mb-2">
                  Email: info@scholarflow.com
                </p>
                <p className="text-gray-600">
                  We typically respond within 24 hours.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Technical Support
                </h3>
                <p className="text-gray-600 mb-2">
                  Email: support@scholarflow.com
                </p>
                <p className="text-gray-600">
                  For technical issues and platform support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
