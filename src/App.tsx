//import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard/Dashboard';
import BookAppointment from './pages/Appointments/BookAppointment';
import MedicalRecords from './pages/MedicalRecords/MedicalRecords';
import Profile from './pages/Profile/Profile';
import UpcomingAppointments from './pages/Appointments/AppointmentsPage';
import Chatbot from './components/Chatbot/Chatbot';
import NotificationsPage from './components/notifications/NotificationsPage';
import { NotificationsProvider } from './context/NotificationsContext';
import PatientsPage from './pages/Patients/PatientsPage';
import SchedulePage from './pages/Appointments/SchedulePage';
import ReportStats from "./pages/Report/ReportStats";
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import Documentation from './pages/Documentation';
import PendingAppointmentsPage from './pages/Appointments/PendingAppointments';
import { AppointmentsProvider } from './context/AppointmentsContext';


function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/docs" element={<Documentation />} />
            
            
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Dashboard />
                  <Chatbot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentsProvider>
                  <Navbar />
                  <UpcomingAppointments />
                  <Chatbot />
                  </AppointmentsProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/book-appointment"
              element={
                <ProtectedRoute>
                  <AppointmentsProvider>
                  <Navbar />
                  <BookAppointment />
                  <Chatbot />
                  </AppointmentsProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/medical-records"
              element={
                <ProtectedRoute requireRole="patient">
                  <AppointmentsProvider>
                  <Navbar />
                  <MedicalRecords />
                  </AppointmentsProvider>
                </ProtectedRoute>
              }
            />
            <Route 
            path="/schedule"
             element={
              <ProtectedRoute>
                <Navbar />
                  <SchedulePage />                  
                </ProtectedRoute>
             } 
             />
            <Route 
            path="/patients"
             element={
              <ProtectedRoute>
                <Navbar />
                  <PatientsPage />                  
                </ProtectedRoute>
              }
            />

            <Route 
            path="/notifications"
             element={
              <ProtectedRoute>
                  <Navbar />
                  <NotificationsPage />
                </ProtectedRoute>
             } 
             />
            <Route
              path="/Report/stats"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <ReportStats />
                </ProtectedRoute>
              }
            />
             <Route
              path='/pending-appointments'
              element={
                <ProtectedRoute>
                  <Navbar />
                  <PendingAppointmentsPage/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;