export default function Features() {
  const features = [
    {
      title: "Easy Scheduling",
      desc: "Book, reschedule, or cancel appointments in just a few clicks."
    },
    {
      title: "Reminders",
      desc: "Get automated reminders so you never miss an appointment."
    },
    {
      title: "Medical Records",
      desc: "Securely access and manage your health records online."
    },
    {
      title: "Analytics",
      desc: "Track appointment trends and insights with powerful analytics."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-blue-50 p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Features
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-blue-600">{f.title}</h2>
              <p className="text-gray-700 mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
