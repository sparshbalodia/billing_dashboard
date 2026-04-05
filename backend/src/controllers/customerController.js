import pool from '../config/db.js';

export const getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req, res) => {
  const { name, address, pan, gst, is_active } = req.body;
  if (!name || !pan) return res.status(400).json({ error: 'Name and PAN are required' });

  try {
    const last = await pool.query("SELECT cust_id FROM customers ORDER BY cust_id DESC LIMIT 1");
    const lastNum = last.rows.length ? parseInt(last.rows[0].cust_id.replace('C', '')) + 1 : 1;
    const cust_id = 'C' + String(lastNum).padStart(5, '0');

    const result = await pool.query(
      `INSERT INTO customers (cust_id, name, address, pan, gst, is_active)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [cust_id, name, address, pan, gst || null, is_active ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};