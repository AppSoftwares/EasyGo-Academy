
// backend/scripts/checkProgressStatus.js
const db = require('../models');
const { Progress, User, GrammarTopic } = db;

async function checkProgressStatus(email) {
  try {
    console.log(`🔍 Verificando estado del progreso para: ${email || 'todos los usuarios'}`);
    
    let users = [];
    if (email) {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        console.log(`❌ Usuario no encontrado: ${email}`);
        process.exit(1);
      }
      users = [user];
    } else {
      users = await User.findAll({ where: { role: 'user' } });
    }
    
    for (const user of users) {
      console.log(`\n📊 Usuario: ${user.email} (${user.name})`);
      console.log(`   Nivel asignado: ${user.assignedLevel || user.finalAssignedLevel || 'No asignado'}`);
      
      const progress = await Progress.findAll({
        where: { userId: user.id },
        order: [['level', 'ASC'], ['unitId', 'ASC']]
      });
      
      if (progress.length === 0) {
        console.log(`   ⚠️ No hay registros de progreso`);
        continue;
      }
      
      // Agrupar por nivel
      const byLevel = {};
      for (const p of progress) {
        if (!byLevel[p.level]) byLevel[p.level] = [];
        byLevel[p.level].push(p);
      }
      
      for (const [level, records] of Object.entries(byLevel)) {
        const completed = records.filter(r => r.completed).length;
        const total = records.length;
        const totalTime = records.reduce((sum, r) => sum + (r.timeSpent || 0), 0);
        const avgScore = records.reduce((sum, r) => sum + (r.score || 0), 0) / total;
        
        console.log(`\n   📚 Nivel ${level}:`);
        console.log(`      - Progreso: ${completed}/${total} unidades (${Math.round(completed/total*100)}%)`);
        console.log(`      - Tiempo: ${Math.floor(totalTime / 60)}h ${totalTime % 60}m`);
        console.log(`      - Puntaje promedio: ${Math.round(avgScore)}%`);
        
        // Mostrar primeras 5 unidades
        console.log(`      - Unidades recientes:`);
        records.slice(0, 5).forEach(r => {
          const status = r.completed ? '✅' : '⏳';
          console.log(`        ${status} Unidad ${r.unitId}: ${r.unitTitle} (${Math.round(r.score)}%)`);
        });
        if (records.length > 5) {
          console.log(`        ... y ${records.length - 5} más`);
        }
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

const email = process.argv[2];
checkProgressStatus(email);