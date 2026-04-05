import { Router } from 'express';
import { getAll, getById, create, getByCustomer } from '../controllers/invoiceController.js';

const router = Router();
router.get('/', getAll);
router.get('/customer/:customerId', getByCustomer);
router.get('/:id', getById);
router.post('/', create);

export default router;