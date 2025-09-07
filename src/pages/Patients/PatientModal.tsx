import React, { useState, useEffect } from 'react';
import { Patient, MedicalRecord, Appointment } from '../../types';
import { X, User, Phone, Calendar, Shield, FileText, Plus} from 'lucide-react';
import MedicalRecordsSection from './MedicalRecordsSection';
import BookAppointmentSection from './BookAppointmentSection';
import { mockData } from '../../utils/mockData';

interface PatientModalProps {
  patient: Patient;
  isMyPatient: boolean;
  isOpen: boolean;
  onClose: () => void;
  onAddMedicalRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  onBookAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}

type ModalView = 'details' | 'medical-records' | 'book-appointment';

const PatientModal: React.FC<PatientModalProps> = ({
  patient,
  isMyPatient,
  isOpen,
  onClose,
  onAddMedicalRecord,
  onBookAppointment,
}) => {
  const user = patient;
  const [currentView, setCurrentView] = useState<ModalView>('details');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;


const getPatientDetails = (patientId: string) => {
  const selected_patient = mockData.mockPatients.find(p => p.user_id === patientId);
  return selected_patient ? selected_patient : 'Unknown User(Patient)';
};

const getUserMedicalRecords = (userId: string) => {
  const userMedicalRecords = mockData.mockMedicalRecords.filter(mdr => mdr.patient_id === userId);
  return userMedicalRecords;
};


  const handleViewChange = (view: ModalView) => {
    if (view === currentView) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsAnimating(false);
    }, 150);
  };

  const getModalWidth = () => {
    if (currentView === 'details') return 'max-w-3xl';
    return 'max-w-6xl';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-xl ${getModalWidth()} w-full max-h-[90vh] flex flex-col transition-all duration-300`}>
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600">Patient Details</p>
            </div>
            {isMyPatient && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                My Patient
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row min-h-96">
            {/* Navigation - only show when expanded */}
            {currentView !== 'details' && (
              <div className="w-full lg:w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200">
                <nav className="p-4">
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => handleViewChange('details')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 flex items-center ${
                          currentView === 'details'
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Patient Details
                      </button>
                    </li>
                    {isMyPatient && (
                      <li>
                        <button
                          onClick={() => handleViewChange('medical-records')}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 flex items-center ${
                            currentView === 'medical-records'
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <FileText className="w-4 h-4 mr-3" />
                          Medical Records
                        </button>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={() => handleViewChange('book-appointment')}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 flex items-center ${
                          currentView === 'book-appointment'
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Calendar className="w-4 h-4 mr-3" />
                        Book Appointment
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {/* Main Content */}
            <div className={`flex-1 overflow-y-auto transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              {currentView === 'details' && (
                <div className="p-8 space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Age</span>
                          <span className="text-gray-600">{user.age} years old</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Email</span>
                          <span className="text-gray-600">{user.email}</span>
                        </div>
                        <div className="flex flex-col col-span-2">
                          <span className="font-medium text-gray-700">Address</span>
                          <span className="text-gray-600">{user.address}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Date of Birth</span>
                          {/* <span className="text-gray-600">{getUserDetails(patient.user_id).date_of_birth}</span> */}
                          <span className="text-gray-600">
  {new Date(user.date_of_birth).toLocaleDateString("en-US")}
</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Emergency Contact */}
                    <div className="lg:border-l lg:pl-12 lg:border-gray-200 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-blue-600" />
                        Emergency Contact
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Name</span>
                          <span className="text-gray-600">{getPatientDetails(user.id).emergency_contact_name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Phone</span>
                          <span className="text-gray-600">{getPatientDetails(user.id).emergency_contact_phone}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Relationship</span>
                          <span className="text-gray-600">{getPatientDetails(user.id).emergency_contact_relationship}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insurance Information */}
                  {getPatientDetails(user.id).insurance_provider && (
                    <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                        <Shield className="w-5 h-5 mr-2 text-blue-600" />
                        Insurance Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Provider</span>
                          <span className="text-gray-600">{getPatientDetails(user.id).insurance_provider}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">Policy #</span>
                          <span className="text-gray-600">{getPatientDetails(user.id).insurance_policy_number}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    {isMyPatient && (
                      <button
                        onClick={() => handleViewChange('medical-records')}
                        className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Manage Medical Records
                      </button>
                    )}
                    <button
                      onClick={() => handleViewChange('book-appointment')}
                      className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg transition-colors duration-200 ${
                        isMyPatient 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Book Appointment
                    </button>
                  </div>
                </div>
              )}

              {currentView === 'medical-records' && (
                <div className="p-6">
                  <MedicalRecordsSection
                    patientId={user.id}
                    medicalRecords={getUserMedicalRecords(user.id)}
                    onAddRecord={onAddMedicalRecord}
                  />
                </div>
              )}

              {currentView === 'book-appointment' && (
                <div className="p-6">
                  <BookAppointmentSection
                    patientId={patient.id}
                    onBookAppointment={onBookAppointment}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientModal;