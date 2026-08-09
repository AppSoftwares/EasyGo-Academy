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
    console.log("🔄 Sincronizando DB...");
    await syncDatabase();
    await seedRunner();
    isDbSynced = true;
  } catch (error) {
    console.error("❌ Error inicialización:", error.message);
  }
};

// Rutas
app.use("/api/auth", async (req, res, next) => { await ensureDb(); next(); }, authRoutes);
app.use("/api/users", async (req, res, next) => { await ensureDb(); next(); }, userRoutes);
app.use("/api/leads", async (req, res, next) => { await ensureDb(); next(); }, leadRouter);
app.use("/api/progress", async (req, res, next) => { await ensureDb(); next(); }, progressRoutes);
app.use("/api/questions", async (req, res, next) => { await ensureDb(); next(); }, questionRoutes);
app.use("/api/test-progress", async (req, res, next) => { await ensureDb(); next(); }, testProgressRoutes);
app.use("/api/audiobooks", async (req, res, next) => { await ensureDb(); next(); }, audiobookRoutes);
app.use("/api/listening-progress", async (req, res, next) => { await ensureDb(); next(); }, listeningProgressRoutes);
app.use("/api/pronunciations", async (req, res, next) => { await ensureDb(); next(); }, pronunciationRoutes);
app.use("/api/news", async (req, res, next) => { await ensureDb(); next(); }, newsRoutes);
app.use("/api/ranking", async (req, res, next) => { await ensureDb(); next(); }, rankingRoutes);
app.use("/api/dictionary", async (req, res, next) => { await ensureDb(); next(); }, dictionaryRoutes);
app.use("/api/classes", async (req, res, next) => { await ensureDb(); next(); }, classRoutes);
app.use("/api/grammar", async (req, res, next) => { await ensureDb(); next(); }, grammarRoutes);
app.use("/api/notifications", async (req, res, next) => { await ensureDb(); next(); }, notificationRoutes);
app.use("/api/admin", async (req, res, next) => { await ensureDb(); next(); }, adminNotificationRoutes);
app.use("/api/teacher", async (req, res, next) => { await ensureDb(); next(); }, teacherRoutes);
app.use("/api/curriculum", async (req, res, next) => { await ensureDb(); next(); }, curriculumRoutes);
app.use("/api/modules", async (req, res, next) => { await ensureDb(); next(); }, moduleRoutes);
app.use("/api/module-content", async (req, res, next) => { await ensureDb(); next(); }, moduleContentRoutes);
app.use('/api/community', async (req, res, next) => { await ensureDb(); next(); }, communityRoutes)
app.use("/api/ai", async (req, res, next) => { await ensureDb(); next(); }, aiRoutes);

// Ruta de health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "EasyGo Academy API funcionando",
    db: isDbSynced ? "Conectada" : "Sincronizando..."
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
