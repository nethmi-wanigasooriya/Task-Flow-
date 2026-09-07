const db = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  try {
    const adminEmail = 'admin@lesstaxi.com';
    const adminPassword = 'admin123';

    // 1. Admin කෙනෙක් දැනටමත් ඉන්නවාදැයි පරීක්ෂා කිරීම
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [adminEmail]);

    if (existing && existing.length > 0) {
      console.log('⚠️ Admin user already exists in the database!');
      process.exit(0);
    }

    // 2. Password එක Hash කිරීම
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 3. Admin User Database එකට එකතු කිරීම
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['System Admin', adminEmail, hashedPassword, 'admin']
    );

    console.log('==============================================');
    console.log('✅ Admin user created successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('==============================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message || error);
    process.exit(1);
  }
};

createAdmin();