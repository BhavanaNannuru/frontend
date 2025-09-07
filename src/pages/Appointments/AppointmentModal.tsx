import React, { useState } from 'react';
import {
  X,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Appointment } from '../../types';
import { mockData, mockPatients } from '../../utils/mockData';

interface AppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (appointmentId: string) => void;
  onReject?: (appointmentId: string, reason: string) => void;
  onUpdate?: () => void; 
}

const getProviderDetails = (providerId: string) => {
  const provider = mockData.mockProviders.find((u) => u.id === providerId);
  return provider ? provider : 'Unknown Provider';
};

const getUserDetails = (userId: string) => {
  const user = mockData.mockUsers.find((u) => u.id === userId);
  return user ? user : 'Unknown user';
};

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onConfirm,
  onReject,
  onUpdate,
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionType, setActionType] = useState<'confirm' | 'reject' | null>(
    null
  );

  if (!isOpen || !appointment) return null;

  const patient = mockPatients.find((p) => p.user_id === appointment.patient_id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  const handleFinalAction = async () => {
    try {
      if (actionType === 'confirm') {
        await fetch(`http://localhost:5000/api/appointments/${appointment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'confirmed' }),
        });
        onConfirm?.(appointment.id);
      } else if (actionType === 'reject') {
        await fetch(`http://localhost:5000/api/appointments/${appointment.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected', rejection_reason: rejectReason }),
        });
        onReject?.(appointment.id, rejectReason);
      }

      onUpdate?.();
      onClose();


    } catch (err) {
      console.error('Error updating appointment:', err);
    }

    setShowConfirmation(false);
    setShowRejectForm(false);
    setRejectReason('');
    setActionType(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!showConfirmation ? (
            <>
              {/* Appointment Info */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(appointment.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.duration} min
                  </div>
                </div>

                {/* Patient Info */}
                <div className="border-t pt-4">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {getUserDetails(patient?.user_id).name ||
                          'Unknown Patient'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getUserDetails(patient?.user_id).email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getUserDetails(patient?.user_id).phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {appointment.type.replace('-', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.reason}</p>
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Notes:</span>{' '}
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Reject form */}
              {showRejectForm && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                  <h4 className="font-medium text-red-900 mb-3">Rejection Reason</h4>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please provide a reason..."
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

              {/* Action buttons */}
              {appointment.status === 'pending' && !showRejectForm && (
                <div className="border-t pt-4 mt-4 flex space-x-3">
                  <button
                    onClick={handleConfirmClick}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleRejectClick}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Confirmation screen */
            <div className="text-center space-y-6">
              <div
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                  actionType === 'confirm' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {actionType === 'confirm' ? (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {actionType === 'confirm'
                  ? 'Confirm Appointment?'
                  : 'Reject Appointment?'}
              </h3>
              <p className="text-gray-600">
                {actionType === 'confirm'
                  ? 'This will confirm the appointment and notify the patient.'
                  : 'This will reject the appointment and notify the patient with your reason.'}
              </p>

              {actionType === 'reject' && rejectReason && (
                <div className="bg-gray-50 rounded-xl p-4 mt-4 text-left">
                  <p className="text-sm font-medium text-gray-900">Rejection Reason:</p>
                  <p className="text-sm text-gray-600 mt-1">{rejectReason}</p>
                </div>
              )}

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleFinalAction}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    actionType === 'confirm'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {actionType === 'confirm' ? 'Confirm' : 'Reject'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
