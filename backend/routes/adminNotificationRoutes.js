// backend/routes/adminNotificationRoutes.js
const express = require('express')
const router = express.Router()
const adminNotificationController = require('../controllers/adminNotificationController')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

// Todas las rutas requieren autenticación y rol admin
router.get('/notifications', authMiddleware, adminMiddleware, adminNotificationController.getNotifications)
router.put('/notifications/:id/read', authMiddleware, adminMiddleware, adminNotificationController.markAsRead)
router.put('/notifications/read-all', authMiddleware, adminMiddleware, adminNotificationController.markAllAsRead)
router.get('/notifications/unread-count', authMiddleware, adminMiddleware, adminNotificationController.getUnreadCount)

module.exports = router