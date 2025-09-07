import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientDashboard from './PatientDashboard';
import ProviderDashboard from './ProviderDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === 'patient' ? <PatientDashboard /> : <ProviderDashboard />;
};

export default Dashboard;