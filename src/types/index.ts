export interface User {
  id: string;
  email: string;
  name: string;
  date_of_birth?: Date;
  role: 'patient' | 'provider';
  phone?: string;
  profileImage?: string;
  createdAt: Date;
  age: number;
}

export interface Patient extends User {
  user_id: string;
  role: 'patient';
  date_of_birth: Date;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  insurance_provider: string;
  insurance_policy_number: string;
  medicalHistory: MedicalRecord[];
  appointments: Appointment[];
  healthMetrics: HealthMetrics[];
}


export interface Provider extends User {
  role: 'provider';
  specialization: string;
  license: string;
  rating: number;
  experience: string;
  address: string;
  education: string;
  schedule: Array<{
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    startTime: string; // e.g., '09:00 AM'
    endTime: string; // e.g., '05:00 PM'
  }>;
  languages: string[];
  availableSlots: Array<{
    id: string;
    providerId: string;
    date: string; // Format: 'YYYY-MM-DD'
    time: string; // Format: 'HH:mm AM/PM'
    isBooked: boolean;
  }>;
}

export interface Appointment {
  id: string;
  patient_id: string;
  provider_id: string;
  date: Date;
  time: string;
  duration: number; 
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  type: 'consultation' | 'follow-up' | 'check-up' | 'emergency' | 'other';
  reason: string; 
  notes?: string;
  createdAt: Date; 
  bookedAt: Date; 
  confirmedAt?: Date; 
  cancellationReason?: string;
  rejectionReason?: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  uploader_id?: string;
  type: 'diagnosis' | 'prescription' | 'lab-result' | 'imaging' | 'note';
  title: string;
  description: string;
  date: Date;
  files?: FileAttachment[];
  link? : string;
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface Schedule {
  id: string;
  providerId: string;
  dayOfWeek: number; // 0-6, Sunday = 0
  startTime: string;
  endTime: string;
}

export interface TimeSlot {
  id: string;
  provider_id: string;
  date: Date;
  time: string;
  is_booked: boolean;
  appointment_id?: string; // Links the slot to an appointment once booked.
  is_break: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'appointment-reminder' | 'appointment-confirmed' | 'appointment-cancelled' | 'appointment-rejected' | 'medical-record-updated' | 'system-message' | 'chat-message';
  title: string;
  message: string;
  is_read: boolean;
  relatedEntityId?: string; // Can be a link to the appointment, medical record, etc.
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
}

export interface HealthMetrics {
  label: 'Blood Pressure' | 'Heart Rate' | 'Temperature';
  value: number | string;
  unit: string;
  status: string;
  icon: 'Heart' | 'Activity' | 'Thermometer';
  color: 'text-green-600' | 'text-blue-600' | 'text-orange-600';
}