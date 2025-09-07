// context/AppointmentsContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { Appointment } from "../types";
import { useAuth } from "./AuthContext"; // <-- import auth to get user

interface AppointmentsContextType {
  appointments: Appointment[];
  loading: boolean;
  fetchAppointments: (userId: string) => Promise<void>;
  addAppointment: (apt: Appointment) => void;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export const AppointmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // get logged-in user

  const fetchAppointments = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/appointments?patient_id=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]); // fallback empty
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = (apt: Appointment) => {
    setAppointments(prev => [...prev, apt]);
  };


  // fetch when user logs in
  useEffect(() => {
    if (user?.id) {
      fetchAppointments(user.id);
    }
  }, [user]);

  return (
    <AppointmentsContext.Provider value={{ appointments, loading, fetchAppointments, addAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = () => {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error("useAppointments must be used within AppointmentsProvider");
  return ctx;
};
