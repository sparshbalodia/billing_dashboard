import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import customerRoutes from './routes/customerRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5174',
    process.env.FRONTEND_URL,
  ],
  credentials: true,
}));

app.use(express.json());

/*Root Route*/
app.get("/", (req, res) => {
  res.send("Billing Dashboard Backend Running");
});

/*API Routes*/
app.use('/api/customers', customerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/invoices', invoiceRoutes);

/*Error Handler*/
app.use(errorHandler);

export default app;