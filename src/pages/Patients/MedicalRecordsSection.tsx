import React, { useEffect, useState } from 'react';
import { MedicalRecord, Provider } from '../../types';
import { Calendar, FileText, Upload, Plus, Download, Eye, X, Paperclip } from 'lucide-react';
import { mockData, mockMedicalRecords } from '../../utils/mockData';
import axios from "axios";
import { useAuth } from '../../context/AuthContext';


interface MedicalRecordsSectionProps {
  patientId: string;
  medicalRecords: MedicalRecord[];
  onAddRecord: (record: Omit<MedicalRecord, 'id'>) => void;
}


async function handleUploadAndSaveRecord(file: File | null, formData: any) {
  const data = new FormData();

  // Append fields
  data.append("patient_id", formData.patient_id);
  data.append("type", formData.type);
  data.append("title", formData.title);
  data.append("description", formData.description);
  data.append("date", formData.date);

  // Only append the file if it exists
  if (file) {
    data.append("file", file);
  }

  const res = await axios.post("http://localhost:5000/api/medical-records", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });


  return res.data; // contains { id, fileUrl? }
}



const MedicalRecordsSection: React.FC<MedicalRecordsSectionProps> = ({
  patientId,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(
    mockMedicalRecords.filter(record => record.patient_id === patientId)
  );

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/medical-records/patients/${patientId}`
        );
        setMedicalRecords(res.data);  // assuming backend returns an array of records
      } catch (err) {
        console.error("Failed to fetch medical records:", err);
        setMedicalRecords([]); // fallback
      }
    };
  
    if (patientId) {
      fetchRecords();
    }
  }, [patientId]);

  const [newRecord, setNewRecord] = useState({
    type: 'diagnosis' as MedicalRecord['type'],
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    files: [] as File[],
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewRecord({ ...newRecord, files: [...newRecord.files, ...files] });
  };

  const removeFile = (index: number) => {
    const updatedFiles = newRecord.files.filter((_, i) => i !== index);
    setNewRecord({ ...newRecord, files: updatedFiles });
  };

  const getRecordTypeColor = (type: MedicalRecord['type']) => {
    const colors = {
      diagnosis: 'bg-red-100 text-red-800',
      prescription: 'bg-blue-100 text-blue-800',
      'lab-result': 'bg-green-100 text-green-800',
      imaging: 'bg-purple-100 text-purple-800',
      note: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Ensure uploader_id exists
    if (!user?.id) {
      alert("You are not logged in or provider ID is missing");
      return;
    }
  
    const formData: FormData = new FormData();
    formData.append("patient_id", patientId);
    formData.append("uploader_id", user.id);
    formData.append("type", newRecord.type);
    formData.append("title", newRecord.title);
    formData.append("description", newRecord.description);
    formData.append("date", new Date(newRecord.date).toISOString().split("T")[0]);


  
    // Append files if any
    if (newRecord.files.length > 0) {
      const file = newRecord.files[0];
      formData.append("file", file);
    }
  
    try {
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      console.log("6666666666666^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")

      const response = await axios.post(
        "http://localhost:5000/api/medical-records",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      const result = response.data;
  
      // Update local state with the newly created record
      const uploadedRecord: MedicalRecord = {
        id: result.id,
        patient_id: result.patient_id,
        uploader_id: result.uploader_id,
        type: result.type,
        title: result.title,
        description: result.description,
        date: new Date(result.date),
        files: result.files || [],
      };
  
      setMedicalRecords([uploadedRecord, ...medicalRecords]);
      mockMedicalRecords.unshift(uploadedRecord);
  
      // Reset form
      setNewRecord({
        type: "diagnosis",
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        files: [],
      });
      setShowAddForm(false);
      // window.location.reload();
    } catch (err: any) {
      console.error("Failed to upload record:", err);
      alert(err.response?.data?.error || "Failed to add medical record.");
    }
  };


  
  const { user } = useAuth();
  const getProviderDetails = (): Provider => {
    const provider = mockData.mockProviders.find(p => p.user_id === user?.id);
    return provider;
  };
  

  return (
    <div className="space-y-6">
      {!showAddForm && (
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Medical Records</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Record
          </button>
        </div>
      )}
      
      {showAddForm && (
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Add New Medical Record</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Record Type
                </label>
                <select
  value={newRecord.type}
  onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value as MedicalRecord['type'] })}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  aria-label="Select medical record type"
  title="Select medical record type"
>
  <option value="diagnosis">Diagnosis</option>
  <option value="prescription">Prescription</option>
  <option value="lab-result">Lab Result</option>
  <option value="imaging">Imaging</option>
  <option value="note">Note</option>
</select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </label>
                <input
  type="date"
  value={newRecord.date}
  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  required
  aria-label="Select record date"
  title="Select record date"
/>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4 inline mr-1" />
                Title
              </label>
              <input
                type="text"
                value={newRecord.title}
                onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter record title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4 inline mr-1" />
                Description
              </label>
              <textarea
                value={newRecord.description}
                onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2} // Changed from rows={3} to make it more compact
                placeholder="Enter detailed description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Paperclip className="w-4 h-4 inline mr-1" />
                Attach Files (Optional)
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                
                {newRecord.files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                    {newRecord.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
  type="button"
  onClick={() => removeFile(index)}
  className="p-1 text-red-400 hover:text-red-600 transition-colors duration-200"
  aria-label="Remove file"
  title="Remove file"
>
  <X className="w-4 h-4" />
</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </button>
            </div>
          </form>
        </div>
      )}
      
      {!showAddForm && (
        <div className="space-y-4">
          {medicalRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No medical records found</p>
            </div>
          ) : (
            medicalRecords.map((record) => (
              <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRecordTypeColor(record.type)}`}>
                      {record.type.replace('-', ' ')}
                    </span>
                    <h4 className="text-lg font-medium text-gray-900">{record.title}</h4>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(record.date).toLocaleDateString("en-US")}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{record.description}</p>
                
                {record.files && record.files.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Attachments</h5>
                    <div className="space-y-2">
                      {record.files.map((file) => (
                        <div key={file.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900"><span>{decodeURIComponent(file.name)}</span></p>
                              {/* <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p> */}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                            aria-label="View record"
                            title="View record"
                          >
                            <Eye className="w-4 h-4" />
                          </a>

                          <a
                            href={file.url}
                            download
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                            aria-label="Download record"
                            title="Download record"
                          >
                            <Download className="w-4 h-4" />
                          </a>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsSection;