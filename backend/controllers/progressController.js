// backend/controllers/progressController.js
const {
  Progress,
  User,
  Content,
  ModuleContent,
  GrammarTopic,
  Audiobook,
  Assignment,
  ListeningProgress,
} = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

// ============ FUNCIÓN AUXILIAR ============
function agruparPorModulosGramatica(progressData) {
  const modulesMap = {};
  progressData.forEach((progress) => {
    const moduleId = progress.moduleId;
    if (!modulesMap[moduleId]) {
      modulesMap[moduleId] = {
        id: moduleId,
        title: progress.module_title || `Módulo ${moduleId}`,
        units: [],
        completedUnits: 0,
        totalUnits: 0,
        score: 0,
      };
    }

    modulesMap[moduleId].units.push({
      id: progress.unit_id,
      title: progress.unit_title,
      type: progress.unit_type,
      completed: progress.completed,
      score: progress.score,
      timeSpent: progress.time_spent,
    });

    modulesMap[moduleId].totalUnits++;
    if (progress.completed) {
      modulesMap[moduleId].completedUnits++;
      modulesMap[moduleId].score += progress.score;
    }
  });

  return Object.values(modulesMap).map((module) => ({
    ...module,
    progress:
      module.totalUnits > 0
        ? Math.round((module.completedUnits / module.totalUnits) * 100)
        : 0,
    score:
      module.completedUnits > 0
        ? Math.round(module.score / module.completedUnits)
        : 0,
    completed: module.completedUnits === module.totalUnits,
  }));
}

const progressController = {
  // Obtener progreso del usuario autenticado
  // backend/controllers/progressController.js - Función getMyProgress completa

  getMyProgress: async (req, res) => {
    try {
      const userId = req.user.id;

      // Obtener TODOS los módulos y lecciones
      const modules = await Content.findAll({
        where: { type: "module", active: true },
        order: [
          ["level", "ASC"],
          ["order_in_module", "ASC"],
        ],
      });

      const lessons = await Content.findAll({
        where: { type: "lesson", active: true },
        order: [
          ["level", "ASC"],
          ["moduleId", "ASC"],
          ["order_in_module", "ASC"],
        ],
      });

      // Obtener progreso del usuario
      const userProgress = await Progress.findAll({
        where: { userId },
      });

      // Agrupar por nivel
      const progress = {};
      const levels = ["A1", "A2", "B1", "B2", "C1"];

      for (const level of levels) {
        const levelModules = modules.filter((m) => m.level === level);
        const levelLessons = lessons.filter((l) => l.level === level);

        progress[level] = {
          curriculum: {
            modules: levelModules.map((module) => {
              const moduleLessons = levelLessons.filter(
                (l) => l.moduleId === module.id,
              );
              const completedLessons = moduleLessons.filter((l) =>
                userProgress.some((p) => p.unitId === l.id && p.completed),
              );

              return {
                id: module.id,
                title: module.title,
                totalUnits: moduleLessons.length,
                completed:
                  completedLessons.length === moduleLessons.length &&
                  moduleLessons.length > 0,
                progress:
                  moduleLessons.length > 0
                    ? Math.round(
                        (completedLessons.length / moduleLessons.length) * 100,
                      )
                    : 0,
                units: moduleLessons.map((lesson) => ({
                  id: lesson.id,
                  title: lesson.title,
                  type: lesson.lesson_type || "lesson",
                  completed: userProgress.some(
                    (p) => p.unitId === lesson.id && p.completed,
                  ),
                  score:
                    userProgress.find((p) => p.unitId === lesson.id)?.score ||
                    0,
                })),
              };
            }),
          },
        };
      }

      res.json({ success: true, progress });
    } catch (error) {
      console.error("Error getting progress:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Actualizar o crear progreso de una unidad
  updateProgress: async (req, res) => {
    try {
      const userId = req.user.id;
      const {
        level,
        moduleId,
        moduleTitle,
        unitId,
        unitTitle,
        unitType,
        completed,
        score,
        timeSpent,
      } = req.body;

      if (!level || !moduleId || !unitId) {
        return res.status(400).json({
          success: false,
          message: "Nivel, módulo y unidad son requeridos",
        });
      }

      // Buscar si ya existe
      let progress = await Progress.findOne({
        where: { user_id: userId, level, moduleId: moduleId, unit_id: unitId },
      });

      if (progress) {
        // Actualizar
        await progress.update({
          completed: completed !== undefined ? completed : progress.completed,
          score: score !== undefined ? score : progress.score,
          time_spent:
            timeSpent !== undefined
              ? progress.time_spent + timeSpent
              : progress.time_spent,
          completed_at: completed ? new Date() : progress.completed_at,
        });
      } else {
        // Crear
        progress = await Progress.create({
          userId: userId,
          level,
          moduleId: moduleId,
          moduleTitle: moduleTitle || `Módulo ${moduleId}`,
          unitId: unitId,
          unitTitle: unitTitle || `Unidad ${unitId}`,
          unitType: unitType || "grammar",
          completed: completed || false,
          score: score || 0,
          time_spent: timeSpent || 0,
          completed_at: completed ? new Date() : null,
          course_type: "grammar",
        });
      }

      res.json({ success: true, progress });
    } catch (error) {
      console.error("Error al actualizar progreso:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar progreso" });
    }
  },

  completeUnit: async (req, res) => {
    try {
      const userId = req.user.id;
      const { unitId } = req.params;
      const { score, timeSpent } = req.body;

      console.log("📊 Completando unidad:", {
        userId,
        unitId,
        score,
        timeSpent,
      });

      let lessonTitle = "";
      let lessonLevel = "A1";
      let lessonModuleId = 0;
      let lessonType = "lesson";
      let isGrammar = false;

      // 1. PRIMERO: Buscar en Content (lecciones del currículo)
      let contentLesson = await Content.findByPk(unitId);

      if (contentLesson) {
        lessonTitle = contentLesson.title;
        lessonLevel = contentLesson.level || "A1";
        lessonModuleId =
          contentLesson.module_id || contentLesson.parent_id || 0;
        lessonType = contentLesson.lesson_type || "lesson";
        isGrammar = false;
        console.log("📖 Lección encontrada en Content:", lessonTitle);
      } else {
        // Si no está en Content, buscar en GrammarTopic
        const grammarTopic = await GrammarTopic.findByPk(unitId);
        if (grammarTopic) {
          lessonTitle = grammarTopic.title;
          lessonLevel = grammarTopic.level || "A1";
          lessonModuleId = grammarTopic.module_id || 0;
          lessonType = "grammar";
          isGrammar = true;
          console.log("📖 Tema de gramática encontrado:", lessonTitle);
        } else {
          return res
            .status(404)
            .json({ success: false, message: "Unidad no encontrada" });
        }
      }

      // 2. Buscar progreso existente - USANDO camelCase (nombres del modelo)
      let progress = await Progress.findOne({
        where: {
          userId: userId, // ✅ camelCase (coincide con el modelo)
          unitId: unitId, // ✅ camelCase (coincide con el modelo)
          courseType: { [Op.or]: ["grammar", "curriculum", null] }, // ✅ camelCase
        },
      });

      if (progress) {
        // Actualizar existente - USANDO camelCase
        await progress.update({
          completed: true,
          score: score || 100,
          timeSpent: (progress.timeSpent || 0) + (timeSpent || 0), // ✅ timeSpent, no time_spent
          completedAt: new Date(), // ✅ completedAt, no completed_at
        });
        console.log("✅ Progreso actualizado");
      } else {
        // Crear nuevo progreso - USANDO camelCase
        progress = await Progress.create({
          userId: userId, // ✅ camelCase
          level: lessonLevel,
          moduleId: lessonModuleId, // ✅ moduleId, no module_id
          moduleTitle: lessonModuleId
            ? `Módulo ${lessonModuleId}`
            : isGrammar
              ? "Gramática"
              : "Currículo A1",
          unitId: unitId, // ✅ unitId, no unit_id
          unitTitle: lessonTitle,
          unitType: lessonType, // ✅ unitType, no unit_type
          completed: true,
          score: score || 100,
          timeSpent: timeSpent || 0, // ✅ timeSpent, no time_spent
          completedAt: new Date(), // ✅ completedAt, no completed_at
          courseType: "curriculum", // ✅ courseType, no course_type
          attempts: 1,
        });
        console.log("✅ Nuevo progreso creado");
      }

      // 3. Buscar si esta unidad está asociada a algún módulo
      const moduleContent = await ModuleContent.findOne({
        where: { contentId: unitId }, // ✅ contentId (camelCase según tu modelo ModuleContent)
      });

      if (moduleContent) {
        // Buscar progreso específico del módulo
        let moduleProgress = await Progress.findOne({
          where: {
            userId: userId,
            unitId: unitId,
            moduleId: moduleContent.moduleId, // ✅ moduleId
            courseType: "curriculum",
          },
        });

        if (moduleProgress) {
          await moduleProgress.update({
            completed: true,
            score: score || 100,
            timeSpent: (moduleProgress.timeSpent || 0) + (timeSpent || 0),
            completedAt: new Date(),
          });
        } else {
          await Progress.create({
            userId: userId,
            level: lessonLevel,
            moduleId: moduleContent.moduleId,
            moduleTitle: `Módulo ${moduleContent.moduleId}`,
            unitId: unitId,
            unitTitle: lessonTitle,
            unitType: lessonType,
            completed: true,
            score: score || 100,
            timeSpent: timeSpent || 0,
            completedAt: new Date(),
            courseType: "curriculum",
            attempts: 1,
          });
        }
        console.log("✅ Progreso de módulo actualizado");
      }

      res.json({ success: true, message: "Unidad completada", progress });
    } catch (error) {
      console.error("Error al completar unidad:", error);
      res.status(500).json({
        success: false,
        message: "Error al completar unidad: " + error.message,
      });
    }
  },
  // Inicializar progreso para un nivel (cuando se asigna un nivel al usuario)
  initLevelProgress: async (req, res) => {
    try {
      const userId = req.user.id;
      const { level } = req.body;

      // Verificar si ya existe progreso para este nivel
      const existingProgress = await Progress.findOne({
        where: { user_id: userId, level },
      });

      /* if (existingProgress) {
        return res.status(400).json({
          success: false,
          message: "El progreso para este nivel ya existe",
        });
      } */

      // Aquí iría la lógica para crear el progreso inicial
      // Por ahora, solo confirmamos que se puede inicializar
      res.status(201).json({
        success: true,
        message: `Progreso inicializado para nivel ${level}`,
      });
    } catch (error) {
      console.error("Error al inicializar progreso:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al inicializar progreso" });
    }
  },

  // Obtener estadísticas generales del usuario
  // backend/controllers/progressController.js - getStats CORREGIDO
  getStats: async (req, res) => {
    try {
      const userId = req.user.id;

      // 1. Obtener TOTAL de unidades por nivel (desde content)
      const contentByLevel = await Content.findAll({
        where: {
          type: "lesson",
          active: true,
        },
        attributes: ["level", "moduleId"],
        group: ["level", "moduleId"],
      });

      const lessonCountByLevel = await Content.findAll({
        attributes: [
          "level",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: {
          type: "lesson",
          active: true,
        },
        group: ["level"],
        raw: true,
      });

      // 2. Obtener progreso del usuario
      const userProgress = await Progress.findAll({
        where: { userId },
        attributes: ["level", "moduleId", "completed", "score", "timeSpent"],
      });

      // 3. Calcular totales por nivel
      const levels = ["A1", "A2", "B1", "B2", "C1"];
      const levelStats = {};
      let totalUnits = 0;
      let completedUnits = 0;
      let totalTime = 0;
      let completedScores = [];

      for (const level of levels) {
        // Total de módulos en este nivel
        const levelModules = contentByLevel.filter((c) => c.level === level);
        const uniqueModules = [...new Set(levelModules.map((m) => m.moduleId))];
        const totalModules = uniqueModules.length;

        // Progreso del usuario en este nivel
        const userLevelProgress = userProgress.filter((p) => p.level === level);
        const completedInLevel = userLevelProgress.filter(
          (p) => p.completed,
        ).length;

        levelStats[level] = {
          total: totalModules,
          completed: completedInLevel,
          progress:
            totalModules > 0
              ? Math.round((completedInLevel / totalModules) * 100)
              : 0,
        };

        totalUnits += totalModules;
        completedUnits += completedInLevel;
      }

      // Calcular totales generales
      const overallProgress =
        totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
      totalTime = userProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);

      const completedProgress = userProgress.filter(
        (p) => p.completed && p.score > 0,
      );
      const avgScore =
        completedProgress.length > 0
          ? Math.round(
              completedProgress.reduce((sum, p) => sum + p.score, 0) /
                completedProgress.length,
            )
          : 0;

      res.json({
        success: true,
        stats: {
          totalUnits,
          totalLessons: lessonCountByLevel,
          completedUnits,
          overallProgress,
          totalTime,
          avgScore,
          levelStats,
        },
      });
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
  // backend/controllers/progressController.js - Agregar getRanking

  // backend/controllers/progressController.js - getRanking CORREGIDO

  // backend/controllers/progressController.js - getRanking CON LOGS

  getRanking: async (req, res) => {
    try {
      console.log("📌 Headers:", req.headers);
      console.log("📌 User:", req.user);

      // Si no hay usuario, devolver error claro
      if (!req.user) {
        console.log("❌ req.user es undefined");
        return res.status(401).json({
          success: false,
          message: "No autenticado",
        });
      }

      const userId = req.user.id;
      console.log("✅ Usuario ID:", userId);

      // ... resto del código
    } catch (error) {
      console.error("❌ Error en getRanking:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};

module.exports = progressController;
