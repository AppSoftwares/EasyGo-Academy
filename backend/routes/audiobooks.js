// backend/routes/audiobooks.js
const express = require('express')
const router = express.Router()
const audiobookController = require('../controllers/audiobookController')
const { authMiddleware, adminMiddleware, teacherMiddleware } = require('../middleware/auth')

// Rutas públicas (requieren autenticación)
router.get('/', authMiddleware, audiobookController.getAll)
router.get('/stats', authMiddleware, audiobookController.getStats)
router.get('/level/:level', authMiddleware, audiobookController.getByLevel)

// 👇 NUEVA RUTA: Obtener un audiolibro por ID (para la página de detalle)
router.get('/:id', authMiddleware, audiobookController.getById)

// 👇 NUEVA RUTA: Obtener progreso de escucha del usuario
router.get('/:id/progress', authMiddleware, audiobookController.getProgress)

// 👇 NUEVA RUTA: Actualizar progreso de escucha
router.post('/:id/progress', authMiddleware, audiobookController.updateProgress)

// Registrar reproducción y descarga
router.post('/:id/play', authMiddleware, audiobookController.recordPlay)
router.post('/:id/download', authMiddleware, audiobookController.recordDownload)

// Rutas protegidas (admin/teacher)
router.post('/', authMiddleware, teacherMiddleware, audiobookController.create)
router.put('/:id', authMiddleware, teacherMiddleware, audiobookController.update)
router.delete('/:id', authMiddleware, adminMiddleware, audiobookController.delete)

module.exports = router                                                             