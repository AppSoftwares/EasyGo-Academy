// src/services/notificationService.js
import api from "./api";

export const notificationService = {
  // Obtener mis notificaciones
  getMyNotifications: () => api.get("/notifications/my"),

  // Marcar una notificación como leída
  markAsRead: (id) => api.put(`/notifications/${id}/read`),

  // Marcar todas como leídas
  markAllAsRead: () => api.put("/notifications/read-all"),

  // Obtener estadísticas de notificaciones
  getStats: () => api.get("/notifications/stats"),

  getAdminNotifications: () => api.get("/admin/notifications"),

  // Marcar como leída
  markAsRead: (id) => api.put(`/admin/notifications/${id}/read`),

  // Marcar todas como leídas
  markAllAsRead: () => api.put("/admin/notifications/read-all"),

  // Obtener contador de no leídas
  getUnreadCount: () => api.get("/admin/notifications/unread-count"),
};
