// backend/controllers/curriculumController.js
const { Content, Progress, ModuleContent } = require("../models");
const { Op } = require("sequelize");

const curriculumController = {
  // Obtener módulos del curso
  getModules: async (req, res) => {
    try {
      const { level } = req.params;

      // Obtener todos los contenidos del curso (type = 'lesson')
      console.log("Obteniendo lecciones para level:", level);
      const lessons = await Content.findAll({
        where: {
          level: level,
          type: "lesson",
          moduleId: { [Op.ne]: null },
          active: true,
        },
        order: [
          ["moduleId", "ASC"],
          ["order_in_module", "ASC"],
        ],
      });
      console.log(lessons, "AAAAAA");
      // Agrupar por módulo
      const modulesMap = {};
      lessons.forEach((lesson) => {
        if (!modulesMap[lesson.moduleId]) {
          modulesMap[lesson.moduleId] = {
            moduleId: lesson.moduleId,
            title: `Módulo ${lesson.moduleId}`,
            lessons: [],
          };
        }
        modulesMap[lesson.moduleId].lessons.push({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          type: lesson.lesson_type,
          order: lesson.order_in_module,
          questions: lesson.questions,
        });
      });

      const modules = Object.values(modulesMap);

      res.json({ success: true, modules });
    } catch (error) {
      console.error("Error getting modules:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener módulos" });
    }
  },

  // Obtener una lección por ID
  getLesson: async (req, res) => {
    try {
      const { id } = req.params;
      const lesson = await Content.findByPk(id);

      if (!lesson || lesson.type !== "lesson") {
        return res
          .status(404)
          .json({ success: false, message: "Lección no encontrada" });
      }

      res.json({ success: true, lesson });
    } catch (error) {
      console.error("Error getting lesson:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener lección" });
    }
  },

  // Crear lección (profesor)
  createLesson: async (req, res) => {
    try {
      const teacherId = req.user.id;
      const {
        title,
        description,
        level,
        moduleId,
        orderInModule,
        lessonType,
        sections,
        questions,
        tips,
        audioUrl,
        videoUrl,
        requiresValidation,
        pointsToPass,
        estimatedTime,
        isRequired,
      } = req.body;

      // Crear la lección en la tabla content
      const lesson = await Content.create({
        teacherId,
        title,
        description,
        type: "lesson",
        level,
        moduleId: moduleId,
        order_in_module: orderInModule,
        lesson_type: lessonType || "explanation",
        sections: sections ? JSON.stringify(sections) : null,
        questions: questions ? JSON.stringify(questions) : null,
        tips: tips ? JSON.stringify(tips) : null,
        audio_url: audioUrl,
        video_url: videoUrl,
        requires_validation: requiresValidation || false,
        points_to_pass: pointsToPass || 70,
        estimated_time: estimatedTime || 15,
        is_required: isRequired !== false,
        unit_id: Date.now(), // ID único para el progreso
        active: true,
      });

      res.status(201).json({ success: true, lesson });
    } catch (error) {
      console.error("Error creating lesson:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al crear lección" });
    }
  },

  // Marcar lección como completada
  completeLesson: async (req, res) => {
    try {
      const userId = req.user.id;
      const { lessonId } = req.params;
      const { score, timeSpent } = req.body;

      const lesson = await Content.findByPk(lessonId);
      if (!lesson) {
        return res
          .status(404)
          .json({ success: false, message: "Lección no encontrada" });
      }

      // Buscar o crear progreso
      let progress = await Progress.findOne({
        where: {
          user_id: userId,
          level: lesson.level,
          moduleId: lesson.moduleId,
          unit_id: lesson.unit_id,
          course_type: "curriculum",
        },
      });

      if (progress) {
        await progress.update({
          completed: true,
          score: score || 100,
          time_spent: (progress.time_spent || 0) + (timeSpent || 0),
          completed_at: new Date(),
        });
      } else {
        progress = await Progress.create({
          user_id: userId,
          level: lesson.level,
          moduleId: lesson.moduleId,
          module_title: `Módulo ${lesson.moduleId}`,
          unit_id: lesson.unit_id,
          unit_title: lesson.title,
          unit_type: lesson.lesson_type,
          completed: true,
          score: score || 100,
          time_spent: timeSpent || 0,
          completed_at: new Date(),
          course_type: "curriculum",
        });
      }

      res.json({ success: true, progress });
    } catch (error) {
      console.error("Error completing lesson:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al completar lección" });
    }
  },

  // Obtener progreso del alumno
  getMyProgress: async (req, res) => {
    try {
      const userId = req.user.id;
      const userLevel = req.user.assigned_level || "A1";

      // Obtener todas las lecciones del curso
      const lessons = await Content.findAll({
        where: {
          level: userLevel,
          type: "lesson",
          moduleId: { [Op.ne]: null },
          active: true,
        },
        order: [
          ["moduleId", "ASC"],
          ["order_in_module", "ASC"],
        ],
      });

      // Obtener progreso del usuario
      const userProgress = await Progress.findAll({
        where: {
          user_id: userId,
          level: userLevel,
          course_type: "curriculum",
          completed: true,
        },
      });

      const completedMap = {};
      userProgress.forEach((p) => {
        completedMap[p.unit_id] = {
          completed: true,
          score: p.score,
        };
      });

      // Agrupar por módulo
      const modulesMap = {};
      lessons.forEach((lesson) => {
        if (!modulesMap[lesson.moduleId]) {
          modulesMap[lesson.moduleId] = {
            moduleId: lesson.moduleId,
            title: `Módulo ${lesson.moduleId}`,
            lessons: [],
            completedLessons: 0,
          };
        }
        const isCompleted = !!completedMap[lesson.unit_id];
        if (isCompleted) modulesMap[lesson.moduleId].completedLessons++;

        modulesMap[lesson.moduleId].lessons.push({
          id: lesson.id,
          title: lesson.title,
          type: lesson.lesson_type,
          order: lesson.order_in_module,
          completed: isCompleted,
          score: completedMap[lesson.unit_id]?.score || 0,
        });
      });

      const modules = Object.values(modulesMap);
      const totalLessons = lessons.length;
      const completedLessons = Object.keys(completedMap).length;
      const overallProgress =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      res.json({
        success: true,
        progress: {
          overall: overallProgress,
          totalLessons,
          completedLessons,
          modules,
        },
      });
    } catch (error) {
      console.error("Error getting progress:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener progreso" });
    }
  },
  // Actualizar lección (profesor)
  updateLesson: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        moduleId,
        orderInModule,
        lessonType,
        sections,
        questions,
        tips,
        audioUrl,
        videoUrl,
        requiresValidation,
        pointsToPass,
        estimatedTime,
        isRequired,
      } = req.body;

      const lesson = await Content.findByPk(id);
      if (!lesson || lesson.type !== "lesson") {
        return res
          .status(404)
          .json({ success: false, message: "Lección no encontrada" });
      }

      await lesson.update({
        title: title || lesson.title,
        description:
          description !== undefined ? description : lesson.description,
        moduleId: moduleId !== undefined ? moduleId : lesson.moduleId,
        order_in_module:
          orderInModule !== undefined ? orderInModule : lesson.order_in_module,
        lesson_type: lessonType || lesson.lesson_type,
        sections: sections ? JSON.stringify(sections) : lesson.sections,
        questions: questions ? JSON.stringify(questions) : lesson.questions,
        tips: tips ? JSON.stringify(tips) : lesson.tips,
        audio_url: audioUrl !== undefined ? audioUrl : lesson.audio_url,
        video_url: videoUrl !== undefined ? videoUrl : lesson.video_url,
        requires_validation:
          requiresValidation !== undefined
            ? requiresValidation
            : lesson.requires_validation,
        points_to_pass:
          pointsToPass !== undefined ? pointsToPass : lesson.points_to_pass,
        estimated_time:
          estimatedTime !== undefined ? estimatedTime : lesson.estimated_time,
        is_required: isRequired !== undefined ? isRequired : lesson.is_required,
      });

      res.json({ success: true, lesson });
    } catch (error) {
      console.error("Error updating lesson:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar lección" });
    }
  },

  // Eliminar lección (profesor)
  deleteLesson: async (req, res) => {
    try {
      const { id } = req.params;

      const lesson = await Content.findByPk(id);
      if (!lesson || lesson.type !== "lesson") {
        return res
          .status(404)
          .json({ success: false, message: "Lección no encontrada" });
      }

      // Eliminar relación en module_content si existe
      await ModuleContent.destroy({ where: { contentId: id } });

      await lesson.destroy();

      res.json({ success: true, message: "Lección eliminada" });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al eliminar lección" });
    }
  },
};

module.exports = curriculumController;
