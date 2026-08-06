const express = require('express')
const router = express.Router()
const controller = require('../controllers/pronunciationController')
const { authMiddleware, teacherMiddleware, adminMiddleware } = require('../middleware/auth')

// Públicas
router.get('/', controller.getAll)
router.get('/stats', controller.getStats)
router.get('/daily-practice', controller.getDailyPractice)
router.get('/:id', controller.getById)
router.post('/:id/practice', authMiddleware, controller.recordPractice)

// Admin/Teacher
router.post('/', authMiddleware, teacherMiddleware, controller.create)
router.put('/:id', authMiddleware, teacherMiddleware, controller.update)
router.delete('/:id', authMiddleware, adminMiddleware, controller.delete)

module.exports = router