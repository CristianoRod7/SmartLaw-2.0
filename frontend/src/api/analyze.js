import axios from 'axios';
import { apiUrl } from '../config/api';

const api = axios.create({
    baseURL: apiUrl('/api/v1/analyze'),
});

export const analyzeApi = {
    // 계약서 분석 요청
    uploadContract: (file, industry = 'general', documentType = '일반 계약서') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('industry', industry);
        formData.append('document_type', documentType);

        return api.post('/contract', formData);
    },

    // 전체 히스토리 조회
    getHistory: () => api.get('/history'),

    // 상세 내역 조회
    getDetail: (id) => api.get(`/history/${id}`),
};