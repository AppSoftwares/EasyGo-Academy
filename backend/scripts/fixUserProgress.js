// backend/scripts/fixUserProgress.js
const db = require('../models');
const { GrammarTopic, Progress, User, sequelize } = db;

async function fixUserProgress(email) {
  try {
    console.log(`🔧 Corrigiendo progreso para usuario: ${email}`);
    
    // 1. Encontrar al usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(`❌ Usuario no encontrado: ${email}`);
      process.exit(1);
    }
    
    const userLevel = user.assignedLevel || user.finalAssignedLevel || 'A1';
    console.log(`📚 Nivel del usuario: ${userLevel}`);
    
    // 2. Obtener temas de gramática para este nivel
    const grammarTopics = await GrammarTopic.findAll({
      where: { level: userLevel, active: true },
      order: [['order', 'ASC']]
    });
    
    console.log(`📖 Encontrados ${grammarTopics.length} temas para nivel ${userLevel}`);
    
    // 3. Limpiar progreso existente para este nivel
    await Progress.destroy({
      where: {
        userId: user.id,
        level: userLevel
      }
    });
    
    console.log(`🗑️ Progreso anterior eliminado`);
    
    // 4. Crear nuevo progreso para todas las unidades
    let unitCounter = 1;
    for (const topic of grammarTopics) {
      // Actualizar unitId del tema
      await topic.update({ unitId: unitCounter });
      
      // Crear progreso inicial
      await Progress.create({
        userId: user.id,
        level: userLevel,
        unitId: unitCounter,
        moduleId: Math.ceil(unitCounter / 4),
        completed: false,
        score: 0,
        timeSpent: 0,
        lastAccessed: new Date()
      });
      
      console.log(`  ✅ Unidad ${unitCounter}: ${topic.title}`);
      unitCounter++;
    }
    
    // 5. Si el usuario ya había completado algunas unidades, marcarlas como completadas
    // (Opcional: puedes pasar un array de unitIds completados como parámetro)
    
    const totalUnits = grammarTopics.length;
    console.log(`\n📊 Resumen para ${user.email}:`);
    console.log(`   - Nivel: ${userLevel}`);
    console.log(`   - Total unidades: ${totalUnits}`);
    console.log(`   - Progreso inicial: 0/${totalUnits} (0%)`);
    
    console.log('\n✨ Progreso corregido exitosamente!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Ejecutar con el email del usuario
const email = process.argv[2] || 'usuario@example.com'; // Cambia por el email real
fixUserProgress(email);