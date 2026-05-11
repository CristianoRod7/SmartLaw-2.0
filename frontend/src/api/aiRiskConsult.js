import axios from 'axios';
import { apiUrl } from '../config/api';

const api = axios.create({
  baseURL: apiUrl('/api/ai-risk-consult'),
  timeout: 30000,
});

export const aiRiskConsultApi = {
  consult: (message, context = {}) => api.post('', { message, context }),
};
