export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  checkInTime: string;
  checkOutTime: string | null;
  workDate: string;
}

export interface AttendanceStatistics {
  dailyStats: Array<{
    date: string;
    workHours: number;
  }>;
  totalHours: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message ?? '通信に失敗しました');
  }
  return payload as T;
}

export async function login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(token: string): Promise<{ message: string }> {
  return request('/api/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchTasks(token: string): Promise<{ tasks: TaskItem[] }> {
  return request('/api/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createTask(
  token: string,
  input: { title: string; description?: string | null; dueDate?: string | null },
): Promise<TaskItem> {
  return request('/api/tasks', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
}

export async function updateTask(
  token: string,
  id: string,
  input: Partial<Pick<TaskItem, 'title' | 'description' | 'dueDate' | 'status'>>,
): Promise<TaskItem> {
  return request(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
}

export async function deleteTask(token: string, id: string): Promise<void> {
  await request(`/api/tasks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchAttendance(
  token: string,
  startDate: string,
  endDate: string,
): Promise<{ records: AttendanceRecord[] }> {
  return request(`/api/attendance?startDate=${startDate}&endDate=${endDate}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchAttendanceStatistics(
  token: string,
  startDate: string,
  endDate: string,
): Promise<AttendanceStatistics> {
  return request(`/api/attendance/statistics?startDate=${startDate}&endDate=${endDate}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}