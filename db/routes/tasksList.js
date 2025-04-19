const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all tasksList
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, status, order_list
      FROM tasks_list
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update status task
router.put('/change-order/:id', async (req, res) => {
  const { id } = req.params;
  const { order_list } = req.body;
  // Validazioni
  if (!id) return res.status(400).json({ error: 'id is required' });
  if (order_list === undefined || typeof order_list !== 'number') {
    return res.status(400).json({ error: 'order_list is required and must be a number' });
  }

  try {
    const result = await db.query(
      `UPDATE tasks_list 
       SET order_list = $1
       WHERE id = $2 
       RETURNING *`,
      [ order_list, id]
    );    

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'TasksList not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: `Server error: ${err}` });
  }
});


module.exports = router;