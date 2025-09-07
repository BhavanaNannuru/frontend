import {
  User,
  Patient,
  Provider,
  Appointment,
  MedicalRecord,
  FileAttachment,
  Schedule,
  TimeSlot,
  Notification,
  ChatMessage,
} from '../types';

// Helper function to generate unique IDs
const generateId = (): string => Math.random().toString(36).substring(2, 15);

// Mock Users
const patient1Id = 'pat-1';
const patient2Id = 'pat-2';
const patient3Id = 'pat-3';
const provider1Id = 'prov-1';
const provider2Id = 'prov-2';
const provider3Id = 'prov-3';
const provider4Id = 'prov-4';


export const mockPatients: Patient[] = [
  {
    id: patient1Id,
    email: 'patient@demo.com',
    name: 'John Doe',
    role: 'patient',
    phone: '555-123-4567',
    createdAt: new Date('2023-01-15T10:00:00Z'),
    dateOfBirth: new Date('1985-06-20T00:00:00Z'),
    address: '123 Oak Street, Anytown, USA',
    age: 23,
    emergencyContact: {
      name: 'Jane Doe',
      phone: '555-987-6543',
      relationship: 'Spouse',
    },
    insurance: {
      provider: 'HealthGuard',
      policyNumber: 'HG789012',
    },
    medicalHistory: [],
    appointments: [],
    healthMetrics: [
      {
        label: 'Blood Pressure',
        value: '110/80',
        unit: 'mmHg',
        status: 'Normal',
        icon: 'Heart',
        color: 'text-green-600',
      },
      {
        label: 'Heart Rate',
        value: 72,
        unit: 'bpm',
        status: 'Normal',
        icon: 'Activity',
        color: 'text-blue-600',
      },
      {
        label: 'Temperature',
        value: 98.6,
        unit: '°F',
        status: 'Normal',
        icon: 'Thermometer',
        color: 'text-orange-600',
      },
    ],
  },
  {
    id: patient2Id,
    email: 'alice.smith@example.com',
    name: 'Alice Smith',
    age: 32,
    role: 'patient',
    phone: '555-234-5678',
    createdAt: new Date('2023-02-20T11:30:00Z'),
    dateOfBirth: new Date('1990-11-10T00:00:00Z'),
    address: '456 Pine Street, Anytown, USA',
    emergencyContact: {
      name: 'Bob Smith',
      phone: '555-345-6789',
      relationship: 'Brother',
    },
    insurance: {
      provider: 'SecureHealth',
      policyNumber: 'SH123456',
    },
    medicalHistory: [],
    appointments: [],
    healthMetrics: [
      {
        label: 'Blood Pressure',
        value: '135/85',
        unit: 'mmHg',
        status: 'Slightly Elevated',
        icon: 'Heart',
        color: 'text-blue-600',
      },
      {
        label: 'Heart Rate',
        value: 85,
        unit: 'bpm',
        status: 'Slightly High',
        icon: 'Activity',
        color: 'text-blue-600',
      },
      {
        label: 'Temperature',
        value: 99.1,
        unit: '°F',
        status: 'Slightly Elevated',
        icon: 'Thermometer',
        color: 'text-orange-600',
      },
    ],
  },
  {
    id: patient3Id,
    email: 'michael.jones@example.com',
    name: 'Michael Jones',
    role: 'patient',
    age: 45,
    phone: '555-345-6789',
    createdAt: new Date('2023-03-01T09:15:00Z'),
    dateOfBirth: new Date('1975-03-25T00:00:00Z'),
    address: '789 Birch Avenue, Anytown, USA',
    emergencyContact: {
      name: 'Susan Jones',
      phone: '555-456-7890',
      relationship: 'Wife',
    },
    insurance: {
      provider: 'WellCare',
      policyNumber: 'WC987654',
    },
    medicalHistory: [],
    appointments: [],
    healthMetrics: [
      {
        label: 'Blood Pressure',
        value: '145/95',
        unit: 'mmHg',
        status: 'High',
        icon: 'Heart',
        color: 'text-orange-600',
      },
      {
        label: 'Heart Rate',
        value: 68,
        unit: 'bpm',
        status: 'Normal',
        icon: 'Activity',
        color: 'text-green-600',
      },
      {
        label: 'Temperature',
        value: 98.2,
        unit: '°F',
        status: 'Normal',
        icon: 'Thermometer',
        color: 'text-green-600',
      },
    ],
  },
];

const staticDate1 = '2025-09-01'; // September 1st, 2025
const staticDate2 = '2025-09-02'; // September 2nd, 2025
const staticDate3 = '2025-09-03'; // September 3rd, 2025


// Mock Provider Data with specific details
const drEmilyAdams: Provider = {
  id: provider1Id,
  email: 'doctor@demo.com',
  name: 'Dr. Emily Adams',
  role: 'provider',
  age: 40,
  createdAt: new Date('2023-11-01T09:00:00Z'),
  specialization: 'Cardiology',
  license: 'MD-12345',
  rating: 4.8,
  experience: '15 years',
  address: '789 Elm St, New York, NY 10002',
  education: "MD, Harvard Medical School",
  languages: ['English', 'Spanish', 'German'],
  schedule: [],
  availableSlots: [
    { id: generateId(), providerId: provider1Id, date: staticDate1, time: '09:00 AM', isBooked: false },
    { id: generateId(), providerId: provider1Id, date: staticDate1, time: '10:30 AM', isBooked: false },
    { id: generateId(), providerId: provider1Id, date: staticDate1, time: '02:00 PM', isBooked: false },
    { id: generateId(), providerId: provider1Id, date: staticDate2, time: '09:00 AM', isBooked: false },
    { id: generateId(), providerId: provider1Id, date: staticDate2, time: '11:00 AM', isBooked: false },
    { id: generateId(), providerId: provider1Id, date: staticDate3, time: '01:00 PM', isBooked: false },
  ],
};

const drRobertBaker: Provider = {
  id: provider2Id,
  email: 'dr.baker@example.com',
  name: 'Dr. Robert Baker',
  age: 33,
  role: 'provider',
  createdAt: new Date('2023-10-25T14:00:00Z'),
  specialization: 'Dermatology',
  license: 'MD-67890',
  rating: 4.5,
  experience: '10 years',
  address: '101 Maple Ln, Los Angeles, CA 90003',
  education: "MD, Stanford University",
  schedule: [],
  languages: ['English', 'Spanish'],
  availableSlots: [
    { id: generateId(), providerId: provider2Id, date: staticDate1, time: '09:30 AM', isBooked: false },
    { id: generateId(), providerId: provider2Id, date: staticDate1, time: '11:00 AM', isBooked: false },
    { id: generateId(), providerId: provider2Id, date: staticDate1, time: '01:00 PM', isBooked: false },
    { id: generateId(), providerId: provider2Id, date: staticDate1, time: '10:00 AM', isBooked: false },
    { id: generateId(), providerId: provider2Id, date: staticDate2, time: '11:30 AM', isBooked: false },
  ],
};

const drTest: Provider = {
  id: provider3Id,
  email: 'dr.test@example.com',
  name: 'Dr. Test',
  role: 'provider',
  age: 32,
  createdAt: new Date('2023-10-25T14:00:00Z'),
  specialization: 'Pediatrics',
  license: 'MD-54321',
  rating: 4.9,
  experience: '8 years',
  address: '222 Birch Rd, Chicago, IL 60601',
  education: "MD, Johns Hopkins University",
  schedule: [],
  languages: ['English', 'German'],
  availableSlots: [
    { id: generateId(), providerId: provider3Id, date: staticDate3, time: '08:00 AM', isBooked: false },
    { id: generateId(), providerId: provider3Id, date: staticDate3, time: '08:30 AM', isBooked: false },
    { id: generateId(), providerId: provider3Id, date: staticDate3, time: '09:00 AM', isBooked: false },
    { id: generateId(), providerId: provider3Id, date: staticDate3, time: '09:30 AM', isBooked: false },
    { id: generateId(), providerId: provider3Id, date: staticDate3, time: '10:00 AM', isBooked: false },
    { id: generateId(), providerId: provider3Id, date: staticDate3, time: '10:30 AM', isBooked: false },
    { id: generateId(), providerId: provider3Id, date: staticDate3, time: '11:00 AM', isBooked: false },
  ],
};

const drABC: Provider = {
  id: provider4Id,
  email: 'dr.ABC@example.com',
  name: 'Dr. ABC DEF',
  role: 'provider',
  age: 43,
  createdAt: new Date('2023-10-25T14:00:00Z'),
  specialization: 'Oncology',
  license: 'MD-67890',
  rating: 5,
  experience: '10 years',
  address: '101 Maple Ln, Los Angeles, CA 90003',
  education: "MD, Stanford University",
  schedule: [],
  languages: ['English', 'Spanish', 'Chinese'],
  availableSlots: [
    { id: generateId(), providerId: provider4Id, date: staticDate2, time: '09:30 AM', isBooked: false },
    { id: generateId(), providerId: provider4Id, date: staticDate2, time: '11:00 AM', isBooked: false },
    { id: generateId(), providerId: provider4Id, date: staticDate2, time: '01:00 PM', isBooked: false },
  ],
};



const file1Id = generateId();
const file2Id = generateId();
export const mockFiles: FileAttachment[] = [
  {
    id: file1Id,
    name: 'Lab_Report_1.pdf',
    type: 'application/pdf',
    size: 250000,
    url: '/files/lab_report_1.pdf',
    uploadedAt: new Date('2024-05-10T12:00:00Z'),
  },
  {
    id: file2Id,
    name: 'Xray_Image_1.jpg',
    type: 'image/jpeg',
    size: 1500000,
    url: '/files/xray_image_1.jpg',
    uploadedAt: new Date('2024-05-12T15:30:00Z'),
  },
];

// Mock Medical Records
const mr1Id = generateId();
const mr2Id = generateId();
const mr3Id = generateId();
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: mr1Id,
    patientId: patient1Id,
    providerIds: [provider1Id],
    uploaderId: provider1Id,
    type: 'diagnosis',
    title: 'Initial Consultation',
    description: 'Patient presented with symptoms of seasonal allergies.',
    date: new Date('2025-09-10T10:00:00Z'),
  },
  {
    id: mr2Id,
    patientId: patient1Id,
    providerIds: [provider1Id, provider2Id],
    uploaderId: provider2Id,
    type: 'prescription',
    title: 'Allergy Medication Prescription',
    description: 'Prescribed antihistamines and a nasal spray.',
    date: new Date('2025-08-10T10:15:00Z'),
    files: [mockFiles[0]],
  },
  {
    id: mr3Id,
    patientId: patient2Id,
    providerIds: [provider2Id],
    uploaderId: provider1Id,
    type: 'imaging',
    title: 'Chest X-ray Report',
    description: 'X-ray showed no signs of pulmonary disease.',
    date: new Date('2025-09-12T16:00:00Z'),
    files: [mockFiles[1]],
  },
];

// Mock Appointments
const appt1Id = generateId(); // Scheduled
const appt2Id = generateId(); // Pending
const appt3Id = generateId(); // Completed
const appt4Id = generateId(); // Cancelled
const appt5Id = generateId(); // Rejected
const appt6Id = generateId(); // Pending
const appt7Id = generateId(); // Pending
export const mockAppointments: Appointment[] = [
  {
    id: appt1Id,
    patientId: patient1Id,
    providerId: provider2Id,
    date: new Date('2025-09-03T00:00:00Z'),
    time: '10:00',
    duration: 30,
    status: 'confirmed',
    type: 'consultation',
    reason: 'Routine check-up for allergies.',
    createdAt: new Date('2025-08-20T10:00:00Z'),
    bookedAt: new Date('2025-08-20T10:05:00Z'),
    confirmedAt: new Date('2025-08-20T11:00:00Z'),
  },
  {
    id: appt2Id,
    patientId: patient1Id,
    providerId: provider1Id,
    date: new Date('2025-09-02T00:00:00Z'),
    time: '14:30',
    duration: 45,
    status: 'pending',
    type: 'follow-up',
    reason: 'Follow-up on recent lab results.',
    createdAt: new Date('2025-08-22T15:00:00Z'),
    bookedAt: new Date('2025-08-22T15:05:00Z'),
  },
  {
    id: appt3Id,
    patientId: patient2Id,
    providerId: provider1Id,
    date: new Date('2025-08-25T00:00:00Z'),
    time: '09:00',
    duration: 30,
    status: 'confirmed',
    type: 'consultation',
    reason: 'Routine check-up for allergies.',
    createdAt: new Date('2025-08-20T10:00:00Z'),
    bookedAt: new Date('2025-08-20T10:05:00Z'),
    confirmedAt: new Date('2025-08-20T11:00:00Z'),
  },
  {
    id: appt4Id,
    patientId: patient2Id,
    providerId: provider1Id,
    date: new Date('2025-09-05T00:00:00Z'),
    time: '11:00',
    duration: 60,
    status: 'cancelled',
    type: 'consultation',
    reason: 'Patient needs to reschedule.',
    createdAt: new Date('2025-08-21T16:00:00Z'),
    bookedAt: new Date('2025-08-21T16:05:00Z'),
    cancellationReason: 'Patient had a conflicting schedule.',
  },
  {
    id: appt5Id,
    patientId: patient1Id,
    providerId: provider1Id,
    date: new Date('2025-09-03T00:00:00Z'),
    time: '13:00',
    duration: 20,
    status: 'rejected',
    type: 'emergency',
    reason: 'Provider not available during requested time.',
    createdAt: new Date('2025-08-23T11:00:00Z'),
    bookedAt: new Date('2025-08-23T11:05:00Z'),
    rejectionReason: 'Not an emergency, book a regular slot.',
  },
  {
    id: appt6Id,
    patientId: patient1Id,
    providerId: provider1Id,
    date: new Date('2025-09-02T00:00:00Z'),
    time: '14:30',
    duration: 45,
    status: 'pending',
    type: 'consultation',
    reason: 'Follow-up on recent lab results.',
    createdAt: new Date('2025-08-31T15:00:00Z'),
    bookedAt: new Date('2025-08-31T15:05:00Z'),
  },
  {
    id: appt7Id,
    patientId: patient3Id,
    providerId: provider1Id,
    date: new Date('2025-09-12T00:00:00Z'),
    time: '14:30',
    duration: 45,
    status: 'pending',
    type: 'emergency',
    reason: 'Follow-up on recent lab results.',
    createdAt: new Date('2025-09-02T15:00:00Z'),
    bookedAt: new Date('2025-09-02T15:05:00Z'),
  },
];

// Mock Schedules
const sch1Id = generateId();
const sch2Id = generateId();
export const mockSchedules: Schedule[] = [
  {
    id: sch1Id,
    providerId: provider1Id,
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00',
  },
  {
    id: sch2Id,
    providerId: provider2Id,
    dayOfWeek: 3, // Wednesday
    startTime: '10:00',
    endTime: '18:00',
  },
];

// Mock Time Slots
const ts1Id = generateId();
const ts2Id = generateId();
const ts3Id = generateId();
export const mockTimeSlots: TimeSlot[] = [
  {
    id: ts1Id,
    providerId: provider1Id,
    date: new Date('2025-09-01T00:00:00Z'),
    time: '10:00',
    isBooked: true,
    appointmentId: appt1Id,
    isBreak: false,
  },
  {
    id: ts2Id,
    providerId: provider1Id,
    date: new Date('2025-09-01T00:00:00Z'),
    time: '11:00',
    isBooked: false,
    isBreak: true,
  },
  {
    id: ts3Id,
    providerId: provider2Id,
    date: new Date('2025-09-05T00:00:00Z'),
    time: '11:00',
    isBooked: false, 
    isBreak: false,
  },
];

// Mock Notifications
const notif1Id = generateId();
const notif2Id = generateId();
const notif3Id = generateId();
const notif4Id = generateId();
const notif5Id = generateId();
export const mockNotifications: Notification[] = [
  {
    id: notif1Id,
    userId: patient1Id,
    type: 'appointment-confirmed',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Adams on Sep 1, 2025 has been confirmed.',
    read: false,
    createdAt: new Date('2025-08-20T11:00:00Z'),
    relatedEntityId: appt1Id,
  },
  {
    id: notif2Id,
    userId: provider1Id,
    type: 'appointment-reminder',
    title: 'Reminder: Upcoming Appointment',
    message: 'You have an appointment with Jane Doe tomorrow.',
    read: false,
    createdAt: new Date('2025-08-31T09:00:00Z'),
    relatedEntityId: appt1Id,
  },
  {
    id: notif3Id,
    userId: patient2Id,
    type: 'appointment-cancelled',
    title: 'Appointment Cancelled',
    message: 'Your appointment with Dr. Baker on Sep 5, 2025 has been cancelled.',
    read: false,
    createdAt: new Date('2025-08-22T10:00:00Z'),
    relatedEntityId: appt4Id,
  },
  {
    id: notif4Id,
    userId: provider1Id,
    type: 'appointment-confirmed',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Adams on Sep 1, 2025 has been confirmed.',
    read: false,
    createdAt: new Date('2025-08-20T11:00:00Z'),
    relatedEntityId: appt1Id,
  },
  {
    id: notif5Id,
    userId: provider1Id,
    type: 'appointment-reminder',
    title: 'Reminder: Upcoming Appointment',
    message: 'You have an appointment with Jane Doe tomorrow.',
    read: false,
    createdAt: new Date('2025-08-31T09:00:00Z'),
    relatedEntityId: appt1Id,
  }
];

// Mock Chat Messages
const chat1Id = generateId();
const chat2Id = generateId();
export const mockChatMessages: ChatMessage[] = [
  {
    id: chat1Id,
    conversationId: 'conv1',
    senderId: patient1Id,
    receiverId: provider1Id,
    text: 'Hi Dr. Adams, can you please confirm my appointment?',
    timestamp: new Date('2025-08-20T10:30:00Z'),
  },
  {
    id: chat2Id,
    conversationId: 'conv1',
    senderId: provider1Id,
    receiverId: patient1Id,
    text: 'Hello Jane, yes, your appointment is confirmed.',
    timestamp: new Date('2025-08-20T11:00:00Z'),
  },
];

export const mockUsers: User[] = [...mockPatients, drEmilyAdams, drRobertBaker, drTest, drABC];

export const mockData = {
  users: mockUsers,
  patients: mockPatients,
  providers: [
    drEmilyAdams,
    drRobertBaker,
    drTest,
    drABC,
  ],
  appointments: mockAppointments,
  medicalRecords: mockMedicalRecords,
  files: mockFiles,
  schedules: mockSchedules,
  timeSlots: mockTimeSlots,
  notifications: mockNotifications,
  chatMessages: mockChatMessages,
};