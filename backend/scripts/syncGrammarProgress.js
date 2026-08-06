// backend/scripts/syncGrammarProgress.js
const db = require('../models');
const { GrammarTopic, Progress, User, sequelize } = db;

async function syncGrammarProgress() {
  try {
    console.log('🔄 Sincronizando unidades de gramática con el sistema de progreso...');

    // 1. Obtener todos los temas de gramática
    const grammarTopics = await GrammarTopic.findAll({
      where: { active: true },
      order: [['level', 'ASC'], ['order', 'ASC']]
    });

    console.log(`📚 Encontrados ${grammarTopics.length} temas de gramática`);

    // 2. Agrupar por nivel y asignar unitIds correctos
    let unitCounter = 1;
    const levelModuleMap = {};

    for (const topic of grammarTopics) {
      const level = topic.level;
      
      // Actualizar unitId secuencial
      await topic.update({ unitId: unitCounter });
      
      if (!levelModuleMap[level]) {
        levelModuleMap[level] = {
          moduleId: Math.ceil(unitCounter / 4),
          moduleTitle: `Módulo ${Math.ceil(unitCounter / 4)} - ${level}`,
          units: []
        };
      }
      
      levelModuleMap[level].units.push({
        unitId: unitCounter,
        unitTitle: topic.title,
        unitType: 'grammar', // Por defecto, todos son gramática
        completed: false,
        score: 0,
        timeSpent: 0
      });
      
      console.log(`✅ ${level} - Unidad ${unitCounter}: ${topic.title}`);
      unitCounter++;
    }

    // 3. Obtener todos los usuarios
    const users = await User.findAll({
      where: { role: 'user' }
    });

    console.log(`\n👥 Usuarios encontrados: ${users.length}`);

    // 4. Para cada usuario, verificar y corregir su progreso
    for (const user of users) {
      console.log(`\n📊 Procesando usuario: ${user.email}`);
      
      const userLevel = user.assignedLevel || user.finalAssignedLevel || 'A1';
      
      // Obtener el módulo para este nivel
      const levelData = levelModuleMap[userLevel];
      if (!levelData) {
        console.log(`  ⚠️ No hay datos para el nivel ${userLevel}`);
        continue;
      }
      
      // Obtener progreso existente del usuario para este nivel
      const existingProgress = await Progress.findAll({
        where: { 
          userId: user.id, 
          level: userLevel 
        }
      });
      
      // Crear o actualizar progreso para cada unidad
      for (const unit of levelData.units) {
        const existing = existingProgress.find(p => p.unitId === unit.unitId);
        
        if (!existing) {
          await Progress.create({
            userId: user.id,
            level: userLevel,
            moduleId: levelData.moduleId,
            moduleTitle: levelData.moduleTitle,
            unitId: unit.unitId,
            unitTitle: unit.unitTitle,
            unitType: unit.unitType,
            completed: unit.completed,
            score: unit.score,
            timeSpent: unit.timeSpent,
            lastAccessed: new Date()
          });
          console.log(`  ➕ Creado progreso para unidad ${unit.unitId}: ${unit.unitTitle}`);
        }
      }
      
      // Actualizar estadísticas del usuario
      const userProgress = await Progress.findAll({
        where: { userId: user.id, level: userLevel }
      });
      
      const completedUnits = userProgress.filter(p => p.completed).length;
      const totalUnits = levelData.units.length;
      const totalTime = userProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
      const avgScore = userProgress.reduce((sum, p) => sum + (p.score || 0), 0) / (userProgress.length || 1);
      
      console.log(`  📈 Progreso: ${completedUnits}/${totalUnits} unidades completadas`);
      console.log(`  ⏱️ Tiempo total: ${Math.floor(totalTime / 60)}h ${totalTime % 60}m`);
      console.log(`  📊 Puntaje promedio: ${Math.round(avgScore)}%`);
    }

    console.log('\n✨ Sincronización completada exitosamente!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error en sincronización:', error);
    console.error('Detalles:', error.errors || error);
    process.exit(1);
  }
}

// Ejecutar
syncGrammarProgress();