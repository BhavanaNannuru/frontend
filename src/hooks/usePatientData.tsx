import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  mockData, 
  mockAppointments, 
  mockMedicalRecords, 
  mockNotifications
} from '../utils/mockData';
import { 
  Appointment, 
  HealthMetrics, 
  MedicalRecord 
} from '../types';

// Define a type for the data returned by the hook
type PatientDashboardData = {
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  healthMetrics: HealthMetrics[]; // <--- Corrected type: now an array
};

export const usePatientData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<PatientDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("usePatientData hook: Current user is:", user);

    const fetchPatientData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      setTimeout(() => {
        try {
          const patient = mockData.mockPatients.find(p => p.user_id === user.id);

          
          if (!patient) {
            setError("Patient data not found.");
            setIsLoading(false);
            return;
          }
          
          const userAppointments = mockAppointments.filter(apt => apt.patient_id === user.id);
          const userRecords = mockMedicalRecords.filter(record => record.patient_id === user.id);
           const userNotifications = mockNotifications.filter(record => record.user_id === user.id);

          setData({
            appointments: userAppointments,
            medicalRecords: userRecords,
            notifications: userNotifications,
            healthMetrics: patient.healthMetrics || [], // <--- Corrected: assign the full array
          });
          
        } catch (err: any) {
          setError("Failed to process patient data.");
        } finally {
          setIsLoading(false);
        }
      }, 500);
    };

    fetchPatientData();
  }, [user]);

  return { data, isLoading, error };
};