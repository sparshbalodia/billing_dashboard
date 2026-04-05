# Billing Dashboard (LogiEdge Assessment)

A full-stack billing dashboard for generating and managing customer invoices.

---
## Tech Stack

**Frontend**
- React 18 (Vite)
- Tailwind CSS v4
- React Router v6
- Axios

**Backend** 
- Node.js + Express.js
- PostgreSQL

---

## Features

**Master Module**
- View all customers and items
- Add new customers with PAN and GST details
- Add new items with selling price
- Active / Inactive status management

**Billing Module**
- 3-step invoice flow — select customer => select items => preview and confirm
- Quantity control per item
- Auto-generated invoice ID (format: INVC + 6 digits)
- GST logic — exempt if customer is GST registered, 18% applied if not

**Dashboard module**
- View all generated invoices
- Search by invoice ID or customer name
- Click any invoice to view full details in a side panel
---

## Project Structure

```text
billing_dashboard/
|-- frontend/
    |-- src/
        |-- components/
        |-- pages/
        |-- services/
        |-- context/
        |-- utils/

|-- backend/
    |-- src/
        |-- controllers/
        |-- routes/
        |-- config/
        |-- db/
    |-- database/
        |-- schema.sql
```
---

## Setup Instructions

### 1. Clone the Repo/ Download code as zip

```
git clone https://github.com/sparshbalodia/billing_dashboard.git
cd billing_dashboard
```

### 2. DB Setup

```bash
# create the database
psql -U postgres -c "CREATE DATABASE billing"

# run the schema
psql -U postgres -d billing -f backend/database/schema.sql
```

### 3. Backend Setup

```
cd backend
npm install
```
Create `.env` file in the `backend/` folder:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_pwd
DB_NAME=billing
```

Start the server:
```bash
npm run dev
```
Server runs at `http://localhost:5000`

### 4. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
App runs at `http://localhost:5174`

>No `.env` needed for development unless your backend runs on different port.
---

## API Endpoints

Base URL: `http://localhost:5000/api`

- GET `/api/customers` - Get all customers  
- POST `/api/customers` - create a customer  
- GET `/api/items` - Get all items  
- POST `/api/items` - Create an item  
- GET `/api/invoices` - Get all invoices  
- GET `/api/invoices/:id` - Get invoice by ID 
- POST `/api/invoices` - Create an invoice  
- POST `/api/invoices/customer/:id` - Get invoices by customer
---
## Deployement

**Frontend** : Vercel
**Backend** : Render
**Database** :Render PostgreSQl

**Live URL:** 
---
## License

This project was built as part of an assignment for LogiEdge Systems.