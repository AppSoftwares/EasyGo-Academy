const { Question } = require("../models");
const { Op } = require("sequelize");

const questionController = {
  // Obtener todas las preguntas (con filtros)
  getAll: async (req, res) => {
    try {
      const {
        level,
        category,
        section,
        active,
        search,
        limit = 200,
        offset = 0,
      } = req.query;
      const where = {};

      if (level && level !== "all") where.level = level;
      if (category && category !== "all") where.category = category;
      if (section && section !== "all") where.section = section;
      if (active !== undefined) where.active = active === "true";

      if (search) {
        where[Op.or] = [
          { question: { [Op.like]: `%${search}%` } },
          { section: { [Op.like]: `%${search}%` } },
        ];
      }

      const { count, rows: questions } = await Question.findAndCountAll({
        where,
        order: [
          ["level", "ASC"],
          ["section", "ASC"],
          ["order", "ASC"],
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({ success: true, questions, total: count });
    } catch (error) {
      console.error("Error al obtener preguntas:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener preguntas" });
    }
  },

  // Obtener preguntas para el test de nivelación público
  // En questionController.js
  getLevelTestQuestions: async (req, res) => {
    try {
      const questions = await Question.findAll({
        where: { active: true },
        attributes: ["id", "question", "type", "options", "answer", "level"],
        order: [
          ["level", "ASC"],
          ["order", "ASC"],
        ],
        limit: 20,
      });

      // Transformar para el frontend
      const formattedQuestions = questions.map((q) => ({
        id: q.id,
        text: q.question,
        type: q.type,
        options: Array.isArray(q.options) ? q.options : (q.options ? JSON.parse(q.options) : []),
        correctAnswer: q.answer,
        level: q.level,
      }));

      res.json({ success: true, questions: formattedQuestions });
    } catch (error) {
      console.error("Error getting level test questions:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
  // Obtener preguntas para la prueba de nivelación
  getForTest: async (req, res) => {
    try {
      // Obtener preguntas activas, ordenadas por nivel y sección
      const questions = await Question.findAll({
        where: { active: true },
        order: [
          ["level", "ASC"],
          ["section", "ASC"],
          ["order", "ASC"],
        ],
      });

      // Agrupar por nivel para mostrar progreso
      const byLevel = {};
      questions.forEach((q) => {
        if (!byLevel[q.level]) byLevel[q.level] = [];
        byLevel[q.level].push(q);
      });

      res.json({
        success: true,
        questions,
        total: questions.length,
        byLevel,
      });
    } catch (error) {
      console.error("Error al obtener preguntas del test:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al obtener preguntas" });
    }
  },

  // Obtener una pregunta por ID
  getById: async (req, res) => {
    try {
      const question = await Question.findByPk(req.params.id);
      if (!question) {
        return res
          .status(404)
          .json({ success: false, message: "Pregunta no encontrada" });
      }
      res.json({ success: true, question });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error al obtener pregunta" });
    }
  },

  // Crear pregunta
  create: async (req, res) => {
    try {
      const {
        question,
        type,
        options,
        answer,
        acceptAlso,
        category,
        level,
        section,
        points,
        order,
        explanation,
      } = req.body;

      if (!question || !type || !answer || !category || !level) {
        return res.status(400).json({
          success: false,
          message: "Campos requeridos: question, type, answer, category, level",
        });
      }

      const newQuestion = await Question.create({
        question,
        type,
        options: options || null,
        answer: String(answer),
        acceptAlso: acceptAlso || null,
        category,
        level,
        section: section || null,
        points: points || 1,
        order: order || 0,
        explanation: explanation || null,
        createdBy: req.user?.id || null,
      });

      res.status(201).json({
        success: true,
        message: "Pregunta creada",
        question: newQuestion,
      });
    } catch (error) {
      console.error("Error al crear pregunta:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al crear pregunta" });
    }
  },

  // Actualizar pregunta
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const question = await Question.findByPk(id);
      if (!question) {
        return res
          .status(404)
          .json({ success: false, message: "Pregunta no encontrada" });
      }

      const updateData = { ...req.body, updatedBy: req.user?.id || null };
      await question.update(updateData);

      res.json({ success: true, message: "Pregunta actualizada", question });
    } catch (error) {
      console.error("Error al actualizar pregunta:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar pregunta" });
    }
  },

  // Eliminar pregunta
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const question = await Question.findByPk(id);
      if (!question) {
        return res
          .status(404)
          .json({ success: false, message: "Pregunta no encontrada" });
      }

      await question.destroy();
      res.json({ success: true, message: "Pregunta eliminada" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error al eliminar pregunta" });
    }
  },

  // Crear preguntas en lote (para importar las 95+ preguntas)
  bulkCreate: async (req, res) => {
    try {
      const { questions } = req.body;
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Se requiere un array de preguntas",
        });
      }

      const created = await Question.bulkCreate(
        questions.map((q) => ({
          ...q,
          answer: String(q.answer),
          createdBy: req.user?.id || null,
        })),
      );

      res.status(201).json({
        success: true,
        message: `${created.length} preguntas creadas`,
        count: created.length,
      });
    } catch (error) {
      console.error("Error al crear preguntas en lote:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al crear preguntas" });
    }
  },

  // Obtener estadísticas del banco de preguntas
  getStats: async (req, res) => {
    try {
      const total = await Question.count();
      const active = await Question.count({ where: { active: true } });
      const byLevel = {};
      const byCategory = {};

      const levels = ["A1", "A2", "B1", "B2", "C1"];
      const categories = [
        "grammar",
        "vocabulary",
        "reading",
        "writing",
        "listening",
        "speaking",
      ];

      for (const level of levels) {
        byLevel[level] = await Question.count({
          where: { level, active: true },
        });
      }
      for (const cat of categories) {
        byCategory[cat] = await Question.count({
          where: { category: cat, active: true },
        });
      }

      res.json({
        success: true,
        stats: { total, active, byLevel, byCategory },
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error al obtener estadísticas" });
    }
  },
};

module.exports = questionController;
