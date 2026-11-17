import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export const fetchModels = () => api.get('/models');

export const fetchEvaluation = () => api.get('/evaluation');

export const fetchModelEvaluation = (modelId) => api.get(`/evaluation/${modelId}`);

export const fetchConfusionMatrix = (modelId) => api.get(`/evaluation/${modelId}/confusion-matrix`);

export const predictDisease = (formData) =>
  api.post('/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const checkHealth = () => api.get('/health');

export default api;
