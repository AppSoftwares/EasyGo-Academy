// backend/routes/notificationRoutes.js
const express = require('express')
const router = express.Router()
const notificationController = require('../controllers/notificationController')
const { authMiddleware, adminMiddleware, teacherMiddleware } = require('../middleware/auth')

// Rutas protegidas para usuarios
router.get('/my', authMiddleware, notificationController.getMyNotifications)
router.put('/:id/read', authMiddleware, notificationController.markAsRead)
router.put('/read-all', authMiddleware, notificationController.markAllAsRead)

// Rutas de administración
/* router.get('/admin', authMiddleware, adminMiddleware, notificationController.getAll)
router.post('/admin', authMiddleware, adminMiddleware, notificationController.create)
router.delete('/admin/:id', authMiddleware, adminMiddleware, notificationController.delete) */

module.exports = router