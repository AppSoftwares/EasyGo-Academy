// backend/routes/teacherRoutes.js
const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teacherController')
const { authMiddleware, teacherMiddleware } = require('../middleware/auth')

// Todas las rutas requieren autenticación y rol de teacher
router.use(authMiddleware)
router.use(teacherMiddleware)

// Dashboard
router.get('/stats', teacherController.getStats)

// Clases
router.get('/classes', teacherController.getMyClasses)
router.get('/classes/:id', teacherController.getClass)
router.post('/classes', teacherController.createClass)
router.put('/classes/:id', teacherController.updateClass)
router.delete('/classes/:id', teacherController.deleteClass)
router.get('/classes/:id/enrollments', teacherController.getClassEnrollments)
router.post('/classes/:id/attendance', teacherController.markAttendance)
router.post('/classes/:id/reminder', teacherController.sendClassReminder)

// Alumnos
router.get('/students', teacherController.getMyStudents)
router.get('/students/:id', teacherController.getStudent)
router.get('/students/:id/progress', teacherController.getStudentProgress)
router.get('/students/:id/assignments', teacherController.getStudentAssignments)
router.post('/students/:id/message', teacherController.sendMessageToStudent)

// Progreso
router.get('/progress', teacherController.getProgressOverview)

// Tareas
router.get('/assignments', teacherController.getAssignments)
router.get('/assignments/:id', teacherController.getAssignment)
router.post('/assignments', teacherController.createAssignment)
router.put('/assignments/:id', teacherController.updateAssignment)
router.delete('/assignments/:id', teacherController.deleteAssignment)
router.post('/assignments/:assignmentId/grade', teacherController.gradeAssignment)
router.get('/assignments/pending', teacherController.getPendingAssignments)

// Contenido
router.get('/content', teacherController.getContent)
router.post('/content', teacherController.createContent)
router.put('/content/:id', teacherController.updateContent)
router.delete('/content/:id', teacherController.deleteContent)

// Mensajes
router.get('/messages', teacherController.getMessages)
router.get('/messages/:studentId', teacherController.getConversation)
router.post('/messages', teacherController.sendMessage)
router.put('/messages/:messageId/read', teacherController.markMessageAsRead)

// Perfil
router.get('/profile', teacherController.getProfile)
router.put('/profile', teacherController.updateProfile)
router.put('/profile/password', teacherController.changePassword)
router.get('/schedule', teacherController.getSchedule)
router.put('/schedule', teacherController.updateSchedule)

module.exports = router