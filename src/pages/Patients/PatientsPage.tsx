import React, { useState, useMemo } from 'react';
import { Patient, MedicalRecord, Appointment } from '../../types';
import { mockData } from '../../utils/mockData';
import PatientCard from './PatientCard';
import PatientModal from './PatientModal';
import { Search, Filter, Users, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

const PatientsPage: React.FC = () => {
  const { user: currentUser, isLoading } = useAuth(); // Get the current user from context

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'my-patients' | 'providers'| 'others'>('all');

  // Handle loading and no-user states
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading patients...</div>;
  }

  // This page is only for providers, so we can display a message if the user is not a provider.
  if (!currentUser || currentUser.role !== 'provider') {
    return <div className="min-h-screen flex items-center justify-center">Access Denied. This page is for healthcare providers.</div>;
  }

  const getProviderId = (userId: string) => {
    const provider = mockData.mockProviders.find(p => p.user_id === userId);
    return provider? provider.id : 'Unknown User';
  };
  
  // The current logged-in provider's ID is now dynamic
  const currentProviderId = currentUser.id;

  // Determine which patients belong to the current provider
  const patientOwnership = useMemo(() => {
    const ownership: Record<string, string> = {};
    
    mockData.mockUsers.forEach((user) => {
      // Check if there are any appointments (past or future) between this patient and the current logged-in provider
      const hasAppointments = mockData.mockAppointments.some(
        (appointment) => 
          appointment.patient_id === user.id && 
          appointment.provider_id === getProviderId(currentProviderId) &&
          user.role === 'patient'
      );
      
      ownership[user.id] = user.role==='provider'? 'provider' : (hasAppointments? 'my-patient': 'other');
      
       
    });
    
    return ownership;
  }, [currentProviderId]); // Depend on currentProviderId to re-calculate when the user changes

  const myPatientsCount = mockData.mockPatients.filter(p => patientOwnership[p.user_id]==='my-patient').length;
  const myProvidersCount = mockData.mockPatients.filter(p => patientOwnership[p.user_id]==='provider').length;
  const otherPatientsCount = mockData.mockPatients.length - myPatientsCount -1;

  const handleAddMedicalRecord = (record: Omit<MedicalRecord, 'id'>) => {
    console.log('Adding medical record:', record);
    // In a real app, this would make an API call
  };

  const handleBookAppointment = (appointment: Omit<Appointment, 'id'>) => {
    console.log('Booking appointment:', appointment);
    // In a real app, this would make an API call
  };

  const getUserName = (userId: string): string => {
    const user = mockData.mockUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getUserEmail = (userId: string): string => {
    const user = mockData.mockUsers.find(u => u.id === userId);
    return user ? user.email : 'Unknown User';
  };
  
  
  const getUserDetails = (userId: string) => {
    const user = mockData.mockUsers.find(u => u.id === userId);
    return user ? user : 'Unknown User';
  };

  const filteredPatients = useMemo(() => {
  let filtered = mockData.mockUsers;

  if (searchTerm) {
    filtered = filtered.filter((user) =>
      getUserName(user.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserEmail(user.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserDetails(user.id).phone?.toLowerCase().includes(searchTerm.toLowerCase())

    );
  }

  if (filterType === 'my-patients') {
    filtered = filtered.filter((user) => patientOwnership[user.id] === 'my-patient');
  } else if (filterType === 'others') {
    filtered = filtered.filter((user) => patientOwnership[user.id] === 'other');
  }else if (filterType === 'all') {
    filtered = filtered.filter((user) => patientOwnership[user.id] != 'provider');
  }
  else if (filterType === 'providers') {
    filtered = filtered.filter((user) => patientOwnership[user.id] === 'provider');
  }

  return filtered;
}, [searchTerm, filterType, patientOwnership]);

const uniquePatients = useMemo(() => {
  const seenIds = new Set();
  return filteredPatients.filter(user => {
    const isDuplicate = seenIds.has(user.id);
    seenIds.add(user.id);
    return !isDuplicate;
  });
}, [filteredPatients]);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-7">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patients</h1>
              <p className="mt-2 text-gray-600">
                Manage and view patient information, medical records, and appointments
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>{myPatientsCount} My Patients</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{otherPatientsCount} Others</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
              <div className="sm:w-48">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
  value={filterType}
  onChange={(e) => setFilterType(e.target.value as 'all' | 'my-patients' | 'others')}
  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm appearance-none"
  aria-label="Filter patients"
  title="Filter patients"
>
  <option value="all">All Patients</option>
  <option value="my-patients">My Patients</option>
  <option value="others">Other Patients</option>
  <option value="providers">Only Providers</option>
</select>
                </div>
              </div>
            </div>
          </div>

          {/* Patients Grid */}
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'No patients match the current filter.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {uniquePatients.map((user) => (
      <PatientCard
        key={user.id} // The key is now guaranteed to be unique
        patient={user}
        isMyPatient={patientOwnership[user.id] === 'my-patient'}
        onClick={() => {
        setSelectedPatient(user)
      }}
      />
    ))}
  </div>
          )}
        </div>

        {/* Patient Modal */}
        {selectedPatient && (
          <PatientModal
            patient={selectedPatient}
            isMyPatient={patientOwnership[selectedPatient.id] === 'my-patient'}
            isOpen={!!selectedPatient}
            onClose={() => setSelectedPatient(null)}
            onAddMedicalRecord={handleAddMedicalRecord}
            onBookAppointment={handleBookAppointment}
          />
        )}
      </div>
    </div>
  );
};

export default PatientsPage;