const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware, teacherMiddleware } = require('../middleware/auth');

// Rutas de admin
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.post('/', authMiddleware, adminMiddleware, userController.createUser);
router.put('/:id', authMiddleware, adminMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);
router.post('/:id/invalidate-sessions', authMiddleware, adminMiddleware, userController.invalidateSessions);

// Rutas de prueba de nivelación
router.post('/level-test', authMiddleware, userController.saveLevelTest);
router.get('/level-tests', authMiddleware, teacherMiddleware, userController.getLevelTests);
router.put('/level-test/:userId/review', authMiddleware, teacherMiddleware, userController.reviewLevelTest);

module.exports = router;