import api from './api';

const userService = {
  updateProfile: (data) => api.put('/users/profile', data),
  getTeam: () => api.get('/users/team'),
  addMember: (data) => api.post('/users/team', data),
  updateMember: (id, data) => api.put(`/users/team/${id}`, data),
  removeMember: (id) => api.delete(`/users/team/${id}`),
};

export default userService;