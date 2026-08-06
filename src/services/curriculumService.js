// src/services/curriculumService.js
import api from "./api";

export const curriculumService = {
  // Ver módulos por nivel
  getModules: (level) => api.get(`/curriculum/modules/${level}`),

  // Ver progreso del alumno
  getMyProgress: () => api.get("/curriculum/progress"),

  // Completar lección
  completeLesson: (lessonId, data) =>
    api.post(`/curriculum/lesson/${lessonId}/complete`, data),

  // Obtener una lección
  getLesson: (id) => api.get(`/curriculum/lesson/${id}`),

  // Crear lección (profesor)
  createLesson: (data) => api.post("/curriculum/lesson", data),

  // Actualizar lección (profesor)
  updateLesson: (id, data) => api.put(`/curriculum/lesson/${id}`, data),

  // Eliminar lección (profesor)
  deleteLesson: (id) => api.delete(`/curriculum/lesson/${id}`),

  // Estadísticas del profesor
  getTeacherStats: () => api.get("/curriculum/teacher/stats"),

};
