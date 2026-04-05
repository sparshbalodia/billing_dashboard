import pool from '../config/db.js';

export const getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req, res) => {
  const { name, price, is_active } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Name and price are required' });

  try {
    const last = await pool.query("SELECT item_id FROM items ORDER BY item_id DESC LIMIT 1");
    const lastNum = last.rows.length ? parseInt(last.rows[0].item_id.replace('IT', '')) + 1 : 1;
    const item_id = 'IT' + String(lastNum).padStart(5, '0');

    const result = await pool.query(
      `INSERT INTO items (item_id, name, price, is_active) VALUES ($1,$2,$3,$4) RETURNING *`,
      [item_id, name, price, is_active ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};