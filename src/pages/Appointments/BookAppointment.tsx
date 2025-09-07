import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, User, Calendar, X, CheckCircle, Clock, StarHalf, GraduationCap, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockData } from '../../utils/mockData';
import { Provider, TimeSlot } from '../../types';
import { useAppointments } from '../../context/AppointmentsContext';

const BookAppointment: React.FC = () => {
  const { user } = useAuth();
  const { addAppointment } = useAppointments();
  const navigate = useNavigate();


  // State for the provider search and selection
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<string | null>(null);

 

  // State for the booking form
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  // New state to hold available slots for the selected provider and date
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // State for the success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [noSlotsMessage, setNoSlotsMessage] = useState('');

  if (!user || user.role !== 'patient') {
    return <div className="min-h-screen flex items-center justify-center">Access Denied. This page is for patients.</div>;
  }

  // Specialties and locations list for the filter dropdowns
  const specialties = ['All', 'Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Orthopedics', 'Oncology'];
  const locations = ['All', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL'];

  // Filter providers based on search term, specialty, and location
  const filteredProviders = mockData.mockProviders.filter(provider => {
    const matchesSearch = provider?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider?.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === '' || selectedSpecialty === 'All' ||
      provider?.specialization === selectedSpecialty;
    const matchesLocation = selectedLocation === '' || selectedLocation === 'All' ||
      provider?.address.includes(selectedLocation);

    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  // Handle provider selection and open the booking modal
  const handleProviderSelect = (providerId: string) => {
    setSelectedProviderId(providerId);
    // Reset date and time to ensure a clean state for the new provider
    setSelectedDate('');
    setSelectedTime('');
    setAppointmentReason('');
    setNoSlotsMessage(''); // Clear any previous messages
    setShowBookingModal(true);
  };
  const getUserName = (userId: string): string => {
  const user = mockData.mockUsers.find(u => u.id === userId);
  return user ? user.name : 'Unknown User';
};

const getUserId = (providerId) => {
  const user = mockData.mockProviders.find(u => u.id === providerId);
  return user ? user.user_id : 'Unknown User';
};


const getProviderDetails = (userId: string): Provider | null => {
  const provider = mockData.mockProviders.find(p => p.user_id === userId);
  return provider || null;
};


const handleBookAppointment = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedDate || !selectedTime) {
    alert("Please select a date and a preferred time slot.");
    return;
  }

  // Fix the time and extract HH:mm:ss
  const fixedTime = selectedTime.replace(/:00Z$/, 'Z');
  const timeOnly = fixedTime.substr(11, 8);

  const payload = {
    patient_id: user?.id || "guest",
    provider_id: selectedProviderId ? getProviderDetails(selectedProviderId!)?.id : "unknown_provider",
    date: selectedDate,
    time: timeOnly,
    duration: 30,
    status: "pending",
    type: "consultation",
    reason: appointmentReason,
    notes: null,
    booked_at: new Date().toISOString(),
    confirmed_at: null,
    cancellation_reason: null,
    rejection_reason: null,
  };

  try {
    const response = await fetch("http://localhost:5000/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to book: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Appointment booked successfully:", data);
    addAppointment(data); // update global state instantly

    setShowBookingModal(false);
    setShowSuccessModal(true);

    // mark slot as booked
    await fetch(`http://localhost:5000/api/timeslots/${selectedTimeSlotId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_booked: true })
    });

    // send notification
    await fetch("http://localhost:5000/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: getUserId(payload.provider_id), // notify provider
        type: "appointment",
        title: "New Appointment Booked",
        message: `A new appointment has been booked by patient ${payload.patient_id} on ${payload.date} at ${payload.time}.`,
        is_read: false,
        related_entity_id: data.id,
      }),
    });

    console.log("success");

    // Instead of navigate+reload, just auto-close the success modal
    // after showing it briefly
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);

  } catch (error) {
    console.error("Error booking appointment:", error);
    alert("Failed to request appointment. Please try again.");
  }
};




function getAvailableSlots(
  provider: Provider,
  slots: TimeSlot[],
  selectedDate: string
): TimeSlot[] {
  const selectedDateObj = new Date(selectedDate);

  return slots.filter(slot => {
    const slotDateObj = new Date(slot.date);

    return (
      slot.provider_id === provider.id &&
      slotDateObj.getFullYear() === selectedDateObj.getFullYear() &&
      slotDateObj.getMonth() === selectedDateObj.getMonth() &&
      slotDateObj.getDate() === selectedDateObj.getDate() &&
      !slot.is_booked &&
      !slot.is_break
    );
  });
}


  // Use a useEffect hook to filter and set available slots whenever the provider or date changes
  useEffect(() => {
    if (selectedProviderId && selectedDate) {
      const selectedProvider = mockData.mockProviders.find(p => p.user_id === selectedProviderId);
      console.log("=============================")
      console.log( selectedProvider)
      const availableSlots=getAvailableSlots(selectedProvider,mockData.mockTimeSlots,selectedDate)
      if (selectedProvider && availableSlots) {
        // Get the selected date without the time part to match against the mock data
        

        const selectedDateObject = new Date(selectedDate);

        
        

       //setAvailableSlots(slotsForDate);
      setAvailableSlots(getAvailableSlots(selectedProvider,mockData.mockTimeSlots,selectedDate));

        // Set the "no slots" message if no slots are found
        if (availableSlots?.length === 0) {
          setNoSlotsMessage('No slots available for this date. Please select a new date.');
        } else {
          setNoSlotsMessage('');
        }
      } else {
        setAvailableSlots([]);
        setNoSlotsMessage('No slots available for this date. Please select a new date.');
      }
    } else {
      setAvailableSlots([]);
      setNoSlotsMessage('');
    }
  }, [selectedProviderId, selectedDate]);

  // Get the minimum date for the date input to prevent past bookings
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate());
    return today.toISOString().split('T')[0];
  };

  const selectedProvider = mockData.mockProviders.find(p => p.user_id === selectedProviderId);

  // Show a loading message while waiting for user data
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to book an appointment.</p>
        </div>
      </div>
    );
  }

  
  

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
              <p className="text-gray-600">
              Find and book appointments with qualified healthcare providers
              </p>
            </div>
            
          </div>
        </div>

{/* Search and Filters */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
  <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6">
    {/* Search */}
    <div className="relative">
      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
        Search
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          id="search"
          type="text"
          placeholder="Search doctors or specialties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search doctors or specialties"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    {/* Specialty Filter */}
    <div>
      <label
        htmlFor="specialty"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Specialty
      </label>
      <select
        id="specialty"
        value={selectedSpecialty}
        onChange={(e) => setSelectedSpecialty(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {specialties.map((specialty) => (
          <option key={specialty} value={specialty === 'All' ? '' : specialty}>
            {specialty}
          </option>
        ))}
      </select>
    </div>

    {/* Location Filter */}
    <div className="relative">
      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <select
          id="location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc === 'All' ? '' : loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
</div>

        {/* Providers List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <div key={provider.user_id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Profile Picture and Name */}
                  <div className="flex items-start space-x-6 mb-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{getUserName(provider.user_id)}</h3>
                      <p className="text-blue-600 font-medium text-lg">{provider.specialization}</p>

                      {/* Star Rating and Reviews */}
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {/* Star rating rendering with half-star support */}
                          {[...Array(5)].map((_, i) => {
                            const rating = provider.rating;
                            const isFullStar = i < Math.floor(rating);
                            const showHalfStar = (rating % 1) >= 0.25 && (rating % 1) < 0.75 && Math.floor(rating) === i;
                            return (
                              <div key={i} className="relative w-4 h-4 mr-0.5">
                                {isFullStar ? (
                                  <Star className="w-full h-full text-yellow-400 fill-current" />
                                ) : showHalfStar ? (
                                  <StarHalf className="w-full h-full text-yellow-400 fill-current" />
                                ) : (
                                  <Star className="w-full h-full text-gray-300" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {provider.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                      {provider.education}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      Experience: {provider?.experience}
                    </div>
                    {/* <div className="flex items-center text-sm text-gray-600">
  <Globe className="w-4 h-4 mr-2 text-gray-500" />
  Languages: {provider?.languages?.join(', ') || 'N/A'}
  
</div> */}
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleProviderSelect(provider.user_id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-lg py-10">No providers found matching your search criteria.</p>
          )}
        </div>

        {/* Booking Form Modal */}
        {showBookingModal && selectedProvider && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8 relative">
                <button
  type="button"
  onClick={() => setShowBookingModal(false)}
  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
  aria-label="Close booking modal"
  title="Close"
>
  <X className="w-6 h-6" />
</button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Appointment</h2>

                {/* Provider Info Card */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <div className="flex items-center space-x-4">
                  
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{getUserName(selectedProvider.user_id)}</h3>
                      <p className="text-blue-600 font-medium text-sm">{selectedProvider.specialization}</p>
                    </div>
                  </div>
                </div>


                <form onSubmit={handleBookAppointment} className="space-y-6">
                  {/* Date and Time Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                        Appointment Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <input
                          type="date"
                          id="date"
                          required
                          value={selectedDate}
                          onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedTime(''); // Reset the time when the date changes
                          }}
                          min={getMinDate()}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        />
                      </div>
                      {/* Display "No slots available" message in red */}
                      {noSlotsMessage && (
                        <p className="mt-2 text-sm text-red-500">{noSlotsMessage}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                       

                        <select
  id="time"
  required
  value={selectedTime}
  onChange={(e) => {
    setSelectedTime(e.target.value);
    const slot = availableSlots.find(s => {
      const isoTime = new Date(s.time).toISOString();
      return isoTime === e.target.value;
    });
    setSelectedTimeSlotId(slot ? slot.id : null);
  }}
  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-40 overflow-y-auto"
  disabled={!selectedDate || availableSlots.length === 0}
>
  <option value="" disabled>
    {!selectedDate
      ? 'Select a date first'
      : availableSlots.length === 0
        ? 'No slots available'
        : 'Select a time'
    }
  </option>
  {availableSlots.map((slot) => {
    const isoTime = new Date(slot.time).toISOString();
    const displayTime = isoTime.split("T")[1].split("Z")[0].split(".")[0]; // "10:00:00"

    return (
      <option key={slot.id} value={isoTime}>
        {displayTime}
      </option>
    );
  })}
</select>


                      </div>
                    </div>
                  </div>

                  {/* Reason for Visit */}
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit
                    </label>
                    <textarea
                      id="reason"
                      value={appointmentReason}
                      onChange={(e) => setAppointmentReason(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Briefly describe your symptoms or reason for the visit..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors shadow-md
                        ${!selectedDate || !selectedTime
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      disabled={!selectedDate || !selectedTime}
                    >
                      Request Appointment
                    </button>
                  </div>
                </form>


              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 text-center max-w-sm w-full shadow-lg">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Requested!</h2>
              <p className="text-gray-600">Wait for the doctor's confirmation!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;