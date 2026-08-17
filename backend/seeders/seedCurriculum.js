const { CourseLevel, Module } = require('../models');

const seedCurriculum = async () => {
  const levels = [
    { id: 'level_a1', code: 'A1', name: 'Principiante A1', order: 1, estimatedDurationMonths: 2.5, description: 'Fundamentos básicos del inglés.' },
    { id: 'level_a2', code: 'A2', name: 'Elemental A2', order: 2, estimatedDurationMonths: 2.5, description: 'Comunicación en situaciones cotidianas.' },
    { id: 'level_b1', code: 'B1', name: 'Intermedio B1', order: 3, estimatedDurationMonths: 3.0, description: 'Independencia en el uso del idioma.' },
    { id: 'level_b2', code: 'B2', name: 'Intermedio Alto B2', order: 4, estimatedDurationMonths: 3.0, description: 'Fluidez y argumentación compleja.' },
    { id: 'level_c1', code: 'C1', name: 'Avanzado C1', order: 5, estimatedDurationMonths: null, description: 'Dominio profesional del inglés.' },
  ];

  try {
    for (const level of levels) {
      await CourseLevel.upsert(level);

      // Crear 12 módulos por nivel (simplificado)
      for (let i = 1; i <= 12; i++) {
        await Module.upsert({
          id: `${level.code.toLowerCase()}_mod_${i.toString().padStart(2, '0')}`,
          levelId: level.id,
          order: i,
          title: `Módulo ${i}: ${level.name}`,
          description: `Descripción del módulo ${i} para el nivel ${level.code}`
        });
      }
    }
    console.log('✅ Plan de estudios (Niveles y Módulos) sembrado correctamente.');
  } catch (error) {
    console.error('❌ Error sembrando currículum:', error.message);
  }
};

module.exports = seedCurriculum;
