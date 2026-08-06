// backend/routes/curriculumRoutes.js
const express = require('express')
const router = express.Router()
const curriculumController = require('../controllers/curriculumController')
const { authMiddleware, teacherMiddleware } = require('../middleware/auth')

router.use(authMiddleware)

// Alumnos
router.get('/modules/:level', curriculumController.getModules)
router.get('/lesson/:id', curriculumController.getLesson)
router.post('/lesson/:lessonId/complete', curriculumController.completeLesson)
router.get('/progress', curriculumController.getMyProgress)

// Profesores
router.post('/lesson', teacherMiddleware, curriculumController.createLesson)

router.put('/lesson/:id', teacherMiddleware, curriculumController.updateLesson)  // ← Agregar esta línea
router.delete('/lesson/:id', teacherMiddleware, curriculumController.deleteLesson) // ← También falta DELETE

module.exports = router