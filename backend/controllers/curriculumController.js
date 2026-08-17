const {
  CourseLevel, Module, CourseUnit, MediaResource,
  ReadingText, PracticeParagraph, Lesson, Exercise
} = require("../models");

const curriculumController = {
  // Obtener todos los niveles con sus módulos
  getAllLevels: async (req, res) => {
    try {
      const levels = await CourseLevel.findAll({
        include: [{ model: Module, as: 'modules', order: [['order', 'ASC']] }],
        order: [['order', 'ASC']]
      });
      res.json({ success: true, levels });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Obtener una unidad completa con todo su contenido
  getUnitContent: async (req, res) => {
    const { unitId } = req.params;
    try {
      const unit = await CourseUnit.findByPk(unitId, {
        include: [
          { model: MediaResource, as: 'media' },
          { model: ReadingText, as: 'readingTexts' },
          { model: PracticeParagraph, as: 'practiceParagraphs' },
          {
            model: Lesson,
            as: 'lessons',
            include: [{ model: Exercise, as: 'exercises' }]
          }
        ]
      });

      if (!unit) {
        return res.status(404).json({ success: false, message: "Unidad no encontrada" });
      }

      res.json({ success: true, unit });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Importar/Sincronizar una unidad desde JSON (útil para el admin)
  syncUnitFromJson: async (req, res) => {
    const unitData = req.body; // El JSON de example_unit.json
    const transaction = await require("../models").sequelize.transaction();

    try {
      // 1. Upsert Unit
      await CourseUnit.upsert(unitData.unit, { transaction });

      // 2. Sync Media
      if (unitData.media) {
        for (const m of unitData.media) {
          await MediaResource.upsert(m, { transaction });
        }
      }

      // 3. Sync Reading Texts
      if (unitData.readingTexts) {
        for (const rt of unitData.readingTexts) {
          await ReadingText.upsert(rt, { transaction });
        }
      }

      // 4. Sync Practice Paragraphs
      if (unitData.practiceParagraphs) {
        for (const pp of unitData.practiceParagraphs) {
          await PracticeParagraph.upsert(pp, { transaction });
        }
      }

      // 5. Sync Lessons & Exercises
      if (unitData.lessons) {
        for (const lesson of unitData.lessons) {
          const { exercises, ...lessonInfo } = lesson;
          await Lesson.upsert(lessonInfo, { transaction });

          if (exercises) {
            for (const ex of exercises) {
              await Exercise.upsert(ex, { transaction });
            }
          }
        }
      }

      await transaction.commit();
      res.json({ success: true, message: "Unidad sincronizada correctamente" });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = curriculumController;
