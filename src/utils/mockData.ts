// frontend/src/utils/mockData.ts
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export let mockUsers: any[] = [];
export let mockPatients: any[] = [];
export let mockProviders: any[] = [];
export let mockAppointments: any[] = [];
export let mockMedicalRecords: any[] = [];
export let mockHealthMetrics: any[] = [];
export let mockNotifications: any[] = [];
export let mockChats: any[] = [];
export let mockFiles: any[] = [];
export let mockTimeSlots: any[] = [];
export let mockProviderSchedules: any[] = [];

export const mockData = {
  mockUsers,
  mockPatients,
  mockProviders,
  mockAppointments,
  mockMedicalRecords,
  mockHealthMetrics,
  mockNotifications,
  mockChats,
  mockFiles,
  mockTimeSlots,
  mockProviderSchedules,
};

export async function loadMockData() {
  try {
    const [
      u, p, pr, a, m, hm, n, c, f, ts, ps
    ] = await Promise.all([
      axios.get(`${API_BASE}/users`),
      axios.get(`${API_BASE}/patients`),
      axios.get(`${API_BASE}/providers`),
      axios.get(`${API_BASE}/appointments`),
      axios.get(`${API_BASE}/medical-records`),
      axios.get(`${API_BASE}/health-metrics`),
      axios.get(`${API_BASE}/notifications`),
      axios.get(`${API_BASE}/chat-messages`),
      axios.get(`${API_BASE}/file-attachments`),
      axios.get(`${API_BASE}/timeslots`),
      axios.get(`${API_BASE}/provider-schedules`),
    ]);

    mockData.mockUsers = mockUsers = u.data;
    mockData.mockPatients = mockPatients = p.data;
    mockData.mockProviders = mockProviders = pr.data;
    mockData.mockAppointments = mockAppointments = a.data;
    mockData.mockMedicalRecords = mockMedicalRecords = m.data;
    mockData.mockHealthMetrics = mockHealthMetrics = hm.data;
    mockData.mockNotifications = mockNotifications = n.data;
    mockData.mockChats = mockChats = c.data;
    mockData.mockFiles = mockFiles = f.data;
    mockData.mockTimeSlots = mockTimeSlots = ts.data;
    mockData.mockProviderSchedules = mockProviderSchedules = ps.data;

    console.log("✅ Mock data loaded from backend");
    console.log(mockData.mockUsers)
  } catch (err) {
    console.error("❌ Error loading mock data:", err);
  }
}

// Load immediately
await loadMockData();
