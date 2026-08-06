const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { User, Session } = require('../models');

async function clean() {
  try {
    console.log('🧹 Iniciando limpieza de base de datos...');
    // Eliminar sesiones primero por integridad referencial
    await Session.destroy({ where: {}, truncate: true, cascade: true });
    console.log('✅ Sesiones eliminadas');

    // Eliminar usuarios
    await User.destroy({ where: {}, truncate: true, cascade: true });
    console.log('✅ Usuarios eliminados');

    console.log('✨ Base de datos limpia. Lista para el próximo arranque.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar base de datos:', error);
    process.exit(1);
  }
}

clean();
