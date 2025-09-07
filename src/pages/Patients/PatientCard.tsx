import React from 'react';
import { Patient } from '../../types';
import { User, Calendar, MapPin } from 'lucide-react';
import { mockData } from '../../utils/mockData';

interface PatientCardProps {
  patient: Patient;
  isMyPatient: boolean;
  onClick: () => void;
}


const getPatientDetails = (patientId: string) => {
  const selected_patient = mockData.mockPatients.find(p => p.user_id === patientId);
  return selected_patient ? selected_patient : 'Unknown User(Patient)';
};


const getUserAppointmentsLength = (userId: string): String => {
  const userAppointments = mockData.mockAppointments.filter(appt => appt.patient_id === userId);
  return String(userAppointments.length);
};

const PatientCard: React.FC<PatientCardProps> = ({ patient, isMyPatient, onClick }) => {

const user = patient;
  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">Age: {user.age}</p>
            </div>
          </div>
          {isMyPatient && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              My Patient
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{user.address}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{getUserAppointmentsLength(user.id)} appointment(s)</span>
          </div>
        </div>

        {getPatientDetails(user.id).insurance_provider && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Insurance: {getPatientDetails(user.id).insurance_provider}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientCard;