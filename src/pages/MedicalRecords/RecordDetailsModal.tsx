import React from 'react';
import { Download, FileText, Calendar, User, X, Eye } from 'lucide-react';
import { mockData } from '../../utils/mockData';
import { format } from 'date-fns';
import { MedicalRecord } from '../../types/index';

// Helper function to find user names from IDs
const getUserName = (userId: string) => {
  const user = mockData.mockUsers.find(u => u.id === userId);
  return user ? user.name : 'Unknown User';
};

interface RecordDetailsModalProps {
  record: MedicalRecord;
  onClose: () => void;
}

const RecordDetailsModal: React.FC<RecordDetailsModalProps> = ({ record, onClose }) => {
  const getProviderNames = (provider_id: string) => {
    return provider_id?.getUserName();
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lab-result':
        return 'bg-blue-50 text-blue-800';
      case 'prescription':
        return 'bg-emerald-50 text-emerald-800';
      case 'imaging':
        return 'bg-indigo-50 text-indigo-800';
      case 'note':
        return 'bg-amber-50 text-amber-800';
      case 'diagnosis':
        return 'bg-rose-50 text-rose-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative">
        <button
  onClick={onClose}
  className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
  aria-label="Close"
  title="Close"
>
  <X className="w-7 h-7" />
</button>
        <div className="flex items-center mb-6">
          <div className={`p-3 rounded-full ${getTypeColor(record.type)}`}>
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 ml-4">{record.title}</h2>
        </div>

        <div className="space-y-6 text-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-sm font-semibold text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{format(new Date(record.date), 'MMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-3">
              <FileText className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-sm font-semibold text-gray-500">Record Type</p>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(record.type)}`}>
                  {record.type.replace('-', ' ')}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-3">
              <User className="w-6 h-6 text-gray-500" />
              <div>
                <p className="text-sm font-semibold text-gray-500">Uploaded By</p>
                <p className="font-medium text-gray-900">{getUserName(record.uploader_id)}</p>
              </div>
            </div>
            
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="font-semibold text-gray-500 mb-2">Description</p>
            <p className="font-medium text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-xl">{record.description}</p>
          </div>


          {record.link ? (
  <div className="pt-4 border-t border-gray-200">
    <p className="font-semibold text-gray-500 mb-3">File Attachment</p>
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 transition-shadow hover:shadow-md">
      <span className="text-sm font-medium text-gray-900 truncate pr-4">
        {record.title || "Attached File"}
      </span>
      <div className="flex space-x-2">
        <a
          href={record.link}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2"
          title="View File"
        >
           <Eye className="w-4 h-4" />
        </a>
        <button
          onClick={() => handleDownload(record.link as string, record.title || "file")}
          className="p-2"
          aria-label="Download file"
          title="Download file"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
) : (
  <div className="pt-4 border-t border-gray-200 text-sm text-gray-500 italic">
    No files attached to this record.
  </div>
)}




        </div>
      </div>
    </div>
  );
};

export default RecordDetailsModal;