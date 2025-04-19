const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all task lists with their tasks (even if empty)
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        tl.id AS task_list_id,
        tl.status,
        tl.order_list,
        t.id AS task_id,
        t.title,
        t.time_estimated,
        t.order_task
      FROM tasks_list tl
      LEFT JOIN tasks t ON t.task_list_id = tl.id
      ORDER BY tl.order_list, t.order_task;
    `);

    // Raggruppa le task per lista
    const grouped = {};
    for (const row of result.rows) {
      const listKey = row.status;
      if (!grouped[listKey]) {
        grouped[listKey] = {
          status: row.status,
          order_list: row.order_list,
          task_list_id: row.task_list_id,
          tasks: [],
        };
      }

      // Se c'è una task, la aggiungiamo
      if (row.task_id) {
        grouped[listKey].tasks.push({
          id: row.task_id,
          title: row.title,
          time_estimated: row.time_estimated,
          order_task: row.order_task,
        });
      }
    }

    const response = Object.values(grouped).sort(
      (a, b) => a.order_list - b.order_list
    );

    res.json(response);
  } catch (err) {
    console.error('Errore nel recupero delle task lists:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET one task by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new task
router.post('/', async (req, res) => {
  const { title, description, time_estimated, status,task_list_id } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  if (!time_estimated) return res.status(400).json({ error: 'time_estimated is required' });
  if (!task_list_id) return res.status(400).json({ error: 'task_list_id is required' });
  try {
    const orderQuery = await db.query(
      'SELECT MAX(order_task) AS max_order FROM tasks WHERE task_list_id = $1',
      [task_list_id]
    );
    const maxOrder = orderQuery.rows[0].max_order;
    const newOrder = maxOrder !== null ? maxOrder + 1 : 0;

    // Inserisce la task con il nuovo order_task
    const result = await db.query(
      `INSERT INTO tasks (title, description, time_estimated, order_task, task_list_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, time_estimated, newOrder, task_list_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: `Server error: ${err}` });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, time_estimated, task_list_id } = req.body;

  // Validazioni
  if (!title) return res.status(400).json({ error: 'title is required' });
  if (!time_estimated) return res.status(400).json({ error: 'time_estimated is required' });
  if (!task_list_id) return res.status(400).json({ error: 'task_list_id is required' });

  try {
    const result = await db.query(
      `UPDATE tasks 
       SET title = $1, description = $2, time_estimated = $3, task_list_id = $4 
       WHERE id = $5 
       RETURNING *`,
      [title, description, time_estimated, task_list_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: `Server error: ${err}` });
  }
});

// PUT update position task
router.put('/move-task/:id', async (req, res) => {
  const { id } = req.params;
  const { task_list_id, order_task } = req.body;
  // Validazioni
  if (!task_list_id) return res.status(400).json({ error: 'task_list_id is required' });
  if (order_task === undefined || typeof order_task !== 'number') {
    return res.status(400).json({ error: 'order_task is required and must be a number' });
  }

  try {
    const result = await db.query(
      `UPDATE tasks 
       SET task_list_id = $1, order_task = $2
       WHERE id = $3 
       RETURNING *`,
      [ task_list_id,order_task, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: `Server error: ${err}` });
  }
});


// DELETE task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;