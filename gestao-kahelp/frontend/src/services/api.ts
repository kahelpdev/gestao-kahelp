import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { name: string; email: string; password: string; organizationName: string }) =>
    api.post('/auth/register', data),
  profile: () => api.get('/auth/profile'),
};

// Users
export const usersApi = {
  list: () => api.get('/users'),
  get: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  remove: (id: string) => api.delete(`/users/${id}`),
};

// Organizations
export const orgsApi = {
  me: () => api.get('/organizations/me'),
  update: (data: any) => api.patch('/organizations/me', data),
};

// Teams
export const teamsApi = {
  list: () => api.get('/teams'),
  get: (id: string) => api.get(`/teams/${id}`),
  create: (data: any) => api.post('/teams', data),
  update: (id: string, data: any) => api.patch(`/teams/${id}`, data),
  addMember: (teamId: string, data: any) => api.post(`/teams/${teamId}/members`, data),
  removeMember: (teamId: string, userId: string) => api.delete(`/teams/${teamId}/members/${userId}`),
  remove: (id: string) => api.delete(`/teams/${id}`),
};

// Projects
export const projectsApi = {
  list: () => api.get('/projects'),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.patch(`/projects/${id}`, data),
  remove: (id: string) => api.delete(`/projects/${id}`),
};

// Sprints
export const sprintsApi = {
  list: (teamId?: string) => api.get('/sprints', { params: { teamId } }),
  get: (id: string) => api.get(`/sprints/${id}`),
  create: (data: any) => api.post('/sprints', data),
  update: (id: string, data: any) => api.patch(`/sprints/${id}`, data),
  activate: (id: string) => api.post(`/sprints/${id}/activate`),
  archive: (id: string) => api.post(`/sprints/${id}/archive`),
  remove: (id: string) => api.delete(`/sprints/${id}`),
};

// Tasks
export const tasksApi = {
  list: (params?: any) => api.get('/tasks', { params }),
  get: (id: string) => api.get(`/tasks/${id}`),
  create: (data: any) => api.post('/tasks', data),
  update: (id: string, data: any) => api.patch(`/tasks/${id}`, data),
  assignToSprint: (taskId: string, sprintId: string) =>
    api.post(`/tasks/${taskId}/assign-sprint/${sprintId}`),
  removeFromSprint: (taskId: string) => api.post(`/tasks/${taskId}/remove-sprint`),
  remove: (id: string) => api.delete(`/tasks/${id}`),
};

// Dashboard
export const dashboardApi = {
  monitor: (params?: any) => api.get('/dashboard/monitor', { params }),
  sprintSummary: () => api.get('/dashboard/sprint-summary'),
};

// History
export const historyApi = {
  allocation: (params?: any) => api.get('/history/allocation', { params }),
  sprints: () => api.get('/history/sprints'),
};

// Flow Sync
export const flowSyncApi = {
  import: (data: any) => api.post('/flow-sync/import', data),
  status: () => api.get('/flow-sync/status'),
};

export default api;
