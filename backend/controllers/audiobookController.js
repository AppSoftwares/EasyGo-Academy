// backend/controllers/audiobookController.js
const {
  Audiobook,
  ListeningProgress,
  ModuleContent,
  Progress,
} = require("../models");
const { Op } = require("sequelize");

const audiobookController = {
  // Obtener todos (público)
  getAll: async (req, res) => {
    try {
      const {
        level,
        category,
        search,
        active,
        limit = 50,
        offset = 0,
      } = req.query;
      const where = {};

      if (level && level !== "all") where.level = level;
      if (category && category !== "all") where.category = category;
      if (active !== undefined) where.active = active === "true";

      if (search) {
        where[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { narrator: { [Op.like]: `%${search}%` } },
        ];
      }

      const { count, rows: audiobooks } = await Audiobook.findAndCountAll({
        where,
        order: [
          ["level", "ASC"],
          ["order", "ASC"],
          ["title", "ASC"],
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: { exclude: ["transcript"] },
      });

      res.json({ success: true, audiobooks, total: count });
    } catch (error) {
      console.error("Error al obtener audiolibros:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener audiolibros" });
    }
  },

  // Obtener uno por ID (con transcripción)
  getById: async (req, res) => {
    try {
      const audiobook = await Audiobook.findByPk(req.params.id);
      if (!audiobook) {
        return res
          .status(404)
          .json({ success: false, message: "Audiolibro no encontrado" });
      }
      res.json({ success: true, audiobook });
    } catch (error) {
      console.error("Error al obtener audiolibro:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener audiolibro" });
    }
  },

  // Obtener por nivel
  getByLevel: async (req, res) => {
    try {
      const { level } = req.params;
      const audiobooks = await Audiobook.findAll({
        where: { level, active: true },
        order: [["createdAt", "DESC"]],
      });
      res.json({ success: true, audiobooks });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener audiolibros" });
    }
  },

  // 👇 NUEVO: Obtener progreso de escucha del usuario
  getProgress: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const progress = await ListeningProgress.findOne({
        where: { userId: userId, audiobookId: id },
      });

      res.json({
        success: true,
        progress: progress || { current_time: 0, completed: false },
      });
    } catch (error) {
      console.error("Error getting progress:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener progreso" });
    }
  },

  // 👇 NUEVO: Actualizar progreso de escucha
  updateProgress: async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { currentTime, completed } = req.body;

      let progress = await ListeningProgress.findOne({
        where: { user_id: userId, audiobookId: id },
      });

      if (progress) {
        await progress.update({
          currentTime: currentTime,
          completed: completed || false,
        });
      } else {
        progress = await ListeningProgress.create({
          userId: userId,
          audiobookId: id,
          currentTime: currentTime,
          completed: completed || false,
        });
      }

      if (completed) {
        // Opcional: Aquí podríamos agregar lógica para otorgar puntos o marcar como completado en el progreso general del usuario
        // Por ejemplo, podríamos incrementar el número de audiolibros completados por el usuario
        //completado en progress general del usuario1
        const moduleContent = await ModuleContent.findOne({
          where: { contentId: id, contentType: "audiobook" },
        });

        if (moduleContent) {
          const audiobook = await Audiobook.findByPk(moduleContent.contentId);
          await Progress.create({
            userId: userId,
            level: audiobook.level,
            moduleId: moduleContent.moduleId,
            moduleTitle: `Módulo ${moduleContent.moduleId}`,
            unitId: id,
            unitTitle: audiobook.title,
            unitType: "audiobook",
            completed: true,
            score: 100,
            timeSpent: 0,
            completed_at: new Date(),
            courseType: "curriculum",
          });
        }
      }

      res.json({ success: true, progress });
    } catch (error) {
      console.error("Error updating progress:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar progreso" });
    }
  },

  // Crear (admin/teacher) - CON NOTIFICACIÓN AUTOMÁTICA
  create: async (req, res) => {
    try {
      const data = {
        ...req.body,
        createdBy: req.user?.id || null,
      };

      const audiobook = await Audiobook.create(data);

      // 🔔 NOTIFICACIÓN AUTOMÁTICA - Nuevo audiolibro disponible
      if (notificationHelper) {
        await notificationHelper.notifyNewAudiobook(audiobook);
      }

      res
        .status(201)
        .json({ success: true, message: "Audiolibro creado", audiobook });
    } catch (error) {
      console.error("Error al crear audiolibro:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al crear audiolibro" });
    }
  },

  // Actualizar (admin/teacher)
  update: async (req, res) => {
    try {
      const audiobook = await Audiobook.findByPk(req.params.id);
      if (!audiobook) {
        return res
          .status(404)
          .json({ success: false, message: "Audiolibro no encontrado" });
      }

      const data = { ...req.body, updatedBy: req.user?.id || null };
      await audiobook.update(data);
      res.json({ success: true, message: "Audiolibro actualizado", audiobook });
    } catch (error) {
      console.error("Error al actualizar audiolibro:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar audiolibro" });
    }
  },

  // Eliminar (admin)
  delete: async (req, res) => {
    try {
      const audiobook = await Audiobook.findByPk(req.params.id);
      if (!audiobook) {
        return res
          .status(404)
          .json({ success: false, message: "Audiolibro no encontrado" });
      }
      await audiobook.destroy();
      res.json({ success: true, message: "Audiolibro eliminado" });
    } catch (error) {
      console.error("Error al eliminar audiolibro:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al eliminar audiolibro" });
    }
  },

  // Registrar reproducción
  recordPlay: async (req, res) => {
    try {
      const audiobook = await Audiobook.findByPk(req.params.id);
      if (!audiobook) {
        return res
          .status(404)
          .json({ success: false, message: "Audiolibro no encontrado" });
      }
      await audiobook.increment("plays");
      res.json({ success: true, plays: audiobook.plays + 1 });
    } catch (error) {
      console.error("Error al registrar reproducción:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al registrar reproducción" });
    }
  },

  // Registrar descarga
  recordDownload: async (req, res) => {
    try {
      const audiobook = await Audiobook.findByPk(req.params.id);
      if (!audiobook) {
        return res
          .status(404)
          .json({ success: false, message: "Audiolibro no encontrado" });
      }
      await audiobook.increment("downloads");
      res.json({ success: true, downloads: audiobook.downloads + 1 });
    } catch (error) {
      console.error("Error al registrar descarga:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al registrar descarga" });
    }
  },

  // Estadísticas
  getStats: async (req, res) => {
    try {
      const total = await Audiobook.count();
      const active = await Audiobook.count({ where: { active: true } });
      const totalPlays = (await Audiobook.sum("plays")) || 0;
      const totalDownloads = (await Audiobook.sum("downloads")) || 0;
      const byLevel = {};
      const byCategory = {};

      const levels = ["A1", "A2", "B1", "B2", "C1"];
      const categories = [
        "stories",
        "dialogues",
        "business",
        "daily",
        "news",
        "interviews",
        "academic",
        "other",
      ];

      for (const level of levels) {
        byLevel[level] = await Audiobook.count({
          where: { level, active: true },
        });
      }
      for (const cat of categories) {
        byCategory[cat] = await Audiobook.count({
          where: { category: cat, active: true },
        });
      }

      res.json({
        success: true,
        stats: {
          total,
          active,
          totalPlays,
          totalDownloads,
          byLevel,
          byCategory,
        },
      });
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener estadísticas" });
    }
  },
};

module.exports = audiobookController;
