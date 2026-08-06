const express = require('express')
const router = express.Router()
const controller = require('../controllers/dictionaryController')

// Verificar que el controlador se cargó
console.log('✅ Dictionary controller cargado:', Object.keys(controller))

// Buscar palabra (principal)
router.get('/search/:word', controller.searchWord)

// Estadísticas
router.get('/stats', controller.getStats)

module.exports = router