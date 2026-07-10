import api from './api';

const repairService = {
  getAll: (params) => api.get('/repairs', { params }),
  getOne: (id) => api.get(`/repairs/${id}`),
  create: (data) => api.post('/repairs', data),
  update: (id, data) => api.put(`/repairs/${id}`, data),
  updateStatus: (id, status) => api.patch(`/repairs/${id}/status`, { status }),
  track: (token) => api.get(`/repairs/track/${token}`),
};

export default repairService;