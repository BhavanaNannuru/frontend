import React, { useState } from 'react';
import { Appointment } from '../../types';
import { Calendar, Clock, User, FileText, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockData } from '../../utils/mockData';

interface BookAppointmentSectionProps {
  patientId: string;
  onBookAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  defaultDate?: Date;
  defaultTime?: string;
}

const BookAppointmentSection: React.FC<BookAppointmentSectionProps> = ({
  patientId,
  onBookAppointment,
  defaultDate,
  defaultTime,
}) => {

  const getProviderDetails = () => {
    const prov = mockData.mockProviders.find(p => p.user_id === user?.id);
    return prov ? prov : "Unknown Provider" 
  }
  
  const { user } = useAuth();
  const cproviderId = getProviderDetails().id;


  const [appointmentData, setAppointmentData] = useState({
    date: defaultDate ? defaultDate.toISOString().split('T')[0] : '',
    time: defaultTime || '09:00',
    duration: 30,
    type: 'consultation' as Appointment['type'],
    reason: '',
  });

  const [isBooking, setIsBooking] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
  
    try {
      // Ensure SQL-friendly time format (HH:mm:ss)
      const fixedTime = appointmentData.time.length === 5
        ? `${appointmentData.time}:00`
        : appointmentData.time;
  
        const payload = {
          patient_id: patientId || "guest",
          provider_id: cproviderId, // TODO: replace
          date: appointmentData.date,         // yyyy-mm-dd
          time: fixedTime,                    // HH:mm:ss
          duration: appointmentData.duration,
          status: "confirmed",
          type: appointmentData.type,
          reason: appointmentData.reason,
          notes: null,
          created_at: new Date().toISOString(),  // ADD THIS
          booked_at: new Date().toISOString(),
          confirmed_at: null,
          cancellation_reason: null,
          rejection_reason: null,
        };

        console.log(payload);
        console.log("--------------------------------.......................")
        
  
      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to book: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Appointment booked successfully:", data);
  
      // Notify parent
      onBookAppointment(data);
  
      // Reset form
      setAppointmentData({
        date: '',
        time: '09:00',
        duration: 30,
        type: 'consultation',
        reason: '',
      });
  
      window.location.reload()
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to request appointment. Please try again.");
    } finally {
      setIsBooking(false);
      
    }
  };
  


  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">Book New Appointment</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Appointment Date
            </label>
            <input
              type="date"
              value={appointmentData.date}
              onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
              min={getMinDate()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Time
            </label>
            <select
              value={appointmentData.time}
              onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Appointment Type
            </label>
            <select
              value={appointmentData.type}
              onChange={(e) => setAppointmentData({ ...appointmentData, type: e.target.value as Appointment['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="check-up">Check-up</option>
              <option value="emergency">Emergency</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Duration (minutes)
            </label>
            <select
              value={appointmentData.duration}
              onChange={(e) => setAppointmentData({ ...appointmentData, duration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Reason for Visit
          </label>
          <textarea
            value={appointmentData.reason}
            onChange={(e) => setAppointmentData({ ...appointmentData, reason: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Please describe the reason for this appointment..."
            required
          />
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Appointment Summary</h4>
          <div className="text-sm text-blue-800 space-y-1">
            {appointmentData.date && <p>Date: {new Date(appointmentData.date).toLocaleDateString()}</p>}
            {appointmentData.time && <p>Time: {appointmentData.time}</p>}
            <p>Duration: {appointmentData.duration} minutes</p>
            <p>Type: {appointmentData.type}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isBooking}
            className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              isBooking
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isBooking ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Booking...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointmentSection;