
import { Book, FileText, Code, HelpCircle } from "lucide-react";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-16 px-6">
      <div className="max-w-5xl text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6">📘 Documentation</h1>
        <p className="text-lg text-gray-600 mb-12">
          Explore our comprehensive guides, API references, and resources to get the most out of the Appointment Booking Platform.
        </p>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition">
            <Book className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">Getting Started</h2>
            <p className="text-gray-600">
              Learn how to quickly set up your account, navigate the dashboard, and start booking appointments seamlessly.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition">
            <FileText className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">User Guides</h2>
            <p className="text-gray-600">
              Step-by-step instructions for patients, providers, and admins to use the platform efficiently.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition">
            <Code className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">API Reference</h2>
            <p className="text-gray-600">
              Detailed API documentation for developers to integrate appointment booking with third-party systems.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transition">
            <HelpCircle className="w-12 h-12 text-blue-600 mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">FAQ & Troubleshooting</h2>
            <p className="text-gray-600">
              Find answers to common questions, error resolutions, and platform best practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
