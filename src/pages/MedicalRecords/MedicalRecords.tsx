import React, { useState, useMemo } from 'react';
import { FileText, Calendar, User, Search, Filter } from 'lucide-react';
import { mockData, mockMedicalRecords } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { MedicalRecord } from '../../types/index';
import RecordDetailsModal from './RecordDetailsModal';

// Helper function to find user names from IDs
const getUserName = (userId: string) => {
  const user = mockData.mockUsers.find(u => u.id === userId);
  return user ? user.name : 'Unknown User';
};

const MedicalRecords: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const recordTypes = [
    { value: '', label: 'All Types' },
    { value: 'diagnosis', label: 'Diagnosis' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'lab-result', label: 'Lab Results' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'note', label: 'Note' }
  ];

  // Restrict provider to their own patients' records.
  const providerAccessRecords = useMemo(() => {
    if (user?.role === 'provider') {
      const providerPatients = mockData.mockAppointments
        .filter(appt => appt.provider_id === user.id)
        .map(appt => appt.patient_id);
      return mockMedicalRecords.filter(record => providerPatients.includes(record.patient_id));
    }
    return [];
  }, [user]);

  // Determine which set of records to display based on user role
  const recordsToDisplay = user?.role === 'patient'
    ? mockMedicalRecords.filter(record => record.patient_id === user.id)
    : providerAccessRecords;

  const filteredRecords = recordsToDisplay.filter(record => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'diagnosis': return 'bg-rose-100 text-rose-800';
      case 'prescription': return 'bg-emerald-100 text-emerald-800';
      case 'lab-result': return 'bg-blue-100 text-blue-800';
      case 'imaging': return 'bg-indigo-100 text-indigo-800';
      case 'note': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Provider view
  if (user?.role === 'provider') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Records</h1>
            <p className="text-gray-600">
              View and manage medical records for your patients.
            </p>
          </div>
          <div className="p-8 text-center text-gray-500">
            <p>Access for providers is currently limited to a read-only view of patient records.</p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for non-logged-in users
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to view your medical records.</p>
        </div>
      </div>
    );
  }

  // Patient view
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Records</h1>
          <p className="text-gray-600">
            Manage and view your medical history and documents
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medical records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
                aria-label="Select record type"
              >
                {recordTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-6">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedRecord(record);
                  setShowDetailsModal(true);
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${getTypeColor(record.type)}`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">{record.title}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(record.type)}`}>
                            {record.type.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2 truncate max-w-lg">{record.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {record.date
                              ? format(new Date(record.date.replace(' ', 'T')), 'MMM dd, yyyy')
                              : 'Invalid date'}
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {getUserName(record.provider_id)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No medical records available</h3>
              <p className="text-gray-600">
                {searchTerm || selectedType
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Your healthcare provider will upload records when available.'}
              </p>
            </div>
          )}
        </div>

        {/* Record Details Modal */}
        {selectedRecord && showDetailsModal && (
          <RecordDetailsModal
            record={selectedRecord}
            onClose={() => setShowDetailsModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
