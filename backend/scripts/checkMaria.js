const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { User } = require('../models');

async function check() {
  try {
    const maria = await User.findOne({ where: { email: 'maria@email.com' } });
    if (maria) {
      console.log('✅ Maria existe en la DB');
      console.log('Hash en DB:', maria.password);
    } else {
      console.log('❌ Maria NO existe en la DB');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

check();
