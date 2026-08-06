// backend/controllers/moduleController.js
const { Content, ModuleContent, GrammarTopic } = require("../models");
const { Op } = require("sequelize");

const moduleController = {
  // Obtener módulos con su contenido
  getModules: async (req, res) => {
    try {
      const { level } = req.params;

      // 1. Obtener módulos del nivel
      const modules = await Content.findAll({
        where: { level, type: "module", active: true },
        order: [["order_in_module", "ASC"]],
      });

      // 2. Para cada módulo, obtener sus lecciones desde module_content
      const modulesWithContent = await Promise.all(
        modules.map(async (module) => {
          // Buscar relaciones en module_content
          const relations = await ModuleContent.findAll({
            where: { moduleId: module.id },
            order: [["order", "ASC"]],
          });

          // Obtener los detalles de cada contenido
          // En moduleController.js, dentro de getModules, cambia esta parte:
          
          const lessons = await Promise.all(
            relations.map(async (rel) => {
              const content = await Content.findByPk(rel.contentId);

              if (!content) return null;

              // 🔧 Calcular questionsCount de forma segura
              let questionsCount = 0;
              let parsedQuestions = [];
              if (JSON.parse(content.questions)) {
                try {
                  // Si es string, parsearlo; si ya es array, usarlo directamente
                  parsedQuestions =
                    typeof content.questions === "string"
                      ? JSON.parse(JSON.parse(content.questions))
                      : content.questions;
                  questionsCount = Array.isArray(parsedQuestions)
                    ? parsedQuestions.length
                    : 0;
                } catch (e) {
                  questionsCount = 0;
                }
              }
               console.log({
                id: content.id,
                title: content.title,
                description: content.description,
                type: rel.contentType,
                lessonType: content.type,
                order: rel.order,
                completed: false,
                score: 0,
                questions: parsedQuestions, // ← Incluir preguntas parseadas
                questionsCount: questionsCount, // ← Usar el valor calculado
              }) 
              return {
                id: content.id,
                title: content.title,
                description: content.description,
                type: rel.contentType,
                lessonType: content.lesson_type,
                order: rel.order,
                completed: false,
                score: 0,
                questions: parsedQuestions, // ← Incluir preguntas parseadas
                questionsCount: questionsCount, // ← Usar el valor calculado
              };
            }),
          );

          // Filtrar nulos
          const validLessons = lessons.filter((l) => l !== null);

          // Calcular estadísticas
          const totalLessons = validLessons.length;
          const completedLessons = validLessons.filter(
            (l) => l.completed,
          ).length;

          return {
            id: module.id,
            moduleId: module.id,
            title: module.title,
            description: module.description,
            order: module.order_in_module,
            level: module.level,
            totalLessons: totalLessons,
            completedLessons: completedLessons,
            lessons: validLessons,
          };
        }),
      );

      res.json({ success: true, modules: modulesWithContent });
    } catch (error) {
      console.error("Error getting modules:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener módulos" });
    }
  },

  // Crear módulo
  createModule: async (req, res) => {
    try {
      const { title, description, level, order } = req.body;
      const teacherId = req.user.id;

      const newModule = await Content.create({
        teacherId,
        title,
        description: description || "",
        type: "module",
        level: level || "A1",
        order_in_module: order || 1,
        active: true,
      });

      res.status(201).json({ success: true, module: newModule });
    } catch (error) {
      console.error("Error creating module:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al crear módulo" });
    }
  },

  // Actualizar módulo
  updateModule: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, order, active } = req.body;

      const module = await Content.findByPk(id);
      if (!module || module.type !== "module") {
        return res
          .status(404)
          .json({ success: false, message: "Módulo no encontrado" });
      }

      await module.update({
        title: title || module.title,
        description:
          description !== undefined ? description : module.description,
        order_in_module: order !== undefined ? order : module.order_in_module,
        active: active !== undefined ? active : module.active,
      });

      res.json({ success: true, module });
    } catch (error) {
      console.error("Error updating module:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar módulo" });
    }
  },

  // Eliminar módulo
  deleteModule: async (req, res) => {
    try {
      const { id } = req.params;

      const module = await Content.findOne({ where: { id, type: "module" } });
      if (!module) {
        return res
          .status(404)
          .json({ success: false, message: "Módulo no encontrado" });
      }

      // Eliminar relaciones en module_content
      await ModuleContent.destroy({ where: { moduleId: id } });

      // Eliminar el módulo
      await module.destroy();

      res.json({ success: true, message: "Módulo eliminado" });
    } catch (error) {
      console.error("Error deleting module:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al eliminar módulo" });
    }
  },

  // Reordenar módulos
  reorderModules: async (req, res) => {
    try {
      const { level, orders } = req.body;

      for (const item of orders) {
        await Content.update(
          { order_in_module: item.order },
          { where: { id: item.id, type: "module", level } },
        );
      }

      res.json({ success: true, message: "Módulos reordenados" });
    } catch (error) {
      console.error("Error reordering modules:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al reordenar módulos" });
    }
  },

  // Agregar contenido a módulo
  addContentToModule: async (req, res) => {
    try {
      const { moduleId } = req.params;
      const { contentId, contentType, order, isRequired } = req.body;

      // Verificar que el módulo existe
      const module = await Content.findOne({
        where: { id: moduleId, type: "module" },
      });
      if (!module) {
        return res
          .status(404)
          .json({ success: false, message: "Módulo no encontrado" });
      }

      // Verificar que el contenido existe
      const content = await Content.findByPk(contentId);
      if (!content) {
        return res
          .status(404)
          .json({ success: false, message: "Contenido no encontrado" });
      }

      // Crear relación
      const [relation, created] = await ModuleContent.findOrCreate({
        where: { moduleId, contentId, contentType },
        defaults: {
          moduleId,
          contentId,
          contentType: contentType || "lesson",
          order: order || 0,
          isRequired: isRequired !== false,
        },
      });

      res.status(201).json({ success: true, relation });
    } catch (error) {
      console.error("Error adding content to module:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al agregar contenido" });
    }
  },
};

module.exports = moduleController;
