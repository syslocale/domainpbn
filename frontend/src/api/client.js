import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// PBN API
export const pbnAPI = {
  getPublic: (params) => apiClient.get('/pbn', { params }),
  getAll: () => apiClient.get('/admin/pbn'),
  create: (data) => apiClient.post('/admin/pbn', data),
  update: (id, data) => apiClient.put(`/admin/pbn/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/pbn/${id}`),
};

// Packages API
export const packagesAPI = {
  getPublic: () => apiClient.get('/packages'),
  getAll: () => apiClient.get('/admin/packages'),
  create: (data) => apiClient.post('/admin/packages', data),
  update: (id, data) => apiClient.put(`/admin/packages/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/packages/${id}`),
};

// Blog API
export const blogAPI = {
  getList: (params) => apiClient.get('/blog', { params }),
  getBySlug: (slug) => apiClient.get(`/blog/${slug}`),
  getAll: () => apiClient.get('/admin/blog'),
  create: (data) => apiClient.post('/admin/blog', data),
  update: (id, data) => apiClient.put(`/admin/blog/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/blog/${id}`),
};

// FAQ API
export const faqAPI = {
  getPublic: () => apiClient.get('/faq'),
  getAll: () => apiClient.get('/admin/faq'),
  create: (data) => apiClient.post('/admin/faq', data),
  update: (id, data) => apiClient.put(`/admin/faq/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/faq/${id}`),
};

// Pages API
export const pagesAPI = {
  getBySlug: (slug) => apiClient.get(`/pages/${slug}`),
  getAll: () => apiClient.get('/admin/pages'),
  create: (data) => apiClient.post('/admin/pages', data),
  update: (id, data) => apiClient.put(`/admin/pages/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/pages/${id}`),
};

// Settings API
export const settingsAPI = {
  get: () => apiClient.get('/settings'),
  update: (data) => apiClient.put('/admin/settings', data),
};

export default apiClient;