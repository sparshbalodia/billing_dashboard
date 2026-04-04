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

-- Seed customers
INSERT INTO customers (cust_id, name, address, pan, gst, is_active) VALUES
('C00001', 'Gupta Enterprize Pvt. Ltd.',    'Gurgaon, Haryana',           'BCNSG1234H', '06BCNSG1234H1Z5', TRUE),
('C00002', 'Mahesh Industries Pvt. Ltd.',   'Delhi, Delhi',               'AMNSM1234U', '07AMNSM1234U1Z5', TRUE),
('C00003', 'Omkar and Brothers Pvt. Ltd.',  'Uttrakhand, Uttar Pradesh',  'CNBSO1234S', '05CNBSO1234S1Z5', FALSE),
('C00004', 'Bhuwan Infotech.',              'Alwar, Rajasthan',           'CMNSB1234A', '08CMNSB1234A1Z5', TRUE),
('C00005', 'Swastik Software Pvt. Ltd.',    'Gurgaon, Haryana',           'AGBCS1234B', '06AGBCS1234B1Z5', TRUE);

-- Seed items
INSERT INTO items (item_id, name, price, is_active) VALUES
('IT00001', 'Laptop',       85000, TRUE),
('IT00002', 'LED Monitor',  13450, TRUE),
('IT00003', 'Pen Drive',    980,   TRUE),
('IT00004', 'Mobile Phone', 18900, TRUE),
('IT00005', 'Headphones',   2350,  FALSE),
('IT00006', 'Bagpack',      1200,  TRUE),
('IT00007', 'Powerbank',    1400,  TRUE);