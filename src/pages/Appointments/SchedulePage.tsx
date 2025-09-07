import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Filter, Clock, Plus, Stethoscope, Heart, Activity, AlertCircle, CheckCircle, ConeIcon, Computer } from 'lucide-react';
import { mockAppointments, mockData } from '../../utils/mockData';
import { Appointment } from '../../types';
import AppointmentModal from '../Appointments/AppointmentModal';
import BookAppointmentModal from '../Appointments/BookAppointmentModal';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook
import { useNavigate } from 'react-router-dom';


type ViewType = 'daily' | 'weekly' | 'monthly';
type AppointmentType = 'consultation' | 'follow-up' | 'check-up' | 'emergency' | 'other' | 'all';

const SchedulePage: React.FC = () => {
  const { user: currentUser, isLoading } = useAuth(); // Get the user from the context
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('daily');
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<AppointmentType>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; time: string } | null>(null);

  // If the user is not loaded yet, or not logged in, show a loading/message state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading schedule...</p>
      </div>
    );
  }

  // Restrict access to providers only
  if (!currentUser || currentUser.role !== 'provider') {
    return <div className="min-h-screen flex items-center justify-center">Access Denied. This page is for healthcare providers.</div>;
  }

  // The rest of the component logic is already sound, so we will use it as is.
  // The 'currentUser.id' is already being correctly passed to the `userAppointments` filter.

  // The rest of the component's logic from the original file...
  const appointmentTypeColors = {
    consultation: 'bg-blue-500 border-blue-600 text-blue-50',
    'follow-up': 'bg-green-500 border-green-600 text-green-50',
    'check-up': 'bg-purple-500 border-purple-600 text-purple-50',
    emergency: 'bg-red-500 border-red-600 text-red-50',
    other: 'bg-gray-500 border-gray-600 text-gray-50',
  };

  const appointmentTypeIcons = {
    consultation: Stethoscope,
    virtual: Computer,
    'follow-up': Activity,
    'check-up': Heart,
    emergency: AlertCircle,
    other: Clock,
    default: Clock, // 👈 New fallback key
  };

  const statusStyles = {
    scheduled: 'ring-2 ring-green-300',
    pending: 'ring-2 ring-yellow-300 opacity-75',
    cancelled: 'ring-2 ring-red-300 opacity-50',
    rejected: 'ring-2 ring-red-300 opacity-50',
    completed: 'ring-2 ring-blue-300 opacity-60',
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);

    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const generateTimeSlots = (date: Date) => {
    const slots = [];
    const startTime = 9;
    const endTime = 17;
    
    for (let hour = startTime; hour < endTime; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        const isLunchBreak = hour === 12 && minute === 0;
        const isBreak1 = hour === 10 && minute === 30;
        const isBreak2 = hour === 15 && minute === 0;

        slots.push({
          time: timeString,
          displayTime,
          date:date,
          isBreak: isLunchBreak || isBreak1 || isBreak2,
          breakType: isLunchBreak ? 'Lunch Break' : (isBreak1 || isBreak2) ? 'Break' : null,
        });
      }
    }
    return slots;
  };
const getUserId = (providerId: string) => {
  const provider= mockData.mockProviders.find(u => u.id === providerId);
  return provider ? provider.user_id : 'Unknown UserId';
};
  const filteredAppointments = useMemo(() => {
    let dateRange: Date[] = [];
    
    if (viewType === 'daily') {
      dateRange = [currentDate];
    } else if (viewType === 'weekly') {
      dateRange = getWeekDates(currentDate);
    } else if (viewType === 'monthly') {
      dateRange = getMonthDates(currentDate);
    }


    const userAppointments = mockData.mockAppointments.filter(apt => {
      //return apt.provider_id === currentUser.id;
      return getUserId(apt.provider_id )===currentUser.id;
    });

    const appointments = userAppointments.filter(apt => {
      const appointmentDate = new Date(apt.date);
      const isDateMatch = dateRange.some(date => 
        appointmentDate.toDateString() === date.toDateString()
      );
      const isTypeMatch = selectedAppointmentType === 'all' || apt.type === selectedAppointmentType;
      return isDateMatch && isTypeMatch;
    });

    return appointments;
  }, [currentDate, selectedAppointmentType, viewType, currentUser]);

  const timeSlots = generateTimeSlots(currentDate);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewType === 'daily') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewType === 'weekly') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

   const toHHMMSS = (input?: string | null): string => {
    if (!input) return '';

    const trimmed = input.trim();

    // ISO-like datetime => use Date to extract HH:MM:SS (UTC)
    if (trimmed.includes('T')) {
      try {
        const iso = new Date(trimmed).toISOString();
        return iso.split('T')[1].split('Z')[0].split('.')[0]; // "HH:MM:SS"
      } catch {
        // fallthrough
      }
    }

    // If already in HH:MM or HH:MM:SS(.ms)
    const hmMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (hmMatch) {
      const hh = hmMatch[1].padStart(2, '0');
      const mm = hmMatch[2];
      const ss = hmMatch[3] ? hmMatch[3].padStart(2, '0') : '00';
      return `${hh}:${mm}:${ss}`;
    }

    // As a last resort, return the original trimmed string
    return trimmed;
  };

  const getAppointmentForSlot = (timeString: string, date?: Date) => {
  const targetDate = date || currentDate;

  // Ensure frontend time always has HH:mm:ss format for comparison
  const normalizedTime = timeString.length === 5 ? `${timeString}:00` : timeString;

  return filteredAppointments.find(apt => {
    // Normalize DB time (just in case it comes as Date or with ms)
    const aptTime = String(apt.time.split('.')[0]); // remove .000 if present
    return (
      aptTime === normalizedTime &&
      new Date(apt.date).toDateString() === targetDate.toDateString()
    );
  });
};


const handleSlotClick = (timeString: string, displayTime: string, isBreak: boolean, date?: Date) => {
  if (isBreak) return;

  const appointment = getAppointmentForSlot(timeString, date);

  if (appointment) {
    setSelectedAppointment(appointment);
    setIsAppointmentModalOpen(true);
  } else {
    // Redirect to patients page
    navigate('/patients');
  }
};
   

  const handleConfirmAppointment = (appointmentId: string) => {
    setIsAppointmentModalOpen(false);
  };

  const handleRejectAppointment = (appointmentId: string, reason: string) => {
    setIsAppointmentModalOpen(false);
  };

  const formatDateDisplay = () => {
    if (viewType === 'daily') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else if (viewType === 'weekly') {
      const weekDates = getWeekDates(currentDate);
      const startDate = weekDates[0];
      const endDate = weekDates[6];
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
  };

  const appointmentTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: filteredAppointments.length,
      consultation: 0,
      'follow-up': 0,
      'check-up': 0,
      emergency: 0,
      other: 0,
    };
    filteredAppointments.forEach(apt => {
      counts[apt.type] = (counts[apt.type] || 0) + 1;
    });
    return counts;
  }, [filteredAppointments]);

  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter(apt => {
      const appointmentDate = new Date(apt.date);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  const renderDailyView = () => (
    <div className="space-y-2 max-h-[600px] overflow-y-auto">
      {timeSlots.map((slot) => {
        const appointment = getAppointmentForSlot(slot.time,slot.date);
        const isFiltered = selectedAppointmentType !== 'all' && appointment && appointment.type !== selectedAppointmentType;

        return (
          <div
            key={slot.time}
            onClick={() => handleSlotClick(slot.time, slot.displayTime, slot.isBreak)}
            className={`flex items-center p-4 rounded-xl transition-all cursor-pointer border-2 ${
              slot.isBreak
                ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                : appointment
                ? `${appointmentTypeColors[appointment.type as keyof typeof appointmentTypeColors]} ${statusStyles[appointment.status as keyof typeof statusStyles]} ${
                    isFiltered ? 'opacity-30' : ''
                  } hover:shadow-md`
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <div className="flex-shrink-0 w-20">
              <span className={`font-medium ${
                slot.isBreak ? 'text-gray-500' : appointment ? 'text-current' : 'text-gray-700'
              }`}>
                {slot.displayTime}
              </span>
            </div>

            <div className="flex-1 ml-4">
              {slot.isBreak ? (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 font-medium">{slot.breakType}</span>
                </div>
              ) : appointment ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {React.createElement(appointmentTypeIcons[appointment.type as keyof typeof appointmentTypeIcons], {
                      className: "w-5 h-5"
                    })}
                    <div>
                      <p className="font-semibold">
                        {mockData.mockUsers.find(p => p.id === appointment.patient_id)?.name || 'Unknown Patient'}
                      </p>
                      <p className="text-sm opacity-90 capitalize">
                        {appointment.type.replace('-', ' ')} • {appointment.duration}min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {appointment.status === 'scheduled' && <CheckCircle className="w-4 h-4" />}
                    {appointment.status === 'pending' && <AlertCircle className="w-4 h-4" />}
                    <span className="text-xs font-medium opacity-90 capitalize">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Plus className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600 font-medium">Available Slot</span>
                  </div>
                  <span className="text-xs text-gray-500">Click to go to Patients tab</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderWeeklyView = () => {
    const weekDates = getWeekDates(currentDate);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const dayAppointments = getAppointmentsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();

            return (
              <div
                key={date.toISOString()}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isToday
                    ? 'border-blue-500 bg-blue-50'
                    : isCurrentMonth
                    ? 'border-gray-200 hover:border-gray-300'
                    : 'border-gray-100 opacity-50'
                }`}
              >
                <div className="text-center mb-2">
                  <div className="text-xs text-gray-500 font-medium">{dayNames[index]}</div>
                  <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </div>
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((apt) => {
                    const isFiltered = selectedAppointmentType !== 'all' && apt.type !== selectedAppointmentType;
                    return (
                      <div
                        key={apt.id}
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setIsAppointmentModalOpen(true);
                        }}
                        className={`p-2 rounded text-xs cursor-pointer transition-all ${
                          appointmentTypeColors[apt.type as keyof typeof appointmentTypeColors]
                        } ${statusStyles[apt.status as keyof typeof statusStyles]} ${isFiltered ? 'opacity-30' : 'hover:shadow-sm'}`}
                      >
                        <div className="font-medium truncate">
                          {mockData.mockUsers.find(p => p.id === apt.patient_id)?.name || 'Unknown'}
                        </div>
                        <div className="opacity-90">{apt.time}</div>
                      </div>
                    );
                  })}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const monthDates = getMonthDates(currentDate);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeks = [];
    
    for (let i = 0; i < monthDates.length; i += 7) {
      weeks.push(monthDates.slice(i, i + 7));
    }

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((date) => {
                const dayAppointments = getAppointmentsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();

                return (
                  <div
                    key={date.toISOString()}
                    className={`p-2 rounded-lg border transition-all min-h-[80px] ${
                      isToday
                        ? 'border-blue-500 bg-blue-50'
                        : isCurrentMonth
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-100 opacity-50'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map((apt) => {
                        const isFiltered = selectedAppointmentType !== 'all' && apt.type !== selectedAppointmentType;
                        return (
                          <div
                            key={apt.id}
                            onClick={() => {
                              setSelectedAppointment(apt);
                              setIsAppointmentModalOpen(true);
                            }}
                            className={`p-1 rounded text-xs cursor-pointer transition-all ${
                              appointmentTypeColors[apt.type as keyof typeof appointmentTypeColors]
                            } ${statusStyles[apt.status as keyof typeof statusStyles]} ${isFiltered ? 'opacity-30' : 'hover:shadow-sm'}`}
                          >
                            <div className="font-medium truncate text-xs">
                              {apt.time}
                            </div>
                          </div>
                        );
                      })}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Schedule</h1>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
              {(['daily', 'weekly', 'monthly'] as ViewType[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setViewType(view)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    viewType === view
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Date Navigation */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
              <button
  type="button"
  onClick={() => navigateDate('prev')}
  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
  aria-label="Previous date"
>
  <ChevronLeft className="w-5 h-5" />
</button>

<div className="text-center">
  <h3 className="font-semibold text-gray-900">{formatDateDisplay()}</h3>
</div>

<button
  type="button"
  onClick={() => navigateDate('next')}
  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
  aria-label="Next date"
>
  <ChevronRight className="w-5 h-5" />
</button>
              </div>
            </div>

            {/* Appointment Type Filter */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filter by Type</h3>
              </div>
              <div className="space-y-2">
                {(['all', 'consultation', 'follow-up', 'check-up', 'emergency', 'other'] as AppointmentType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedAppointmentType(type)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedAppointmentType === type
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <span className="capitalize font-medium">
                      {type === 'all' ? 'All Types' : type.replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedAppointmentType === 'all'
                          ? 'bg-gray-200 text-gray-700'
                          : selectedAppointmentType === type
                          ? 'bg-blue-200 text-blue-700'
                          : appointmentTypeCounts[type as keyof typeof appointmentTypeCounts] > 0
                          ? 'bg-green-200 text-green-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                      {appointmentTypeCounts[type as keyof typeof appointmentTypeCounts] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Status Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded ring-2 ring-green-300"></div>
                  <span className="text-sm text-gray-700">Confirmed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded ring-2 ring-yellow-300 opacity-75"></div>
                  <span className="text-sm text-gray-700">Pending</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded ring-2 ring-red-300 opacity-50"></div>
                  <span className="text-sm text-gray-700">Cancelled/Rejected</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded ring-2 ring-blue-300 opacity-60"></div>
                  <span className="text-sm text-gray-700">Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Schedule */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)} Schedule
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{filteredAppointments.length} appointments</span>
                </div>
              </div>

              {viewType === 'daily' && renderDailyView()}
              {viewType === 'weekly' && renderWeeklyView()}
              {viewType === 'monthly' && renderMonthlyView()}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AppointmentModal
        appointment={selectedAppointment}
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onConfirm={handleConfirmAppointment}
        onReject={handleRejectAppointment}
      />

      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        selectedDate={selectedSlot?.date}
        selectedTime={selectedSlot?.time}
      />
    </div>
  );
};

export default SchedulePage;