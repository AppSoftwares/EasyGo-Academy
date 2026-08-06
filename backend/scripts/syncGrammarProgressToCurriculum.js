// backend/scripts/syncGrammarProgressToCurriculum.js
const { Progress, ModuleContent, GrammarTopic, User, sequelize } = require('../models')
const { Op } = require('sequelize')

async function syncProgress() {
  try {
    console.log('🔄 Sincronizando progreso de gramática al currículo...');

    const moduleContents = await ModuleContent.findAll({
      where: { contentType: 'grammar' }
    });

    console.log(`📦 Encontradas ${moduleContents.length} relaciones de gramática en módulos`);

    for (const mc of moduleContents) {
      console.log(`\n📌 Procesando relación: módulo ${mc.moduleId}, contenido ${mc.contentId}`);

      const grammarTopic = await GrammarTopic.findByPk(mc.contentId);
      if (!grammarTopic) {
        console.log(`⚠️ Tema de gramática ID ${mc.contentId} no encontrado`);
        continue;
      }
      console.log(`   Tema: ${grammarTopic.title} (Nivel ${grammarTopic.level})`);

      const grammarProgresses = await Progress.findAll({
        where: { 
          unit_id: mc.contentId,
          course_type: { [Op.or]: ['grammar', null] }
        }
      });

      console.log(`   Encontrados ${grammarProgresses.length} registros de progreso de gramática`);

      for (const grammarProgress of grammarProgresses) {
        console.log(`\n   👤 Procesando usuario ID: ${grammarProgress.user_id}`);

        const user = await User.findByPk(grammarProgress.user_id);
        if (!user) {
          console.log(`      ⚠️ Usuario ${grammarProgress.user_id} no encontrado`);
          continue;
        }
        console.log(`      Usuario: ${user.email}, Nivel asignado: ${user.assigned_level}`);

        const existing = await Progress.findOne({
          where: { 
            user_id: grammarProgress.user_id,
            unit_id: mc.contentId,
            course_type: 'curriculum'
          }
        });

        if (existing) {
          console.log(`      ⏩ Ya existe progreso de currículo`);
          continue;
        }

        const level = user.assigned_level || grammarTopic.level || 'A1';
        const moduleTitle = `Módulo ${mc.moduleId}`;

        // Usar los nombres de columna CON GUION BAJO
        await Progress.create({
          userId: grammarProgress.user_id,      // ← user_id, no userId
          level: level,
          moduleId: mc.moduleId,               // ← moduleId, no moduleId
          moduleTitle: moduleTitle,             // ← module_title, no moduleTitle
          unitId: mc.contentId,                // ← unit_id, no unitId
          unitTitle: grammarTopic.title,        // ← unit_title, no unitTitle
          unitType: 'grammar',                  // ← unit_type, no unitType
          completed: grammarProgress.completed || false,
          score: grammarProgress.score || 100,
          timeSpent: grammarProgress.time_spent || 0,
          completedAt: grammarProgress.completed_at || (grammarProgress.completed ? new Date() : null),
          courseType: 'curriculum'
        });

        console.log(`      ✅ Sincronizado correctamente`);
      }
    }

    console.log('\n✅ Sincronización completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

syncProgress();