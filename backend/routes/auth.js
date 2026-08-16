const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos, intenta más tarde' }
});

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Rutas públicas
router.post('/register', authLimiter, [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('name').notEmpty().withMessage('El nombre es requerido'),
  validate
], authController.register);

router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  validate
], authController.login);

router.post('/forgot-password', authLimiter, [
  body('email').isEmail().withMessage('Email inválido'),
  validate
], authController.forgotPassword);

router.post('/google', authLimiter, authController.googleLogin);
router.post('/apple', authLimiter, authController.appleLogin);

// Rutas protegidas
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/logout', authMiddleware, authController.logout);

router.put('/change-password', [
  authMiddleware,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  validate
], authController.changePassword);

router.put('/change-email', [
  authMiddleware,
  body('newEmail').isEmail(),
  validate
], authController.changeEmail);

router.get('/sessions', authMiddleware, authController.getSessions);
router.delete('/sessions/:sessionId', authMiddleware, authController.deleteSession);

module.exports = router;
