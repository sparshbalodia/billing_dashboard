import pool from '../config/db.js';

const generateInvoiceId = () => 'INVC' + Math.floor(100000 + Math.random() * 900000);

export const getAll = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, c.name AS customer_name
      FROM invoices i
      JOIN customers c ON i.customer_id = c.cust_id
      ORDER BY i.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const inv = await pool.query(`
      SELECT i.*, c.name AS customer_name, c.address, c.pan, c.gst
      FROM invoices i
      JOIN customers c ON i.customer_id = c.cust_id
      WHERE i.invoice_id = $1
    `, [id]);

    if (!inv.rows.length) return res.status(404).json({ error: 'Invoice not found' });

    const lineItems = await pool.query(`
      SELECT ii.*, it.name AS item_name
      FROM invoice_items ii
      JOIN items it ON ii.item_id = it.item_id
      WHERE ii.invoice_id = $1
    `, [id]);

    res.json({ ...inv.rows[0], items: lineItems.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req, res) => {
  const { customer_id, items } = req.body;
  if (!customer_id || !items?.length)
    return res.status(400).json({ error: 'customer_id and items are required' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const custResult = await client.query(
      'SELECT gst FROM customers WHERE cust_id = $1', [customer_id]
    );
    if (!custResult.rows.length) throw new Error('Customer not found');

    const gst_registered = !!custResult.rows[0].gst;
    const subtotal = items.reduce((sum, it) => sum + it.unit_price * it.quantity, 0);
    const gst_amount = gst_registered ? 0 : subtotal * 0.18;
    const total = subtotal + gst_amount;
    const invoice_id = generateInvoiceId();

    await client.query(
      `INSERT INTO invoices (invoice_id, customer_id, subtotal, gst_amount, total, gst_applied)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [invoice_id, customer_id, subtotal, gst_amount, total, !gst_registered]
    );

    for (const it of items) {
      await client.query(
        `INSERT INTO invoice_items (invoice_id, item_id, quantity, unit_price, amount)
         VALUES ($1,$2,$3,$4,$5)`,
        [invoice_id, it.item_id, it.quantity, it.unit_price, it.unit_price * it.quantity]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ invoice_id, total });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

export const getByCustomer = async (req, res) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query(`
      SELECT i.*, c.name AS customer_name
      FROM invoices i
      JOIN customers c ON i.customer_id = c.cust_id
      WHERE i.customer_id = $1
      ORDER BY i.created_at DESC
    `, [customerId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};