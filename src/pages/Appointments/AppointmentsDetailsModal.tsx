import React, { useState } from 'react';
import { X, Clock, User, Calendar, Phone, MapPin, FileText, CheckCircle, XCircle, AlertCircle, Stethoscope, Activity, Heart, Shield } from 'lucide-react';
import { Appointment, Patient } from '../../types';
import { mockData } from '../../utils/mockData';

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  patient: Patient | undefined;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appointmentId: string) => void;
  onReject: (appointmentId: string, reason: string) => void;
}

  const getPatientInfo = (userId: string) => {
    return mockData.mockPatients.find(p => p.user_id === userId);
  };

  
const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  appointment,
  patient,
  isOpen,
  onClose,
  onConfirm,
  onReject,
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'reject' | null>(null);

  if (!isOpen || !appointment) return null;

  const appointmentTypeColors = {
    consultation: 'bg-blue-500 text-white',
    'follow-up': 'bg-green-500 text-white',
    'check-up': 'bg-purple-500 text-white',
    emergency: 'bg-red-500 text-white',
    other: 'bg-gray-500 text-white',
  };

  const appointmentTypeIcons = {
    consultation: Stethoscope,
    'follow-up': Activity,
    'check-up': Heart,
    emergency: AlertCircle,
    other: Clock,
  };

  const TypeIcon = appointmentTypeIcons[appointment.type];

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A"; // safe fallback
    const dateObj = new Date(date); // works if input is string or Date
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleConfirmClick = () => {
    setActionType('confirm');
    setShowConfirmation(true);
  };

  const handleRejectClick = () => {
    setShowRejectForm(true);
  };

  const handleRejectSubmit = () => {
    if (rejectReason.trim()) {
      setActionType('reject');
      setShowConfirmation(true);
      setShowRejectForm(false);
    }
  };


    
  // const handleFinalAction = () => {
  //   if (actionType === 'confirm') {
  //     onConfirm(appointment.id);
  //   } else if (actionType === 'reject') {
  //     onReject(appointment.id, rejectReason);
  //   }
    
  //   // Reset state
  //   setShowConfirmation(false);
  //   setShowRejectForm(false);
  //   setRejectReason('');
  //   setActionType(null);
  // };


  const handleFinalAction = async () => {
    try {
      if (actionType === "confirm") {
        const res = await fetch(
          `http://localhost:5000/api/appointments/${appointment.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "confirmed" }),
          }
        );
  
        if (!res.ok) throw new Error("Failed to confirm appointment");
        const updatedAppointment = await res.json();
  
        // update parent/context
        onConfirm(updatedAppointment.id);
      } else if (actionType === "reject") {
        const res = await fetch(
          `http://localhost:5000/api/appointments/${appointment.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "rejected",
              rejection_reason: rejectReason,
            }),
          }
        );
  
        if (!res.ok) throw new Error("Failed to reject appointment");
        const updatedAppointment = await res.json();
  
        // update parent/context
        onReject(updatedAppointment.id, rejectReason);
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
    } finally {
      // Reset modal state and close
      setShowConfirmation(false);
      setShowRejectForm(false);
      setRejectReason("");
      setActionType(null);
      onClose();
    }
  };
  


  const resetModal = () => {
    setShowConfirmation(false);
    setShowRejectForm(false);
    setRejectReason('');
    setActionType(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
  <h2 className="text-2xl font-bold text-gray-900">Appointment Request Details</h2>
  <button
    type="button"
    onClick={resetModal}
    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
    aria-label="Close appointment request details"
    title="Close"
  >
    <X className="w-6 h-6" />
  </button>
</div>

          {!showConfirmation ? (
            <div className="space-y-6">
              {/* Appointment Type Badge */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center space-x-2 px-2 bg-blue-100  text-blue-900 rounded-xl py-1`}>
                  <span className="font-medium capitalize">
                    {appointment.type.replace('-', ' ')}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {appointment.duration} minutes
                </div>
              </div>

              {/* Patient Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Patient Information</span>
                </h3>
                
                {patient ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      <p className="text-sm text-gray-600">Age: {patient.age}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone || 'No phone provided'}</span>
                      </div>
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span>{patient.address}</span>
                      </div>
                    </div>
                    
                    {getPatientInfo(patient.id).insurance && (
                      <div className="md:col-span-2 mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Shield className="w-4 h-4" />
                          <span>Insurance: {getPatientInfo(patient.id).insurance_provider} - {getPatientInfo(patient.id).insurance_policyNumber}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Patient information not available</p>
                )}
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(appointment.date)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTime(appointment.time)} - {formatTime(`${parseInt(appointment.time.split(':')[0]) + Math.floor(appointment.duration / 60)}:${(parseInt(appointment.time.split(':')[1]) + (appointment.duration % 60)).toString().padStart(2, '0')}`)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Reason for Visit</p>
                    <p className="text-sm text-gray-600">{appointment.reason}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Request Details</p>
                    {/* <p className="text-sm text-gray-600">
                      Requested on {appointment.createdAt.toLocaleDateString('en-US')} at{' '}
                      {appointment.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p> */}

<p className="text-sm text-gray-600">
  Requested on{" "}
  {appointment.createdAt
    ? new Date(appointment.createdAt).toLocaleDateString("en-US")
    : "N/A"}{" "}
  at{" "}
  {appointment.createdAt
    ? new Date(appointment.createdAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : ""}
</p>
                  </div>
                </div>
              </div>

              {/* Reject Form */}
              {showRejectForm && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="font-medium text-red-900 mb-3">Rejection Reason</h4>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a reason for rejecting this appointment..."
                    className="w-full p-3 border border-red-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows={3}
                  />
                  <div className="flex space-x-3 mt-3">
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRejectSubmit}
                      disabled={!rejectReason.trim()}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Rejection
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!showRejectForm && (
                <div className="border-t pt-6">
                  <div className="flex space-x-4">
                    <button
                      onClick={handleRejectClick}
                      className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={handleConfirmClick}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirm</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Confirmation Screen */
            <div className="text-center space-y-6">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                actionType === 'confirm' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {actionType === 'confirm' ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {actionType === 'confirm' ? 'Confirm Appointment?' : 'Reject Appointment?'}
                </h3>
                <p className="text-gray-600">
                  {actionType === 'confirm' 
                    ? 'This will confirm the appointment and notify the patient.'
                    : 'This will reject the appointment and notify the patient with your reason.'
                  }
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-left">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-medium text-gray-900">{patient?.name}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">{formatDate(appointment.date)}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">{formatTime(appointment.time)}</span>
                </div>
                <p className="text-sm text-gray-600">{appointment.reason}</p>
                {actionType === 'reject' && rejectReason && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900">Rejection Reason:</p>
                    <p className="text-sm text-gray-600 mt-1">{rejectReason}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleFinalAction}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors ${
                    actionType === 'confirm'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {actionType === 'confirm' ? 'Confirm Appointment' : 'Reject Appointment'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;