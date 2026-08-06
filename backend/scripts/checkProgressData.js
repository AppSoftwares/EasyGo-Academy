// backend/scripts/checkProgressData.js
const { Progress, ModuleContent, GrammarTopic } = require('../models')
const { Op } = require('sequelize')

async function checkProgress() {
  try {
    console.log('🔍 VERIFICANDO DATOS DE PROGRESO\n');

    // 1. Ver relaciones module_content
    const moduleContents = await ModuleContent.findAll({
      where: { contentType: 'grammar' }
    });
    console.log('1. RELACIONES MODULE_CONTENT (gramática en módulos):');
    for (const mc of moduleContents) {
      const topic = await GrammarTopic.findByPk(mc.contentId);
      console.log(`   Módulo ${mc.moduleId} -> Tema ID ${mc.contentId}: ${topic ? topic.title : 'NO EXISTE'}`);
    }

    // 2. Ver progreso de gramática del usuario 4
    const grammarProgress = await Progress.findAll({
      where: { 
        userId: 4,
        courseType: { [Op.or]: ['grammar', null] }
      }
    });
    console.log('\n2. PROGRESO DE GRAMÁTICA (usuario 4):');
    for (const gp of grammarProgress) {
      console.log(`   unitId: ${gp.unitId}, completed: ${gp.completed}, score: ${gp.score}`);
    }

    // 3. Ver progreso de currículo del usuario 4
    const curriculumProgress = await Progress.findAll({
      where: { 
        userId: 4,
        courseType: 'curriculum'
      }
    });
    console.log('\n3. PROGRESO DE CURRÍCULO (usuario 4):');
    for (const cp of curriculumProgress) {
      console.log(`   moduleId: ${cp.moduleId}, unitId: ${cp.unitId}, completed: ${cp.completed}, score: ${cp.score}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProgress();