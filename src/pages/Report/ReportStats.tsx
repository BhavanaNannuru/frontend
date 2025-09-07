import React, { useMemo, useState, useEffect } from "react";
// import { mockAppointments, mockUsers } from "../../utils/mockData";
import { format, startOfWeek, startOfMonth } from "date-fns";
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

const statusOrder = ["scheduled", "completed", "cancelled"] as const;
type StatusKey = typeof statusOrder[number];

const pretty = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ReportStats: React.FC = () => {
  const { user: currentUser, isLoading } = useAuth(); // Get user from AuthContext

  const [startDate, setStartDate] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [endDate, setEndDate] = useState("");
  const [activeStatus, setActiveStatus] = useState<"all" | StatusKey>("all");
  const [activeTab, setActiveTab] = useState<"Daily" | "Weekly" | "Monthly">(
    "Daily"
  );

useEffect(() => {
  const fetchData = async () => {
    try {
      const [apptRes, userRes] = await Promise.all([
        fetch("http://localhost:5000/api/appointments"),
        fetch("http://localhost:5000/api/users")
      ]);

      const appts = await apptRes.json();
      const usrs = await userRes.json();

      setAppointments(appts);
      setUsers(usrs);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  fetchData();
}, []);


  // Check for loading state or if the user is not a provider
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading report...</p>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'provider') {
    return <div className="min-h-screen flex items-center justify-center">Access Denied. This page is for healthcare providers.</div>;
  }

  // Filter appointments for the current provider only
  const providerAppointments = useMemo(() => {
    return appointments.filter(appt => appt.provider_id === currentUser.id);
  }, [currentUser.id]);

  // Status counts for the current provider
  const statusCounts = useMemo(() => {
    const counts: Record<StatusKey, number> = {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const a of providerAppointments) {
      const key = a.status as StatusKey;
      if (key in counts) counts[key] += 1;
    }
    return counts;
  }, [providerAppointments]);

  const getUserName = (id: string) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name : "Unknown";
  };

  const filteredAppointments = useMemo(() => {
    if (!startDate || !endDate) return [];
    
    return providerAppointments.filter((appt) => {
      const apptDate = new Date(appt.date);
      // normalize to YYYY-MM-DD for safe comparison
      const apptKey = apptDate.toISOString().split("T")[0];
  
      return (
        apptKey >= startDate &&
        apptKey <= endDate &&
        (activeStatus === "all" || appt.status === activeStatus)
      );
    });
  }, [startDate, endDate, activeStatus, providerAppointments]);
  

  const groupedAppointments = useMemo(() => {
    if (!startDate || !endDate) return {};
    return filteredAppointments.reduce((acc, appt) => {
      const d = new Date(appt.date);
      let key = "";
      if (activeTab === "Daily") {
        key = format(d, "yyyy-MM-dd");
      } else if (activeTab === "Weekly") {
        key = format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-'W'ww");
      } else {
        key = format(startOfMonth(d), "yyyy-MM");
      }
      if (!acc[key]) acc[key] = [];
      acc[key].push(appt);
      return acc;
    }, {} as Record<string, typeof appointments>);
  }, [filteredAppointments, activeTab, startDate, endDate]);

  return (
    <div className="px-4 py-8 md:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black-700">
          Doctor Appointment Report
        </h1>
        <div className="hidden sm:flex items-center gap-2 rounded-full bg-blue-100 p-1">
          {["Daily", "Weekly", "Monthly"].map((tab) => (
            <button
  key={tab}
  type="button"
  onClick={() => setActiveTab(tab as any)}
  className={`px-4 py-1 text-sm rounded-full transition ${
    activeTab === tab
      ? "bg-white shadow text-blue-700 font-semibold"
      : "text-blue-600 hover:text-blue-800"
  }`}
  role="tab"
  aria-selected={activeTab === tab ? "true" : "false"}
  // optional but nice for a11y tooling:
  // id={`tab-${tab}`}
  // aria-controls={`panel-${tab}`}
>
  {tab}
</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left panel */}
        <aside className="rounded-2xl bg-white shadow-md border border-blue-100 p-4">
          {/* Date picker */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mb-6">
            <div className="text-center text-blue-700 font-medium mb-3">
              Select Date Range
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-blue-600 mb-1">
                  Start Date
                </label>
                <div className="flex flex-col">
  <label
    htmlFor="startDate"
    className="mb-1 text-sm font-medium text-gray-700"
  >
    Start Date
  </label>
  <input
    id="startDate"
    type="date"
    className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
  />
</div>

              </div>
              <div>
                <label className="block text-xs font-medium text-blue-600 mb-1">
                  End Date
                </label>
                <div className="flex flex-col">
  <label
    htmlFor="endDate"
    className="mb-1 text-sm font-medium text-gray-700"
  >
    End Date
  </label>
  <input
    id="endDate"
    type="date"
    className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
  />
</div>
              </div>
            </div>
          </div>

          {/* Status filters */}
          <div>
            <div className="text-sm font-semibold text-blue-700 mb-3">
              Filter by Status
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setActiveStatus("all")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  activeStatus === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                <span>All</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {providerAppointments.length}
                </span>
              </button>

              {statusOrder.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveStatus(key)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm ${
                    activeStatus === key
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  <span>{pretty(key)}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeStatus === key
                        ? "bg-white/20"
                        : "bg-blue-200 text-blue-700"
                    }`}
                  >
                    {statusCounts[key]}
                  </span>
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 rounded-lg border border-blue-100 p-3 bg-blue-50">
              <div className="text-xs font-medium text-blue-700 mb-2">
                Status Legend
              </div>
              <ul className="space-y-1 text-xs text-blue-700">
                <li>
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500" />
                  Scheduled
                </li>
                <li>
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                  Completed
                </li>
                <li>
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-rose-500" />
                  Cancelled
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Right content */}
        <section className="rounded-2xl bg-white shadow-md border border-blue-100">
          <div className="flex items-center justify-between p-4 border-b border-blue-100">
            <div className="text-sm font-semibold text-blue-700">Results</div>
            <div className="text-xs text-blue-600">
              {filteredAppointments.length} appointment
              {filteredAppointments.length !== 1 ? "s" : ""}
            </div>
          </div>

          {!startDate || !endDate ? (
            <div className="p-8 text-center text-blue-500">
              Please select a start and end date to generate the report.
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-8 text-center text-blue-500">
              No appointments found in this range.
            </div>
          ) : (
            <div className="overflow-x-auto">
              {Object.entries(groupedAppointments).map(([group, appts]) => (
                <div key={group} className="border-b border-blue-100">
                  <div className="bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                    {group}
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-blue-50 text-blue-600">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Date</th>
                        <th className="px-4 py-3 text-left font-medium">Time</th>
                        <th className="px-4 py-3 text-left font-medium">Patient</th>
                        <th className="px-4 py-3 text-left font-medium">Doctor</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                      {appts.map((appt) => (
                        <tr key={appt.id} className="hover:bg-blue-50">
                          <td className="px-4 py-3">
                            {new Date(appt.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">{appt.time}</td>
                          <td className="px-4 py-3">
                            {getUserName(appt.patient_id)}
                          </td>
                          <td className="px-4 py-3">
                            {getUserName(appt.provider_id)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                appt.status === "completed"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : appt.status === "cancelled"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {pretty(appt.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3">{appt.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ReportStats;