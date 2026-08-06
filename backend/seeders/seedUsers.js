// backend/seeders/seedUsers.js - VERSIÓN CORRECTA
const bcrypt = require('bcryptjs');

module.exports = async () => {
  const { User } = require('../models');
  
  const users = [
    {
      name: 'Administrador',
      email: 'admin@easygo.com',
      password: 'admin123',  // ← Texto plano, el hook lo hashea
      phone: '+1 555-0123',
      role: 'admin',
      plan: 'premium',
      active: true
    },
    {
      name: 'Carlos Profesor',
      email: 'teacher@easygo.com',
      password: 'teacher123',  // ← Texto plano
      phone: '+1 555-0125',
      role: 'teacher',
      plan: 'premium',
      active: true
    },
    {
      name: 'Maria Gonzalez',
      email: 'maria@email.com',
      password: '123456',  // ← Texto plano
      phone: '+1 555-0124',
      role: 'user',
      plan: 'basic',
      active: true
    }
  ];
  
  for (const user of users) {
    const exists = await User.findOne({ where: { email: user.email } });
    if (!exists) {
      await User.create(user);  // ← El hook beforeCreate hashea automáticamente
      console.log(`✅ Usuario creado: ${user.email}`);
    }
  }
};