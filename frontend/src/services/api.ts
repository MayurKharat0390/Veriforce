import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
                const response = await axios.post(`${baseURL}auth/refresh/`, {
                    refresh: refreshToken,
                });
                localStorage.setItem('token', response.data.access);
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Video Endpoints
export const videoApi = {
    upload: (formData: FormData) => api.post('videos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    process: (id: number) => api.post(`videos/${id}/process/`),
    status: (id: number) => api.get(`videos/${id}/status/`),
    results: (id: number) => api.get(`analysis/${id}/`),
    exportDossier: (id: number) => api.get(`analysis/${id}/export/`, { responseType: 'blob' })
};

export default api;
