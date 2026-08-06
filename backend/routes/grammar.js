// backend/routes/grammarRoutes.js
const express = require('express')
const router = express.Router()
const grammarController = require('../controllers/grammarController')
const { authMiddleware, adminMiddleware, teacherMiddleware } = require('../middleware/auth')

// Rutas públicas
router.get('/', grammarController.getAll)
router.get('/stats', grammarController.getStats) // Público pero limitado
router.get('/level/:level', grammarController.getByLevel)
router.get('/slug/:slug', grammarController.getBySlug)
router.get('/slug/:slug/questions', grammarController.getQuestions)
router.get('/unit/:level/:unitId', grammarController.getByUnitId)
router.get('/next/:level/:currentUnitId', grammarController.getNextUnit)
router.get('/previous/:level/:currentUnitId', grammarController.getPreviousUnit)

// Rutas protegidas (admin/teacher)
router.post('/', authMiddleware, teacherMiddleware, grammarController.create)
router.put('/:id', authMiddleware, teacherMiddleware, grammarController.update)
router.delete('/:id', authMiddleware, adminMiddleware, grammarController.delete)

module.exports = router