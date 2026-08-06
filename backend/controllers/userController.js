const { User, LevelTest, Session } = require('../models');
const { Op } = require('sequelize');

const userController = {
  // Invalidar todas las sesiones de un usuario
  invalidateSessions: async (req, res) => {
    try {
      const { id } = req.params;
      const adminId = req.user.id;

      console.log(`[AUDIT] KillSwitch activado por ${adminId} contra usuario ${id} a las ${new Date().toISOString()}`);

      await Session.update(
        { isActive: false },
        { where: { userId: id } }
      );

      res.json({
        success: true,
        message: 'Sesiones del usuario invalidadas exitosamente'
      });
    } catch (error) {
      console.error('Error al invalidar sesiones:', error);
      res.status(500).json({
        success: false,
        message: 'Error al invalidar sesiones'
      });
    }
  },

  // Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    try {
      const { search, role, plan, active, limit = 50, offset = 0 } = req.query;
      
      const where = {};
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }
      
      if (role) where.role = role;
      if (plan) where.plan = plan;
      if (active !== undefined) where.active = active === 'true';

      const { count, rows: users } = await User.findAndCountAll({
        where,
        attributes: { exclude: ['password'] },
        include: [{
          model: LevelTest,
          as: 'levelTests',
          limit: 1,
          order: [['created_at', 'DESC']],
          attributes: ['id', 'percentage', 'recommendedLevel', 'completed', 'reviewed']
        }],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        users,
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios'
      });
    }
  },

  // Obtener un usuario por ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: LevelTest,
          as: 'levelTests',
          order: [['created_at', 'DESC']]
        }]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuario'
      });
    }
  },

  // Crear usuario (admin)
  createUser: async (req, res) => {
    try {
      const { name, email, password, phone, role, plan } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Nombre, email y contraseña son requeridos'
        });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Este email ya está registrado'
        });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'user',
        plan: plan || 'basic'
      });

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        user: user.toSafeObject()
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(e => e.message);
        return res.status(400).json({
          success: false,
          message: messages.join('. ')
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error al crear usuario'
      });
    }
  },

  // Actualizar usuario
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, phone, role, active, plan, password } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      const updateData = { name, email, phone, role, active, plan };
      if (password) updateData.password = password;

      await user.update(updateData);

      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        user: user.toSafeObject()
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar usuario'
      });
    }
  },

  // Eliminar usuario
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      await user.destroy();

      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar usuario'
      });
    }
  },

  // Guardar prueba de nivelación
  saveLevelTest: async (req, res) => {
    try {
      const userId = req.user.id;
      const { totalPoints, earnedPoints, percentage, recommendedLevel, categoryScores, answers, skipped } = req.body;

      // Crear prueba
      const levelTest = await LevelTest.create({
        userId,
        totalPoints,
        earnedPoints,
        percentage,
        recommendedLevel,
        categoryScores,
        answers,
        completed: true,
        skipped: skipped || false
      });

      // Actualizar usuario
      await User.update(
        {
          levelTestCompleted: true,
          levelTestResult: req.body,
          assignedLevel: recommendedLevel
        },
        { where: { id: userId } }
      );

      res.status(201).json({
        success: true,
        message: 'Prueba de nivelación guardada exitosamente',
        levelTest
      });
    } catch (error) {
      console.error('Error al guardar prueba:', error);
      res.status(500).json({
        success: false,
        message: 'Error al guardar prueba de nivelación'
      });
    }
  },

  // Obtener pruebas de nivelación
  getLevelTests: async (req, res) => {
    try {
      const { reviewed } = req.query;
      const where = {};
      
      if (reviewed !== undefined) {
        where.reviewed = reviewed === 'true';
      }

      const tests = await LevelTest.findAll({
        where,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }],
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        tests
      });
    } catch (error) {
      console.error('Error al obtener pruebas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener pruebas de nivelación'
      });
    }
  },

  // Revisar prueba y asignar nivel
  reviewLevelTest: async (req, res) => {
    try {
      const { userId } = req.params;
      const { finalLevel, notes } = req.body;

      // Actualizar prueba
      await LevelTest.update(
        {
          reviewed: true,
          reviewedBy: req.user.name,
          reviewedDate: new Date(),
          reviewNotes: notes,
          finalLevel
        },
        { where: { userId, completed: true } }
      );

      // Actualizar usuario
      await User.update(
        {
          levelTestReviewed: true,
          finalAssignedLevel: finalLevel,
          reviewedBy: req.user.name,
          reviewedDate: new Date(),
          reviewNotes: notes
        },
        { where: { id: userId } }
      );

      res.json({
        success: true,
        message: `Nivel ${finalLevel} asignado exitosamente al usuario`
      });
    } catch (error) {
      console.error('Error al revisar prueba:', error);
      res.status(500).json({
        success: false,
        message: 'Error al revisar prueba de nivelación'
      });
    }
  },

  // Estadísticas del dashboard
  getStats: async (req, res) => {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { active: true } });
      const premiumUsers = await User.count({ where: { plan: 'premium' } });
      const pendingTests = await LevelTest.count({ where: { completed: true, reviewed: false } });
      const completedTests = await LevelTest.count({ where: { completed: true } });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newToday = await User.count({
        where: {
          created_at: {
            [Op.gte]: today
          }
        }
      });

      res.json({
        success: true,
        stats: {
          totalUsers,
          activeUsers,
          premiumUsers,
          pendingTests,
          completedTests,
          newToday
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas'
      });
    }
  }
};

module.exports = userController;