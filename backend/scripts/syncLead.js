// backend/scripts/syncLead.js
const { sequelize } = require('../models');
const LeadModel = require('../models/Lead');

async function syncLead() {
  try {
    // Inicializar el modelo
    const Lead = LeadModel(sequelize);
    
    // Sincronizar solo la tabla leads
    await Lead.sync({ alter: true });
    console.log('✅ Tabla "leads" sincronizada correctamente');
    
    // Verificar columnas
    const [columns] = await sequelize.query("SHOW COLUMNS FROM leads");
    console.log('\n📋 Columnas en la tabla leads:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar leads:', error.message);
    process.exit(1);
  }
}

syncLead();