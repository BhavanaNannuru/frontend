import React, { useState } from "react";
import { MessageCircle, X, Bot, User } from "lucide-react";
import { ChatMessage } from "../../types";

type ConversationStep = {
  question: string;
  options?: { label: string; response: string; next?: string }[];
};
const conversationFlow: Record<string, ConversationStep> = {
  start: {
    question: "How can I help you today?",
    options: [
      { label: "Book Appointment", response: 
        "To book an appointment:\n1️⃣ Go to the 'Book Appointment' page.\n2️⃣ Select the doctor you want to meet.\n3️⃣ Choose an available time slot.\n4️⃣ Enter the reason for your visit.\n✅ Once booked, a confirmation email with appointment details will be sent to you.", next: "end" },
      { label: "Upcoming Appointments", response: 
        "You can view your upcoming appointments in the 'My Appointments' section. 📅\nThis will show all your scheduled future visits with doctors.", next: "end" },
      { label: "Medical Records", response: 
        "In the 'Medical Records' section, you can:\n- 📄 View and download lab reports\n- 💊 Check prescriptions\n- 📝 See past visit notes\nAll your records are safely stored here.", next: "end" },
      { label: "Contact Support", response: 
        "📞 You can reach our support team at supporthealthcare@gmail.com or call +1-800-123-4567.", next: "end" },
      { label: "Events", response: 
        "National Patient Safety Awareness Week Event on Sept 13", next: "end" }
    ],
  },

  end: {
    question: "Is there anything else I can help you with?",
    options: [
      { label: "Yes", response: "Alright, let’s start over.", next: "start" },
      { label: "No", response: "Okay, have a great day! 👋", next: "end" },
    ],
  },
};


const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! I'm your healthcare assistant.",
      sender: "bot",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [currentStep, setCurrentStep] = useState<keyof typeof conversationFlow>("start");

  const handleOptionClick = (option: { label: string; response: string; next?: string }) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: option.label,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: option.response,
      sender: "bot",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);

    if (option.next) {
      setTimeout(() => {
        const nextStep = conversationFlow[option.next!];
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 2).toString(),
            text: nextStep.question,
            sender: "bot",
            timestamp: new Date().toISOString(),
          },
        ]);
        setCurrentStep(option.next!);
      }, 800);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-50 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 z-50 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        style={{ transformOrigin: "bottom right" }}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span className="font-medium">Healthcare Assistant</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 h-64">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  message.sender === "bot"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {message.sender === "bot" ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
              </div>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.sender === "bot"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-600 text-white"
                }`}
              >
                <div className="whitespace-pre-line">{message.text}</div>
              </div>
            </div>
          ))}

          {/* Show options for current step */}
          {conversationFlow[currentStep]?.options && (
            <div className="flex flex-wrap gap-2 mt-2">
              {conversationFlow[currentStep].options!.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chatbot;
