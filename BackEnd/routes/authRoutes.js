const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// 1. Register User
router.post('/register', async (req, res) => {
  console.log('--- REGISTER REQUEST RECEIVED ---');
  console.log('Payload:', req.body);

  const { name, email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const userRole = role || 'user';
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    
    // Database query execution
    db.query(query, [name || '', email, hashedPassword, userRole], (err, result) => {
      if (err) {
        console.error('MYSQL REGISTER ERROR:', err);
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      console.log('User registered successfully:', result.insertId);
      return res.status(201).json({ message: 'User registered successfully!' });
    });
  } catch (error) {
    console.error('SERVER REGISTER ERROR:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 2. Login User
router.post('/login', async (req, res) => {
  console.log('--- LOGIN REQUEST RECEIVED ---');
  console.log('Payload:', req.body);

  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('MYSQL LOGIN ERROR:', err);
        return res.status(500).json({ message: 'Database error', error: err.message });
      }

      if (results.length === 0) {
        console.log('User not found for email:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log('Password match failed for:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secretkey',
        { expiresIn: '1h' }
      );

      console.log('Login successful for:', email);
      return res.status(200).json({ token, user: { id: user.id, name: user.name, role: user.role } });
    });
  } catch (error) {
    console.error('SERVER LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;