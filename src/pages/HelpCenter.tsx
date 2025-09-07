export default function HelpCenter() {
  const faqs = [
    {
      q: "How do I book an appointment?",
      a: "Go to the Book Appointment page, choose your doctor and time slot, then confirm your booking."
    },
    {
      q: "Can I reschedule or cancel?",
      a: "Yes, visit the Appointments page to manage your bookings anytime."
    },
    {
      q: "Are my medical records safe?",
      a: "Yes, we use encrypted storage and secure access controls to protect your data."
    },
    {
      q: "Do I get reminders?",
      a: "Absolutely! You’ll receive automated email and in-app reminders for your appointments."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Help Center</h1>
        <p className="text-gray-600 text-center mb-8">
          Frequently Asked Questions (FAQs) to help you get started.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-blue-700">{faq.q}</h2>
              <p className="text-gray-700 mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
