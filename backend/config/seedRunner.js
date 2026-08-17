const { User, Question, GrammarTopic } = require('../models')

const seedRunner = async () => {
  console.log('\n📦 Verificando seeds...\n')

  try {
    // ============ USUARIOS ============
    const userCount = await User.count()
    if (userCount === 0) {
      // Usamos .create() directo sin hashear aquí, porque el modelo User.js
      // tiene el hook beforeCreate que ya se encarga del hash.
      await User.create({ name: 'Admin EasyGo', email: 'admin@easygo.com', password: 'admin123', phone: '+1 555-0123', role: 'admin', plan: 'premium' })
      await User.create({ name: 'Maria Gonzalez', email: 'maria@email.com', password: '123456', phone: '+1 555-0124', role: 'user', plan: 'basic' })
      await User.create({ name: 'Carlos Profesor', email: 'teacher@easygo.com', password: 'teacher123', phone: '+1 555-0125', role: 'teacher', plan: 'premium' })
      console.log('✅ Usuarios creados (admin, user, teacher)')
    } else {
      console.log('⏭️  Usuarios: ya existen')
    }

    // ============ PREGUNTAS ============
    const questionCount = await Question.count()
    if (questionCount === 0) {
      const questions = require('../seeders/seedQuestions')
      await Question.bulkCreate(questions)
      console.log(`✅ ${questions.length} preguntas insertadas`)
    } else {
      console.log(`⏭️  Preguntas: ya existen ${questionCount}`)
    }

    // ============ GRAMMAR ============
    const grammarCount = await GrammarTopic.count()
    if (grammarCount === 0) {
      const seedGrammar = require('../seeders/seedGrammar')
      try {
        await seedGrammar()
      } catch (e) {
        if (e.message !== 'process.exit') throw e;
      }
    } else {
      console.log(`⏭️  Temas de gramática: ya existen ${grammarCount}`)
    }

    // ============ CURRICULUM ============
    const seedCurriculum = require('../seeders/seedCurriculum')
    await seedCurriculum()

    console.log('\n✅ Verificación de seeds completada\n')
  } catch (error) {
    console.error('❌ Error en seeds:', error.message)
  }
}

module.exports = seedRunner
