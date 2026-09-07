const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all tasks with assigned user name
router.get('/', (req, res) => {
  const query = `
    SELECT tasks.*, users.name as assigned_user_name 
    FROM tasks 
    LEFT JOIN users ON tasks.assigned_to = users.id 
    ORDER BY tasks.id DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Fetch tasks error:', err);
      return res.status(500).json({ message: 'Database error fetching tasks' });
    }
    res.json(results);
  });
});

// Create new task
router.post('/', (req, res) => {
  const { title, description, assigned_to, due_date, status } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const query = `
    INSERT INTO tasks (title, description, status, assigned_to, due_date) 
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    title,
    description || null,
    status || 'todo',
    assigned_to ? Number(assigned_to) : null,
    due_date || null
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('❌ Task Creation DB Error:', err.message);
      return res.status(500).json({ message: 'Database error: ' + err.message });
    }
    res.status(201).json({ message: 'Task created successfully', taskId: result.insertId });
  });
});

// Update task status (Drag & Drop)
router.put('/:id', (req, res) => {
  const taskId = req.params.id;
  const { status, title, description, assigned_to, due_date } = req.body;

  if (status && !title) {
    db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, taskId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to update task status' });
      return res.json({ message: 'Task status updated' });
    });
  } else {
    const query = `
      UPDATE tasks 
      SET title = ?, description = ?, status = ?, assigned_to = ?, due_date = ? 
      WHERE id = ?
    `;
    db.query(query, [title, description, status, assigned_to || null, due_date || null, taskId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to update task' });
      return res.json({ message: 'Task updated successfully' });
    });
  }
});

// Delete task
router.delete('/:id', (req, res) => {
  const taskId = req.params.id;
  db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err, result) => {
    if (err) {
      console.error('Delete task error:', err);
      return res.status(500).json({ message: 'Failed to delete task' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

module.exports = router;