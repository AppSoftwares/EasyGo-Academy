const jwt = require("jsonwebtoken");
const { User, Session } = require("../models");
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "30d" },
  );
};

const authController = {
  // Registro
  register: async (req, res) => {
    console.log('--- INTENTO DE REGISTRO ---', req.body);
    try {
      const { name, email, password, phone } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Nombre, email y contraseña son requeridos",
        });
      }

      // Verificar email duplicado
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Este email ya está registrado",
        });
      }

      // Crear usuario (el hash se hace en el hook beforeCreate)
      console.log('📝 Creando usuario:', email);
      const user = await User.create({
        name,
        email,
        password,
        phone,
      });
      console.log('✅ Usuario creado ID:', user.id);

      // Generar token
      const token = generateToken(user);

      // Guardar sesión
      await Session.create({
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      });

      res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          needsLevelTest: !user.levelTestCompleted,
        },
      });
    } catch (error) {
      console.error("Error en registro:", error);
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((e) => e.message);
        return res.status(400).json({
          success: false,
          message: messages.join(". "),
        });
      }
      res.status(500).json({
        success: false,
        message: "Error al registrar usuario",
      });
    }
  },

  // Login
  login: async (req, res) => {
    console.log('--- INTENTO DE LOGIN ---', req.body.email);
    try {
      const { email, password } = req.body;
      console.log('Intento de login para:', email);
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son requeridos",
        });
      }

      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      // Verificar contraseña
      const isMatch = await user.validatePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      // Generar token
      const token = generateToken(user);

      // Guardar sesión (capturar la instancia creada)
      const newSession = await Session.create({
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      res.json({
        success: true,
        message: "Inicio de sesión exitoso",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          plan: user.plan,
          levelTestCompleted: user.levelTestCompleted,
          assignedLevel: user.assignedLevel,
          needsLevelTest: !user.levelTestCompleted,
        },
      });
    } catch (error) {
      console.error("❌ Error detallado en login:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  },

  // Obtener perfil
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: require("../models").LevelTest,
            as: "levelTests",
            limit: 1,
            order: [["created_at", "DESC"]],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      res.json({
        success: true,
        user: user.toSafeObject(),
      });
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener perfil",
      });
    }
  },

  // Logout
  logout: async (req, res) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (token) {
        await Session.update({ isActive: false }, { where: { token } });
      }

      res.json({
        success: true,
        message: "Sesión cerrada exitosamente",
      });
    } catch (error) {
      console.error("Error en logout:", error);
      res.status(500).json({
        success: false,
        message: "Error al cerrar sesión",
      });
    }
  },
};

module.exports = authController;
