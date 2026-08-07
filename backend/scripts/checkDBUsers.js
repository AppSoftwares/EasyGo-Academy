const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { User } = require('../models');

async function check() {
  try {
    const users = await User.findAll({ attributes: ['id', 'email', 'name', 'password'] });
    console.log('--- USUARIOS EN DB ---');
    users.forEach(u => {
      console.log(`Email: ${u.email}, Name: ${u.name}, Hash: ${u.password.substring(0, 20)}...`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
