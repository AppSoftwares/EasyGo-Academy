const express = require('express')
const router = express.Router()
const controller = require('../controllers/classController')
const { authMiddleware, teacherMiddleware, adminMiddleware } = require('../middleware/auth')

// Públicas (con auth opcional para ver estado de inscripción)
router.get('/upcoming', authMiddleware, controller.getUpcoming)

// Usuario autenticado
router.get('/my-classes', authMiddleware, controller.getMyClasses)
router.post('/:classId/enroll', authMiddleware, controller.enroll)
router.delete('/:classId/unenroll', authMiddleware, controller.unenroll)

// Admin/Teacher
router.get('/', authMiddleware, teacherMiddleware, controller.getAll)
router.post('/', authMiddleware, teacherMiddleware, controller.create)
router.put('/:id', authMiddleware, teacherMiddleware, controller.update)
router.delete('/:id', authMiddleware, adminMiddleware, controller.delete)

module.exports = router