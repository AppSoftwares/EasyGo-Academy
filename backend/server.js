const express = require("express");
const cors = require("cors");
const leadRouter = require("./routes/leads");
const { sequelize } = require("./models");
require("dotenv").config();

const { syncDatabase } = require("./models");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const progressRoutes = require("./routes/progress");
const questionRoutes = require("./routes/questions");
const testProgressRoutes = require("./routes/testProgress");
const audiobookRoutes = require("./routes/audiobooks");
const listeningProgressRoutes = require("./routes/listeningProgress");
const pronunciationRoutes = require("./routes/pronunciations");
const newsRoutes = require("./routes/news");
const rankingRoutes = require("./routes/ranking");
const dictionaryRoutes = require("./routes/dictionary");
const classRoutes = require("./routes/classes");
const grammarRoutes = require("./routes/grammar");
const notificationRoutes = require("./routes/notificationRoutes");
const adminNotificationRoutes = require("./routes/adminNotificationRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const curriculumRoutes = require("./routes/curriculumRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const moduleContentRoutes = require("./routes/moduleContentRoutes");
const communityRoutes = require('./routes/communityRoutes')
const aiRoutes = require("./routes/ai");

const seedRunner = require("./config/seedRunner");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').filter(Boolean) : '*',
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos, intenta más tarde' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 messages per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Límite de mensajes de IA excedido, intenta más tarde' },
});
app.use('/api/ai', aiLimiter);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leads", leadRouter);
app.use("/api/progress", progressRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/test-progress", testProgressRoutes);
app.use("/api/audiobooks", audiobookRoutes);
app.use("/api/listening-progress", listeningProgressRoutes);
app.use("/api/pronunciations", pronunciationRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/dictionary", dictionaryRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/grammar", grammarRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminNotificationRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/module-content", moduleContentRoutes);
app.use('/api/community', communityRoutes)
app.use("/api/ai", aiRoutes);

// Ruta de health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "EasyGo Academy API funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Error interno del servidor",
  });
});

// Iniciar servidor
if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      // Sincronizar base de datos
      await syncDatabase();

      // Iniciar el servidor antes de los seeds para que responda rápido
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📚 API Base: http://localhost:${PORT}/api`);
        console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
      });

      // Ejecutar seeds en segundo plano
      seedRunner().then(async () => {
        // Verificar usuarios cargados
        const { User } = require("./models");
        const users = await User.findAll({ attributes: ['email', 'role'] });
        console.log('👥 Usuarios en DB:', users.map(u => `${u.email} (${u.role})`));
      }).catch(err => {
        console.error('❌ Error en seedRunner:', err.message);
      });

    } catch (error) {
      console.error("❌ Error al iniciar el servidor:", error.message);
      process.exit(1);
    }
  };

  startServer();
}

module.exports = app;
