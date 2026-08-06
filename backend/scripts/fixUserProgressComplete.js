// backend/scripts/fixUserProgressComplete.js
const db = require('../models');
const { GrammarTopic, Progress, User, sequelize } = db;

async function fixUserProgressComplete(email) {
  try {
    console.log(`🔧 Corrigiendo progreso completo para usuario: ${email}`);
    
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
    
    // 3. Actualizar unitIds de los temas
    let unitCounter = 1;
    for (const topic of grammarTopics) {
      await topic.update({ unitId: unitCounter });
      unitCounter++;
    }
    
    // 4. Eliminar progreso existente para este nivel
    const deleted = await Progress.destroy({
      where: {
        userId: user.id,
        level: userLevel
      }
    });
    
    console.log(`🗑️ Eliminados ${deleted} registros de progreso anteriores`);
    
    // 5. Crear nuevo progreso para todas las unidades
    const moduleSize = 4; // 4 unidades por módulo
    const progressRecords = [];
    
    for (let i = 0; i < grammarTopics.length; i++) {
      const topic = grammarTopics[i];
      const unitId = topic.unitId;
      const moduleId = Math.ceil(unitId / moduleSize);
      const moduleTitle = `Módulo ${moduleId} - ${userLevel}`;
      
      progressRecords.push({
        userId: user.id,
        level: userLevel,
        moduleId: moduleId,
        moduleTitle: moduleTitle,
        unitId: unitId,
        unitTitle: topic.title,
        unitType: 'grammar',
        completed: false,
        score: 0,
        timeSpent: 0,
        lastAccessed: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`  ✅ Unidad ${unitId}: ${topic.title} (${moduleTitle})`);
    }
    
    // Insertar todos los registros
    await Progress.bulkCreate(progressRecords);
    
    const totalUnits = grammarTopics.length;
    const totalModules = Math.ceil(totalUnits / moduleSize);
    
    console.log(`\n📊 Resumen para ${user.email}:`);
    console.log(`   - Nivel: ${userLevel}`);
    console.log(`   - Módulos: ${totalModules}`);
    console.log(`   - Unidades: ${totalUnits}`);
    console.log(`   - Progreso inicial: 0/${totalUnits} (0%)`);
    
    console.log('\n✨ Progreso recreado exitosamente!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Detalles:', error.errors || error);
    process.exit(1);
  }
}

// Ejecutar con el email del usuario
const email = process.argv[2];
if (!email) {
  console.log('❌ Por favor proporciona un email: node scripts/fixUserProgressComplete.js usuario@email.com');
  process.exit(1);
}

fixUserProgressComplete(email);