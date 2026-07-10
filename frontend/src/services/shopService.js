import api from './api';

const shopService = {
  getAll: () => api.get('/shops'),
  getOne: (id) => api.get(`/shops/${id}`),
  create: (data) => api.post('/shops', data),
  update: (id, data) => api.put(`/shops/${id}`, data),
  remove: (id) => api.delete(`/shops/${id}`),
};

export default shopService;