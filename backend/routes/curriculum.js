const express = require('express');
const router = express.Router();
const curriculumController = require('../controllers/curriculumController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Rutas públicas/alumnos
router.get('/levels', authMiddleware, curriculumController.getAllLevels);
router.get('/units/:unitId', authMiddleware, curriculumController.getUnitContent);

// Rutas administrativas
router.post('/sync-unit', authMiddleware, adminMiddleware, curriculumController.syncUnitFromJson);

module.exports = router;
