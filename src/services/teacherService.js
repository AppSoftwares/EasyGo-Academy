// src/services/teacherService.js
import api from './api'

export const teacherService = {
  // Dashboard
  getStats: () => api.get('/teacher/stats'),
  
  // Clases
  getMyClasses: () => api.get('/teacher/classes'),
  getClass: (id) => api.get(`/teacher/classes/${id}`),
  createClass: (data) => api.post('/teacher/classes', data),
  updateClass: (id, data) => api.put(`/teacher/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/teacher/classes/${id}`),
  getClassEnrollments: (id) => api.get(`/teacher/classes/${id}/enrollments`),
  markAttendance: (classId, studentId, attended) => api.post(`/teacher/classes/${classId}/attendance`, { studentId, attended }),
  sendClassReminder: (id) => api.post(`/teacher/classes/${id}/reminder`),
  
  // Alumnos
  getMyStudents: () => api.get('/teacher/students'),
  getStudent: (id) => api.get(`/teacher/students/${id}`),
  getStudentProgress: (id) => api.get(`/teacher/students/${id}/progress`),
  getStudentAssignments: (id) => api.get(`/teacher/students/${id}/assignments`),
  sendMessageToStudent: (studentId, message) => api.post(`/teacher/students/${studentId}/message`, { message }),
  
  // Progreso
  getProgressOverview: (period = 'month') => api.get(`/teacher/progress?period=${period}`),
  
  // Tareas
  getAssignments: () => api.get('/teacher/assignments'),
  getAssignment: (id) => api.get(`/teacher/assignments/${id}`),
  createAssignment: (data) => api.post('/teacher/assignments', data),
  updateAssignment: (id, data) => api.put(`/teacher/assignments/${id}`, data),
  deleteAssignment: (id) => api.delete(`/teacher/assignments/${id}`),
  gradeAssignment: (assignmentId, studentId, grade, feedback) => api.post(`/teacher/assignments/${assignmentId}/grade`, { studentId, grade, feedback }),
  getPendingAssignments: () => api.get('/teacher/assignments/pending'),
  
  // Contenido
  getContent: () => api.get('/teacher/content'),
  createContent: (data) => api.post('/teacher/content', data),
  updateContent: (id, data) => api.put(`/teacher/content/${id}`, data),
  deleteContent: (id) => api.delete(`/teacher/content/${id}`),
  
  // Mensajes
  getMessages: () => api.get('/teacher/messages'),
  getConversation: (studentId) => api.get(`/teacher/messages/${studentId}`),
  sendMessage: (studentId, message) => api.post('/teacher/messages', { studentId, message }),
  markMessageAsRead: (messageId) => api.put(`/teacher/messages/${messageId}/read`),
  
  // Perfil
  getProfile: () => api.get('/teacher/profile'),
  updateProfile: (data) => api.put('/teacher/profile', data),
  changePassword: (data) => api.put('/teacher/profile/password', data),
  getSchedule: () => api.get('/teacher/schedule'),
  updateSchedule: (data) => api.put('/teacher/schedule', data),
  
  // Notificaciones (opcional)
  getTeacherNotifications: () => api.get('/teacher/notifications'),
  markNotificationAsRead: (id) => api.put(`/teacher/notifications/${id}/read`),
}