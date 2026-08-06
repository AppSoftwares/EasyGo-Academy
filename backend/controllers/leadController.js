const { Lead } = require("../models");
const { Op } = require("sequelize");
const adminNotificationController = require("./adminNotificationController");

const leadController = {
  // Crear lead desde el formulario del Hero
  create: async (req, res) => {
    try {
      const { name, email, phone, notes, source, goal } = req.body;

      // Validar campos requeridos
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Nombre y email son requeridos",
        });
      }

      // Crear lead
      const lead = await Lead.create({
        name,
        email,
        phone: phone || null,
        source: source || "landing_hero",
        notes: notes || null,
        goal: goal || null,
      });

      // 🔔 NOTIFICACIÓN PARA EL ADMIN - Nuevo lead registrado
      await adminNotificationController.createLeadNotification(lead);

      res.status(201).json({
        success: true,
        message: "¡Registro exitoso! Te contactaremos pronto.",
        lead: {
          id: lead.id,
          name: lead.name,
          email: lead.email,
        },
      });
    } catch (error) {
      console.error("Error al crear lead:", error);
      res.status(500).json({
        success: false,
        message: "Error al guardar tu información. Intenta de nuevo.",
      });
    }
  },

  // Guardar lead con resultado de test de nivelación
  saveLevelTest: async (req, res) => {
    try {
      const { name, email, phone, testResult, recommendedLevel, testScore } =
        req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Nombre y email son requeridos",
        });
      }

      // Crear o actualizar lead
      const [lead, created] = await Lead.findOrCreate({
        where: { email },
        defaults: {
          name,
          email,
          phone: phone || null,
          source: "level_test",
          status: "new",
          testResult,
          recommendedLevel,
          testScore,
          testCompletedAt: new Date(),
        },
      });

      // Si ya existía, actualizar sus datos
      if (!created) {
        await lead.update({
          name,
          phone: phone || lead.phone,
          testResult,
          recommendedLevel,
          testScore,
          testCompletedAt: new Date(),
          source: "level_test",
        });
      }

      // Notificar al admin
      await adminNotificationController.createLeadNotification(lead);

      res.json({
        success: true,
        message: "Test completado exitosamente",
        lead: {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          recommendedLevel,
        },
      });
    } catch (error) {
      console.error("Error al guardar test:", error);
      res.status(500).json({
        success: false,
        message: "Error al guardar el test",
      });
    }
  },

  // Obtener leads con filtro por nivel recomendado
  getLeadsByLevel: async (req, res) => {
    try {
      const { level } = req.params;
      const leads = await Lead.findAll({
        where: {
          recommendedLevel: level,
          status: { [Op.ne]: "discarded" },
        },
        order: [["test_completed_at", "DESC"]],
      });
      res.json({ success: true, leads });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  // Obtener todos los leads (para el dashboard de admin)
  getAll: async (req, res) => {
    try {
      const { status, search, limit = 50, offset = 0 } = req.query;
      const where = {};

      if (status && status !== "all") {
        where.status = status;
      }

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
      }

      const { count, rows: leads } = await Lead.findAndCountAll({
        where,
        order: [["created_at", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        success: true,
        leads,
        total: count,
      });
    } catch (error) {
      console.error("Error al obtener leads:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener leads",
      });
    }
  },

  // Actualizar estado del lead
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const lead = await Lead.findByPk(id);
      if (!lead) {
        return res
          .status(404)
          .json({ success: false, message: "Lead no encontrado" });
      }

      await lead.update({ status, notes });

      res.json({ success: true, message: "Lead actualizado", lead });
    } catch (error) {
      console.error("Error al actualizar lead:", error);
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar lead" });
    }
  },

  // Estadísticas de leads
  getStats: async (req, res) => {
    try {
      const total = await Lead.count();
      const newLeads = await Lead.count({ where: { status: "new" } });
      const contacted = await Lead.count({ where: { status: "contacted" } });
      const converted = await Lead.count({ where: { status: "converted" } });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayLeads = await Lead.count({
        where: { created_at: { [Op.gte]: today } },
      });

      res.json({
        success: true,
        stats: { total, newLeads, contacted, converted, todayLeads },
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error al obtener estadísticas" });
    }
  },
};

module.exports = leadController;
