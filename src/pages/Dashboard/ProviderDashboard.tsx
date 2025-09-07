//import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Users,
  ChevronRight,
  User,
  CheckCircle,
  AlertCircle,
  LayoutList,
  LucideBarChart3,
  ListTodo,
  CalendarDays,
  Library,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format, isToday, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { mockData } from '../../utils/mockData';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const cuser = user;
  const getPatientInfo = (userId: string) => {
    return mockData.mockPatients.find(p => p.user_id === userId);
  };

  
  const getProviderDetails = (providerId: string) => {
    const provider = mockData.mockProviders.find(u => u.id === providerId);
    return provider ? provider : 'Unknown Provider';
  };

  const getUserDetails = (userId: string) => {
    const user = mockData.mockUsers.find(u => u.id === userId);
    return user ? user : 'Unknown user';
  };

  const getCurrentProvider = () => {
    return mockData.mockProviders.find(p => p.user_id === user?.id);
  };
  
  const calculateWeeklySlots = () => {
    const providerId = getCurrentProvider()?.id;
    
    if (!providerId) return 0;

    const providerSchedules = mockData.mockProviderSchedules.filter(s => s.provider_id === providerId);
  
    let totalSlots = 0;
  
    providerSchedules.forEach(schedule => {
      // Extract hours, minutes, and seconds from the time strings
      const [startHours, startMinutes, startSeconds] = schedule.start_time.split(':').map(Number);
      const [endHours, endMinutes, endSeconds] = schedule.end_time.split(':').map(Number);
    
      // Construct a valid Date object using the components
      const start = new Date(Date.UTC(1970, 0, 1, startHours, startMinutes, startSeconds));
      const end = new Date(Date.UTC(1970, 0, 1, endHours, endMinutes, endSeconds));
    
      console.log('Start date:', start, 'End date:', end);
    
      const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      console.log('Duration:', durationMinutes);
    
      const slotsPerDay = durationMinutes / 30; // 30-min slots
      totalSlots += slotsPerDay * 5;
    });
  
    return totalSlots;
  };
  
  const calculateBookedSlotsThisWeek = () => {
    const providerId = getCurrentProvider()?.id;
    if (!providerId) return 0;
  
    return mockData.mockAppointments.filter(appt => {
      const apptDate = new Date(appt.date);
      return (
        appt.provider_id === providerId &&
        apptDate >= startOfThisWeek &&
        apptDate <= endOfThisWeek
      );
    }).length;
  };
  

  const remainingSlots = () => {
    return calculateWeeklySlots() - calculateBookedSlotsThisWeek();
  };

  // Find the next upcoming appointment for the user
  const now = new Date();
  const nextAppointment = mockData.mockAppointments
    .filter(
      (appt) =>
        getProviderDetails(appt.provider_id).user_id === user?.id &&
        appt.status.toLowerCase() === "confirmed" &&
        new Date(appt.date) > now
    )
    .sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )[0];

  const todayAppointmentsCount = mockData.mockAppointments.filter(
    (appt) => getProviderDetails(appt.provider_id).user_id === user?.id && isToday(appt.date)
  ).length;

  // Find recent patients who have appointments with the current provider
  const recentPatientIds = new Set(
    mockData.mockAppointments
      .filter((appt) => getProviderDetails(appt.provider_id).user_id === user?.id && getUserDetails(appt.patient_id).role === "patient")
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .map((appt) => appt.patient_id)
  );

  const recentPatients = mockData.mockPatients
    .filter((patient) => recentPatientIds.has(patient.user_id))
    .slice(0, 3);

  // Count active patients. This logic is a placeholder; a real-world scenario would use a more complex query.
  const activePatientsCount = new Set(
    mockData.mockAppointments
      .filter((appt) => getProviderDetails(appt.provider_id).user_id === user?.id)
      .map((appt) => appt.patient_id)
  ).size;

  // Count pending reviews. This is a placeholder as 'reviews' aren't in the mock data.
  // We'll use pending appointments as a substitute.
  const pendingReviewsCount = mockData.mockAppointments.filter(
    (appt) => getProviderDetails(appt.provider_id).user_id === user?.id && appt.status === 'pending'
  ).length;

  const stats = [
    {
      label: 'Today\'s Appointments',
      value: todayAppointmentsCount,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'Active Patients',
      value: activePatientsCount,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Pending Reviews',
      value: pendingReviewsCount,
      icon: ListTodo,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'This Month',
      value: mockData.mockAppointments.filter(
        (appt) =>
          getProviderDetails(appt.provider_id).user_id === user?.id &&
          format(appt.date, 'MM-yyyy') === format(new Date(), 'MM-yyyy')
      ).length,
      icon: CalendarDays,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  // --- Dynamic "This Week" Calculation ---
  const today = new Date();
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  const daysOfWeek = eachDayOfInterval({ start: startOfThisWeek, end: endOfThisWeek });
  
  // Filter out Sunday (day 0) from the days of the week array
  const weekdays = daysOfWeek.filter(day => day.getDay() !== 0);

  const appointmentsThisWeek = mockData.mockAppointments.filter(
    (appt) =>
      getProviderDetails(appt.provider_id).user_id === user?.id &&
      new Date(appt.date) >= startOfThisWeek &&
      new Date(appt.date) <= endOfThisWeek
  );
  
  const appointmentsByDay = weekdays.map(day => {
    const appointmentsOnDay = appointmentsThisWeek.filter(appt =>
      isSameDay(new Date(appt.date), day)
    );
    return {
      day: format(day, 'EEEE'),
      count: appointmentsOnDay.length
    };
  });
  // --- End of Dynamic Calculation ---

  // --- Dynamic Greeting ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };
  // --- End of Dynamic Greeting ---

  const getPatientStatus = (patientId:String) => {
    // Placeholder logic for patient status based on their most recent medical record.
    const records = mockData.mockMedicalRecords.filter(r => r.patient_id === patientId);
    if (records.length === 0) return 'monitoring';
    const latestRecord = records
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    if (latestRecord.type === 'diagnosis' && latestRecord.description.toLowerCase().includes('hypertension')) {
      return 'monitoring';
    }
    return 'stable';
  };
  
  const getPatientCondition = (patientId:String) => {
    // Placeholder logic for patient condition
    const records = mockData.mockMedicalRecords.filter(r => r.patient_id === patientId);
    if (records.length === 0) return 'N/A';
    const latestRecord = records
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    if (latestRecord.title.toLowerCase().includes('consultation')) return 'Check-up';
    if (latestRecord.title.toLowerCase().includes('prescription')) return 'Chronic Care';
    if (latestRecord.title.toLowerCase().includes('x-ray')) return 'Imaging';
    return 'General Health';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}   
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{getGreeting()}, {user?.name}</h1>
              <p className="text-gray-600 mt-2">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} • You have {todayAppointmentsCount} appointments today
          </p>
            </div>
          </div>
        </div>



        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">


            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 justify-between">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/schedule"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <LayoutList className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Manage Schedule</h3>
                  <p className="text-sm text-gray-600">Update availability</p>
                </Link>

                <Link
                  to="/patients"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <Library className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">Patient Records</h3>
                  <p className="text-sm text-gray-600">View patient files</p>
                </Link>

               {/* <Link
                    to="/report/stats"
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                      >
                        
                        <LucideBarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-1">Report Stats</h3>
                        <p className="text-sm text-gray-600">View analytics & insights</p>
                      </Link> */}

              </div>
            </div>


            {/* Next Appointment */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Next Appointment</h2>
                <Link
                  to="/schedule"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View schedule
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {nextAppointment ? (
                <div
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getUserDetails(nextAppointment.patient_id).name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {nextAppointment.type} • {nextAppointment.duration} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-semibold text-gray-900">
                          {format(nextAppointment.date, 'MMM d')} • {nextAppointment.time}
                        </span>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                          nextAppointment.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {nextAppointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming appointments scheduled</p>
                </div>
              )}
            </div>

            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Patients */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
                <Link
                  to="/patients"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.user_id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{getUserDetails(patient.user_id).name}</h4>
                        <p className="text-xs text-gray-600">{getPatientCondition(patient.user_id)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getPatientStatus(patient.user_id) === 'stable' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {getPatientStatus(patient.user_id) === 'monitoring' && (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                      {getPatientStatus(patient.user_id) === 'resolved' && (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule Overview */}
            {/* Schedule Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="space-y-4">
              {appointmentsByDay.map((dayData, index) => {
                const percentage = (dayData.count / 5) * 100; // adjust denominator if needed
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">{dayData.day}</span>
                      <span className="text-sm font-semibold text-gray-900">{dayData.count}</span>
                    </div>
                    {/* Bar visualization */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          dayData.count > 0 ? "bg-blue-600" : "bg-gray-400"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Remaining Slots */}
              {/* <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-4">
                <span className="text-sm text-gray-700">Remaining</span>
                <span className="text-sm font-semibold text-blue-600">{remainingSlots()} slots available</span>
              </div> */}
            </div>
          </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;