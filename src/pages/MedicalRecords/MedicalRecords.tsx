import React, { useState, useMemo } from 'react';
import { Upload, FileText, Calendar, User, Plus, Search, Filter, X } from 'lucide-react';
import { mockData, mockMedicalRecords } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { MedicalRecord, User as UserType } from '../../types/index';
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
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    type: 'lab-result' as 'lab-result' | 'prescription' | 'imaging' | 'diagnosis' | 'note',
    description: '',
    file: null as File | null
  });

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
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadData(prev => ({ ...prev, file }));
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle the file upload and data submission here
    console.log('Uploading record:', uploadData);
    alert('Medical record uploaded successfully!');
    setShowUploadForm(false);
    setUploadData({
      title: '',
      type: 'lab-result',
      description: '',
      file: null
    });
  };

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

  // Render different view for patients and providers
  if (user?.role === 'provider') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Records</h1>
            <p className="text-gray-600">View and manage medical records for your patients.</p>
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Records</h1>
              <p className="text-gray-600">Manage and view your medical history and documents</p>
            </div>
           {user && user.role === 'provider' && (
  <button
    onClick={() => setShowUploadForm(true)}
    className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
  >
    <Plus className="w-5 h-5 mr-2" />
    Upload New Record
  </button>
)}
          </div>
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
  aria-label="Select appointment type"
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
  {record.date ? format(new Date(record.date.replace(' ', 'T')), 'MMM dd, yyyy') : 'Invalid date'}
</div>
                          {record.provider_id?.getUserName()
                           }
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
  className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
  onClick={(e) => {
    e.stopPropagation();
    setSelectedRecord(record);
    setShowDetailsModal(true);
  }}
  aria-label="View record details"
  title="View record details"
>
  <FileText className="w-6 h-6" />
</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No medical records found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedType
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Upload your first medical record to get started.'
                }
              </p>
              {!searchTerm && !selectedType && (
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Upload Your First Record
                </button>
              )}
            </div>
          )}
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full relative p-8 shadow-2xl">
              <button
  onClick={() => setShowUploadForm(false)}
  className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
  aria-label="Close upload form"
  title="Close"
>
  <X className="w-7 h-7" />
</button>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Medical Record</h2>
              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Record Title</label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Blood Test Results"
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
                  <select
                    id="type"
                    value={uploadData.type}
                    onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors"
                  >
                    {recordTypes.slice(1).map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    id="description"
                    value={uploadData.description}
                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                    placeholder="Brief description of the record..."
                  />
                </div>
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <input
                      type="file"
                      id="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="hidden"
                    />
                    <label htmlFor="file" className="flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <span className="text-sm text-gray-600 font-medium">
                        {uploadData.file ? uploadData.file.name : 'Click to upload or drag and drop'}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PDF, JPG, PNG, DOC up to 10MB
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Upload Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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