import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockData, mockAppointments } from '../../utils/mockData';
import { format } from 'date-fns';
import { Appointment } from '../../types/index';

/**
 * A helper function to find a provider's name by their ID.
 * @param {string} provider_id - The ID of the provider.
 * @returns {string} The name of the provider, or 'Unknown Provider' if not found.
 */
const getProviderName = (providerId: string) => {
  const provider = mockData.mockProviders.find(p => p.id === providerId);
  if (!provider) {
    return 'Unknown Provider';
  }
  const user = getUserDetails(provider.user_id);
  return user && user.name ? user.name : 'Unknown User';
};

const getUserDetails = (userId: string) => {
  const user = mockData.mockUsers.find(u => u.id === userId);
  return user ? user : null;
};

const AppointmentsPage = () => {
  const { user } = useAuth();

  // State for the appointments list and loading status
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch and filter appointments when the user object is available
  useEffect(() => {
    if (user) {
      const userAppointments = mockAppointments.filter(apt => apt.patient_id === user.id);
      setAllAppointments(userAppointments);
      setIsLoading(false);
    }    
    else {
      setIsLoading(true);
    }
  }, [user]);

  if (!user || user.role !== 'patient') {
    return <div className="min-h-screen flex items-center justify-center">Access Denied. This page is for patients.</div>;
  }
  // Function to toggle between showing upcoming and all appointments
  const toggleAppointmentsView = () => {
    setShowAllAppointments(!showAllAppointments);
  };

  // Filter and sort appointments based on the current view state
  const filteredAppointments = allAppointments
    .filter(apt => {
      // If showAllAppointments is true, return all appointments.
      // Otherwise, only return appointments that are not in the past.
      return showAllAppointments ? true : new Date(apt.date) >= new Date();
    })
    .sort((a, b) => {
      // Sort upcoming appointments by date ascending.
      // Sort all appointments by date descending (most recent first).
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return showAllAppointments ? dateB - dateA : dateA - dateB;
    });

  // Show a loading message while waiting for user data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view appointments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
              <p className="text-gray-600">
              View your scheduled and past appointments
              </p>
            </div>  
            <Link
            to="/book-appointment"
            className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Book New
          </Link>                  
          </div>
        </div>






        {/* Appointments Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {showAllAppointments ? 'All Appointments' : 'Upcoming Appointments'}
            </h2>
            <button
              onClick={toggleAppointmentsView}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              {showAllAppointments ? 'Show Upcoming' : 'Show All'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          {filteredAppointments.length > 0 ? (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {getProviderName(appointment.provider_id)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.type}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(appointment.date), 'MMM d, yyyy')}
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        {format(new Date(appointment.date), 'h:mm a')}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          appointment.status === 'scheduled' || appointment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {appointment.status}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {appointment.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {showAllAppointments ? 'No appointments found.' : 'No upcoming appointments.'}
              </p>
              <Link
                to="/book-appointment"
                className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
              >
                Schedule your first appointment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;