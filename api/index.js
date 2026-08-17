const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Ajustar rutas relativas ya que el archivo se movió a /api
const { sequelize, syncDatabase } = require("../backend/models");
const authRoutes = require("../backend/routes/auth");
const userRoutes = require("../backend/routes/users");
const leadRouter = require("../backend/routes/leads");
const progressRoutes = require("../backend/routes/progress");
const questionRoutes = require("../backend/routes/questions");
const testProgressRoutes = require("../backend/routes/testProgress");
const audiobookRoutes = require("../backend/routes/audiobooks");
const listeningProgressRoutes = require("../backend/routes/listeningProgress");
const pronunciationRoutes = require("../backend/routes/pronunciations");
const newsRoutes = require("../backend/routes/news");
const rankingRoutes = require("../backend/routes/ranking");
const dictionaryRoutes = require("../backend/routes/dictionary");
const classRoutes = require("../backend/routes/classes");
const grammarRoutes = require("../backend/routes/grammar");
const notificationRoutes = require("../backend/routes/notificationRoutes");
const adminNotificationRoutes = require("../backend/routes/adminNotificationRoutes");
const teacherRoutes = require("../backend/routes/teacherRoutes");
const curriculumRoutes = require("../backend/routes/curriculumRoutes");
const moduleRoutes = require("../backend/routes/moduleRoutes");
const moduleContentRoutes = require("../backend/routes/moduleContentRoutes");
const communityRoutes = require('../backend/routes/communityRoutes')
const curriculumV2Routes = require("../backend/routes/curriculum");
const aiRoutes = require("../backend/routes/ai");

const seedRunner = require("../backend/config/seedRunner");
const { authMiddleware, adminMiddleware } = require("../backend/middleware/auth");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const DEFAULT_ORIGINS = [
  'capacitor://localhost', // iOS
  'ionic://localhost',     // iOS legacy WebView
  'https://localhost',     // Android (androidScheme: "https")
  'http://localhost',
  'http://localhost:3000',
];
const allowedOrigins = [
  ...DEFAULT_ORIGINS,
  ...(process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    console.warn('⛔ Origin bloqueado por CORS:', origin);
    return cb(new Error('Origin no permitido por CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Inicialización de DB para Serverless (Vercel)
let isDbSynced = false;
const ensureDb = async () => {
  if (isDbSynced) return;
  try {
    // Solo autenticar para rapidez
    await sequelize.authenticate();
    isDbSynced = true;
    console.log("✅ DB conectada");

    // Sincronizar en segundo plano si estamos en producción (Vercel)
    // Esto crea las tablas si no existen sin bloquear el registro del usuario
    syncDatabase().then(() => {
      seedRunner().catch(e => console.error("❌ Error seeds:", e.message));
    }).catch(err => console.error("❌ Error sync:", err.message));

  } catch (error) {
    console.error("❌ Error conexión DB:", error.message);
  }
};

// Rutas con inicialización rápida
const initDbMiddleware = async (req, res, next) => {
  await ensureDb();
  next();
};

app.use("/api/auth", initDbMiddleware, authRoutes);
app.use("/api/users", initDbMiddleware, userRoutes);
app.use("/api/leads", initDbMiddleware, leadRouter);
app.use("/api/progress", initDbMiddleware, progressRoutes);
app.use("/api/questions", initDbMiddleware, questionRoutes);
app.use("/api/test-progress", initDbMiddleware, testProgressRoutes);
app.use("/api/audiobooks", initDbMiddleware, audiobookRoutes);
app.use("/api/listening-progress", initDbMiddleware, listeningProgressRoutes);
app.use("/api/pronunciations", initDbMiddleware, pronunciationRoutes);
app.use("/api/news", initDbMiddleware, newsRoutes);
app.use("/api/ranking", initDbMiddleware, rankingRoutes);
app.use("/api/dictionary", initDbMiddleware, dictionaryRoutes);
app.use("/api/classes", initDbMiddleware, classRoutes);
app.use("/api/grammar", initDbMiddleware, grammarRoutes);
app.use("/api/notifications", initDbMiddleware, notificationRoutes);
app.use("/api/admin", initDbMiddleware, adminNotificationRoutes);
app.use("/api/teacher", initDbMiddleware, teacherRoutes);
app.use("/api/curriculum", initDbMiddleware, curriculumRoutes);
app.use("/api/v2/curriculum", initDbMiddleware, curriculumV2Routes);
app.use("/api/modules", initDbMiddleware, moduleRoutes);
app.use("/api/module-content", initDbMiddleware, moduleContentRoutes);
app.use('/api/community', initDbMiddleware, communityRoutes)
app.use("/api/ai", initDbMiddleware, aiRoutes);

// Ruta especial para sincronizar base de datos manualmente si es necesario
app.get("/api/admin/db-sync", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await syncDatabase();
    await seedRunner();
    res.json({ success: true, message: "Base de datos sincronizada y sembrada" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta de health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "EasyGo Academy API activa",
    db: isDbSynced ? "Conectada" : "Pendiente de primer uso"
  });
});

// Iniciar servidor local si no es producción
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor local en http://localhost:${PORT}`);
    ensureDb();
  });
}

module.exports = app;
