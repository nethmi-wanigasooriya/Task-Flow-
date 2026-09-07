const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
  const host = (process.env.DB_HOST || '').trim();
  const user = (process.env.DB_USER || '').trim();
  const password = (process.env.DB_PASSWORD || '').trim();
  const database = (process.env.DB_NAME || '').trim();
  const port = Number(process.env.DB_PORT) || 16098;

  console.log(`Connecting to Host: "${host}" on Port: ${port}...`);

  try {
    const connection = await mysql.createConnection({
      host: host,
      port: port,
      user: user,
      password: password,
      database: database,
      ssl: { rejectUnauthorized: false }
    });

    console.log('✅ Connected to Aiven MySQL successfully!');

    // Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'User') DEFAULT 'User',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tasks Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('To Do', 'In Progress', 'Done') DEFAULT 'To Do',
        priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
        due_date DATE,
        assigned_to INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    console.log('✅ Tables created successfully on Cloud DB!');
    await connection.end();
  } catch (err) {
    console.error('❌ Error initializing database:', err.message);
  }
}

initDB();