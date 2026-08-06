const { TestProgress, User, Content, Progress } = require('../models')

const testProgressController = {
  getProgress: async (req, res) => {
    try {
      const userId = req.user.id
      let progress = await TestProgress.findOne({ where: { userId, completed: false } })
      if (!progress) return res.json({ success: true, progress: null, message: 'No hay un test en progreso' })
      res.json({ success: true, progress })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener progreso' })
    }
  },

  saveProgress: async (req, res) => {
    try {
      const userId = req.user.id
      const { currentQuestion, answers, textAnswers, totalQuestions } = req.body
      let progress = await TestProgress.findOne({ where: { userId, completed: false } })
      if (progress) {
        await progress.update({
          currentQuestion: currentQuestion !== undefined ? currentQuestion : progress.currentQuestion,
          answers: answers !== undefined ? answers : progress.answers,
          textAnswers: textAnswers !== undefined ? textAnswers : progress.textAnswers,
          totalQuestions: totalQuestions || progress.totalQuestions,
        })
      } else {
        progress = await TestProgress.create({ userId, currentQuestion: currentQuestion || 0, answers: answers || {}, textAnswers: textAnswers || {}, totalQuestions: totalQuestions || 0, startedAt: new Date() })
      }
      res.json({ success: true, message: 'Progreso guardado', progress })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al guardar progreso' })
    }
  },

  completeTest: async (req, res) => {
    try {
      const userId = req.user.id
      const { answers, textAnswers, results } = req.body
      const progress = await TestProgress.findOne({ where: { userId, completed: false } })
      if (progress) {
        await progress.update({
          completed: true,
          skipped: results?.skipped || false,
          completedAt: new Date(),
          answers: answers || progress.answers,
          textAnswers: textAnswers || progress.textAnswers,
        })
      }
      // Si fue omitido, actualizar usuario
      if (results?.skipped) {
        await User.update({ levelTestCompleted: true, levelTestResult: results, assignedLevel: 'A1' }, { where: { id: userId } })
        //crear un progress basico
        const lesson = await Content.findOne({ where: { type: 'lesson' } })
        console.log(lesson)
         const progress = await Progress.create({
          userId: userId,
          level: lesson.level,
          moduleId: lesson?.moduleId,
          moduleTitle: `Módulo ${lesson.moduleId}`,
          unitId: lesson?.id,
          unitTitle: lesson.title,
          unitType: lesson.type,
          completed: false,
          score: 0,
          time_spent: 0,
          completed_at: new Date(),
          course_type: "curriculum",
        });  
      }
      res.json({ success: true, message: results?.skipped ? 'Test omitido' : 'Test completado' })
    } catch (error) {
      console.log("ERROR: ", error)
      res.status(500).json({ success: false, message: 'Error al completar test' })
    }
  },

  resetTest: async (req, res) => {
    try {
      const userId = req.user.id
      await TestProgress.destroy({ where: { userId, completed: false } })
      res.json({ success: true, message: 'Progreso del test reiniciado' })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al reiniciar test' })
    }
  },
}

module.exports = testProgressController