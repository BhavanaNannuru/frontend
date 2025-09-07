export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Contact Us</h1>
        <p className="text-gray-600 text-center mb-8">
          Have questions or need support? Reach out to us using the details below.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">📧 Email</h2>
            <p className="text-gray-700">support@appointmentsystem.com</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">📞 Phone</h2>
            <p className="text-gray-700">+91 98765 43210</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">📍 Office</h2>
            <p className="text-gray-700">123 Health Street, Coimbatore, India</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">💬 Live Chat</h2>
            <p className="text-gray-700">Available in the dashboard 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
