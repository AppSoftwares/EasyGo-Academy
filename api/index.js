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
const aiRoutes = require("../backend/routes/ai");

const seedRunner = require("../backend/config/seedRunner");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Inicialización de DB para Serverless (Vercel)
let isDbSynced = false;
const ensureDb = async () => {
  if (isDbSynced) return;
  try {
    console.log("🔄 Iniciando sincronización de DB en Vercel...");
    await syncDatabase();
    await seedRunner();
    isDbSynced = true;
    console.log("✅ DB sincronizada con éxito");
  } catch (error) {
    console.error("❌ Error sincronizando DB:", error.message);
  }
};

// Middleware para asegurar DB en cada petición de API
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    await ensureDb();
  }
  next();
});

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
    message: "EasyGo Academy API funcionando correctamente en /api",
    isServerless: true
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
