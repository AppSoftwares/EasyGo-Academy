// backend/routes/moduleContentRoutes.js
const express = require('express')
const router = express.Router()
const moduleContentController = require('../controllers/moduleContentController')
const { authMiddleware, teacherMiddleware } = require('../middleware/auth')

router.use(authMiddleware)
router.use(teacherMiddleware)

// Obtener contenido de un módulo
router.get('/module/:moduleId', moduleContentController.getModuleContent)

// Agregar contenido a un módulo
router.post('/module/:moduleId/add', moduleContentController.addContentToModule)

// Eliminar contenido de un módulo
router.delete('/:id', moduleContentController.removeContentFromModule)

// Reordenar contenido
router.put('/module/:moduleId/reorder', moduleContentController.reorderModuleContent)

// Obtener contenido disponible para agregar
router.get('/module/:moduleId/available/:type', moduleContentController.getAvailableContent)

module.exports = router