import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1/analyze',
});

export const analyzeApi = {
    // 계약서 분석 요청
    uploadContract: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/contract', formData);
    },
    // 전체 히스토리 조회
    getHistory: () => api.get('/history'),
    // 상세 내역 조회
    getDetail: (id) => api.get(`/history/${id}`),
};