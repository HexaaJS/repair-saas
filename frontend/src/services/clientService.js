import api from './api';

const clientService = {
  getAll: () => api.get('/clients'),
  getOne: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  search: (q) => api.get(`/clients/search?q=${q}`),
};

export default clientService;