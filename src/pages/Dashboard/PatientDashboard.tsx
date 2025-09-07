import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Bell, 
  Plus,
  ChevronRight,
  Activity,
  Heart,
  Thermometer,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { mockData } from '../../utils/mockData';
import { usePatientData } from '../../hooks/usePatientData';
import AwarenessSlider from './slider';

// Helper function to get the provider's name from their ID
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

const PatientDashboard = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = usePatientData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    );
  }

  // Handle case where no data is available after loading
  if (!user || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No user data available. Please log in.</p>
      </div>
    );
  }

  const { appointments, medicalRecords, healthMetrics } = data;
  
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= new Date() && apt.status !== 'cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentRecords = medicalRecords
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-gray-600">
              Here's an overview of your healthcare dashboard
              </p>
            </div>
            
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/book-appointment"
            className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors group"
          >
            <div className="flex items-center">
              <Plus className="h-8 w-8 mr-3" />
              <div>
                <h3 className="font-semibold">Book Appointment</h3>
                <p className="text-blue-100 text-sm">Schedule new visit</p>
              </div>
            </div>
          </Link>

          <Link
            to="/appointments"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 group"
          >
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 mr-3 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">My Appointments</h3>
                <p className="text-gray-600 text-sm">View all appointments</p>
              </div>
            </div>
          </Link>

          <Link
            to="/medical-records"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 group"
          >
            <div className="flex items-center">
              <FileText className="h-8 w-8 mr-3 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Medical Records</h3>
                <p className="text-gray-600 text-sm">Access your records</p>
              </div>
            </div>
          </Link>

          <Link
            to="/notifications"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 group"
          >
            <div className="flex items-center">
              <Bell className="h-8 w-8 mr-3 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-gray-600 text-sm">View alerts</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                <Link
                  to="/appointments"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
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
                              appointment.status === 'confirmed'
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
                  <p className="text-gray-600">No upcoming appointments</p>
                  <Link
                    to="/book-appointment"
                    className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                  >
                    Schedule your first appointment
                  </Link>
                </div>
              )}
            </div>
            
            {/* Recent Medical Records */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Medical Records</h2>
                <Link
                  to="/medical-records"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View all
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {recentRecords.length > 0 ? (
                <div className="space-y-3">
                  {recentRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900">{record.title}</h4>
                          <p className="text-sm text-gray-600">{record.type}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(record.date), 'MMM d')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No medical records yet</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Tips</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Stay hydrated by drinking 8 glasses of water daily</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Schedule regular check-ups to maintain good health</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">Get 7-9 hours of quality sleep each night</p>
                </div>
              </div>
            </div>

            {/* Contact Emergency */}
            <AwarenessSlider />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;