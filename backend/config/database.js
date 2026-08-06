const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'easygo_academy',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Crear tablas automáticamente
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Crear base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'easygo_academy'}`);
    await connection.query(`USE ${process.env.DB_NAME || 'easygo_academy'}`);
    
    // Tabla de usuarios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role ENUM('admin', 'user', 'teacher') DEFAULT 'user',
        active BOOLEAN DEFAULT true,
        plan ENUM('basic', 'premium') DEFAULT 'basic',
        level_test_completed BOOLEAN DEFAULT false,
        level_test_result JSON,
        assigned_level VARCHAR(5),
        final_assigned_level VARCHAR(5),
        level_test_reviewed BOOLEAN DEFAULT false,
        reviewed_by VARCHAR(100),
        reviewed_date DATETIME,
        review_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Tabla de pruebas de nivelación
    await connection.query(`
      CREATE TABLE IF NOT EXISTS level_tests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total_points INT DEFAULT 0,
        earned_points INT DEFAULT 0,
        percentage DECIMAL(5,2) DEFAULT 0,
        recommended_level VARCHAR(5),
        category_scores JSON,
        answers JSON,
        completed BOOLEAN DEFAULT false,
        skipped BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Tabla de sesiones (opcional)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Insertar usuarios por defecto si no existen
    const bcrypt = require('bcryptjs');
    const [existingUsers] = await connection.query('SELECT COUNT(*) as count FROM users');
    
    if (existingUsers[0].count === 0) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      const userPassword = await bcrypt.hash('123456', 10);
      
      await connection.query(`
        INSERT INTO users (name, email, password, phone, role, plan) VALUES
        ('Admin EasyGo', 'admin@easygo.com', ?, '+1 555-0123', 'admin', 'premium'),
        ('Maria Gonzalez', 'maria@email.com', ?, '+1 555-0124', 'user', 'basic')
      `, [adminPassword, userPassword]);
      
      console.log('✅ Usuarios por defecto creados');
    }
    
    connection.release();
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
  }
};

module.exports = { pool, initDatabase };