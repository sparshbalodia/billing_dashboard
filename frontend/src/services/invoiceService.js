import api from './api.js';

export const getInvoices = ()=> api.get('/invoices');
export const getInvoiceById= (id)=> api.get(`/invoices/${id}`);
export const getInvoicesByCustomer = (customerId) => api.get(`/invoices/customer/${customerId}`);
export const createInvoice= (data)=> api.post('/invoices', data);