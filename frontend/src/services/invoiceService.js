import api from './api';

const invoiceService = {
  getAll: (params) => api.get('/invoices', { params }),
  getOne: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  markAsPaid: (id, data) => api.patch(`/invoices/${id}/pay`, data),
};

export default invoiceService;