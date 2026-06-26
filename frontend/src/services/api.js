import axios from 'axios';

// Get API base URL from environment or default to local backend port 8080
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token in Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to capture token expiration (401 errors) and force logout
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Exclude login/register pathways
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data; // Returns token, id, username, email, roles
  },
  register: async (username, email, password, firstName, lastName) => {
    const response = await apiClient.post('/auth/register', {
      username,
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get('/student/profile');
    return response.data;
  },
  updateProfile: async (firstName, lastName, email) => {
    const response = await apiClient.put('/student/profile', { firstName, lastName, email });
    return response.data;
  },
  changePassword: async (oldPassword, newPassword) => {
    const response = await apiClient.put('/student/profile/password', { oldPassword, newPassword });
    return response.data;
  },
};

export const courseService = {
  getCourses: async (category = '', search = '') => {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },
  getCourseDetails: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data;
  },
  getCourseModules: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/modules`);
    return response.data;
  },
  getLessons: async (moduleId) => {
    const response = await apiClient.get(`/courses/modules/${moduleId}/lessons`);
    return response.data;
  },
  getLessonDetail: async (lessonId) => {
    const response = await apiClient.get(`/courses/lessons/${lessonId}`);
    return response.data;
  },
  toggleBookmark: async (lessonId) => {
    const response = await apiClient.post(`/courses/lessons/${lessonId}/bookmark`);
    return response.data;
  },
  getBookmarks: async () => {
    const response = await apiClient.get('/courses/bookmarks');
    return response.data;
  },
};

export const progressService = {
  updateProgress: async (lessonId, completed, resumePositionSeconds) => {
    const response = await apiClient.post(`/progress/lessons/${lessonId}`, {
      completed,
      resumePositionSeconds,
    });
    return response.data;
  },
  getLessonProgress: async (lessonId) => {
    const response = await apiClient.get(`/progress/lessons/${lessonId}`);
    return response.data;
  },
  getStudentDashboard: async () => {
    const response = await apiClient.get('/progress/dashboard');
    return response.data;
  },
};

export const certificateService = {
  getMyCertificates: async () => {
    const response = await apiClient.get('/certificates');
    return response.data;
  },
  getOrCreateCertificate: async (courseId) => {
    const response = await apiClient.get(`/certificates/course/${courseId}`);
    return response.data;
  },
  getDownloadUrl: (uuid) => {
    return `${API_BASE_URL}/certificates/download/${uuid}`;
  },
};

export const adminService = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },
  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  toggleUserStatus: async (userId, active) => {
    const response = await apiClient.put(`/admin/users/${userId}/status`, null, {
      params: { active },
    });
    return response.data;
  },
  // Course Management
  createCourse: async (courseData) => {
    const response = await apiClient.post('/admin/courses', courseData);
    return response.data;
  },
  updateCourse: async (courseId, courseData) => {
    const response = await apiClient.put(`/admin/courses/${courseId}`, courseData);
    return response.data;
  },
  deleteCourse: async (courseId) => {
    const response = await apiClient.delete(`/admin/courses/${courseId}`);
    return response.data;
  },
  // Module Management
  createModule: async (moduleData) => {
    const response = await apiClient.post('/admin/modules', moduleData);
    return response.data;
  },
  updateModule: async (moduleId, moduleData) => {
    const response = await apiClient.put(`/admin/modules/${moduleId}`, moduleData);
    return response.data;
  },
  deleteModule: async (moduleId) => {
    const response = await apiClient.delete(`/admin/modules/${moduleId}`);
    return response.data;
  },
  // Lesson Management
  createLesson: async (lessonData) => {
    const response = await apiClient.post('/admin/lessons', lessonData);
    return response.data;
  },
  updateLesson: async (lessonId, lessonData) => {
    const response = await apiClient.put(`/admin/lessons/${lessonId}`, lessonData);
    return response.data;
  },
  deleteLesson: async (lessonId) => {
    const response = await apiClient.delete(`/admin/lessons/${lessonId}`);
    return response.data;
  },
  // Certificate Management
  getCertificates: async () => {
    const response = await apiClient.get('/admin/certificates');
    return response.data;
  },
  regenerateCertificate: async (certificateId) => {
    const response = await apiClient.post(`/admin/certificates/${certificateId}/regenerate`);
    return response.data;
  },
};

export default apiClient;
