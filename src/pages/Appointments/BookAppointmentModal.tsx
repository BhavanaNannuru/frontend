import React from 'react';
import { Dialog } from '@headlessui/react';
import BookAppointmentSection from '../Patients/BookAppointmentSection';
import { Appointment } from '../../types';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedTime?: string;
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
}) => {
  const handleBookAppointment = (appointment: Omit<Appointment, 'id'>) => {
    console.log('Booked appointment:', appointment);
    // Here you would normally call your API to save the appointment
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-white rounded-xl shadow-lg p-6 z-50 w-full max-w-lg">
      <BookAppointmentSection
  patientId="current-patient-id"
  onBookAppointment={handleBookAppointment}
  defaultDate={selectedDate}
  defaultTime={selectedTime}
/>
      </div>
    </Dialog>
  );
};

export default BookAppointmentModal;
