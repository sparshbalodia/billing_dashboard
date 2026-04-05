-- Customers master
CREATE TABLE customers (
  id          SERIAL PRIMARY KEY,
  cust_id     VARCHAR(10) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  address     TEXT,
  pan         VARCHAR(10),
  gst         VARCHAR(15),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Items master
CREATE TABLE items (
  id          SERIAL PRIMARY KEY,
  item_id     VARCHAR(10) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id          SERIAL PRIMARY KEY,
  invoice_id  VARCHAR(10) UNIQUE NOT NULL,
  customer_id VARCHAR(10) REFERENCES customers(cust_id),
  subtotal    NUMERIC(10,2) NOT NULL,
  gst_amount  NUMERIC(10,2) DEFAULT 0,
  total       NUMERIC(10,2) NOT NULL,
  gst_applied BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Invoice line items
CREATE TABLE invoice_items (
  id          SERIAL PRIMARY KEY,
  invoice_id  VARCHAR(10) REFERENCES invoices(invoice_id),
  item_id     VARCHAR(10) REFERENCES items(item_id),
  quantity    INT NOT NULL,
  unit_price  NUMERIC(10,2) NOT NULL,
  amount      NUMERIC(10,2) NOT NULL
);
