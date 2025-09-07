import React, { useState, useMemo } from 'react';
import { ArrowLeft, Clock, User, Calendar, Phone, AlertCircle, CheckCircle, Filter } from 'lucide-react';
import { mockData } from '../../utils/mockData';
import { Appointment, Patient } from '../../types';
import AppointmentDetailsModal from './AppointmentsDetailsModal';
import { useAuth } from '../../context/AuthContext';

const PendingAppointmentsPage: React.FC = () => {
  const { user: currentUser, isLoading } = useAuth();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [appointments, setAppointments] = useState(mockData.mockAppointments);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading appointments...</div>;
  }

  if (!currentUser || currentUser.role !== 'provider') {
    return <div className="min-h-screen flex items-center justify-center">Access Denied. This page is for healthcare providers.</div>;
  }

  const currentProviderId = currentUser.id;

  const getPatientInfo = (userId: string) => {
    return mockData.mockPatients.find(p => p.user_id === userId);
  };

  const getProviderDetails = (providerId: string) => {
    const provider = mockData.mockProviders.find(u => u.id === providerId);
    return provider ? provider : 'Unknown Provider';
  };

  const getUserDetails = (userId: string) => {
    const user = mockData.mockUsers.find(u => u.id === userId);
    return user ? user : { name: 'Unknown user', phone: '' };
  };

  const filteredPendingAppointments = useMemo(() => {
    const pending = appointments
      .filter(
        apt => getProviderDetails(apt.provider_id)?.user_id === currentProviderId && apt.status === 'pending'
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (selectedTypeFilter !== 'all') {
      return pending.filter(apt => apt.type === selectedTypeFilter);
    }
    return pending;
  }, [appointments, currentProviderId, selectedTypeFilter]);

  const appointmentTypeColors = {
    consultation: 'bg-blue-50 border-blue-200 text-blue-700',
    'follow-up': 'bg-green-50 border-green-200 text-green-700',
    'check-up': 'bg-purple-50 border-purple-200 text-purple-700',
    emergency: 'bg-red-50 border-red-200 text-red-700',
    other: 'bg-gray-50 border-gray-200 text-gray-700',
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleConfirm = (appointmentId: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt
      )
    );
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleReject = (appointmentId: string, reason: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'rejected', rejectionReason: reason } : apt
      )
    );
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US");
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTypeCounts = () => {
    const allPending = appointments.filter(
      apt => getProviderDetails(apt.provider_id)?.user_id === currentProviderId && apt.status === 'pending'
    );

    return {
      all: allPending.length,
      consultation: allPending.filter(apt => apt.type === 'consultation').length,
      'follow-up': allPending.filter(apt => apt.type === 'follow-up').length,
      'check-up': allPending.filter(apt => apt.type === 'check-up').length,
      emergency: allPending.filter(apt => apt.type === 'emergency').length,
      other: allPending.filter(apt => apt.type === 'other').length,
    };
  };

  const typeCounts = getTypeCounts();

  const getUrgencyLevel = (type: string, createdAt: string | Date) => {
    const dateObj = new Date(createdAt);
    const daysSinceCreated = Math.floor(
      (Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (type === "emergency")
      return { level: "high", color: "text-red-600", label: "Urgent" };
    if (daysSinceCreated >= 3)
      return { level: "medium", color: "text-orange-600", label: "Overdue" };
    if (daysSinceCreated >= 1)
      return { level: "low", color: "text-yellow-600", label: "Pending" };
    return { level: "new", color: "text-blue-600", label: "New" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pending Appointments</h1>
                <p className="text-gray-600 mt-1">Review and manage appointment requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Pending</p>
                <p className="text-2xl font-bold text-orange-600">{typeCounts.all}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-700">All Pending</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{typeCounts.all}</p>
            </div>
            {(['consultation', 'follow-up', 'check-up', 'emergency', 'other'] as const).map((type) => {
              const count = typeCounts[type];

              return (
                <div key={type} className={`p-4 rounded-xl border-2 ${appointmentTypeColors[type]}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium capitalize">{type.replace('-', ' ')}</span>
                  </div>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Appointments List */}
        <div className="space-y-4">
          {filteredPendingAppointments.length === 0 ? (
            selectedTypeFilter !== 'all' ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-4">
                  No pending appointments match the current filter.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedTypeFilter('all')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filter
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending appointments to review at this time.</p>
              </div>
            )
          ) : (
            filteredPendingAppointments.map((appointment) => {
              const patient = getPatientInfo(appointment.patient_id);
              const urgency = getUrgencyLevel(appointment.type, appointment.createdAt);

              return (
                <div
                  key={appointment.id}
                  onClick={() => handleAppointmentClick(appointment)}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Patient Avatar */}
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-black" />
                      </div>

                      {/* Appointment Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {getUserDetails(patient?.user_id).name || 'Unknown Patient'}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${appointmentTypeColors[appointment.type]}`}
                          >
                            {appointment.type.replace('-', ' ').toUpperCase()}
                          </span>
                          <span
                            className={`px-1 py-1 rounded-full text-xs font-extrabold ${urgency.color} bg-opacity-10`}
                          >
                            {urgency.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatTime(appointment.time)} ({appointment.duration} min)
                            </span>
                          </div>

                          {patient && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              <span>{getUserDetails(patient?.user_id).phone || 'No phone provided'}</span>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-700 font-medium mb-1">Reason for Visit:</p>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ">
                        <div className="text-right text-sm text-gray-500">
                          <p>Requested</p>
                          <p>{appointment.createdAt}</p> 
                        </div>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ArrowLeft className="w-4 h-4 text-blue-600 rotate-180" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        patient={selectedAppointment ? getUserDetails(selectedAppointment.patient_id) : undefined}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleConfirm}
        onReject={handleReject}
      />
    </div>
  );
};

export default PendingAppointmentsPage;
