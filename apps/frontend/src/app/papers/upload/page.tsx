import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Papers - Scholar Flow',
  description: 'Upload and manage your research papers with Scholar Flow.',
};

export default function PapersUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Upload Research Papers
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Upload Your Papers
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Upload your research papers to Scholar Flow for analysis, collaboration, 
              and management. We support PDF files and will automatically extract 
              text and metadata.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-lg text-gray-600 mb-2">
                Drag and drop your PDF files here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files
              </p>
              <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Choose Files
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Supported formats: PDF</p>
              <p>Maximum file size: 50MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
