import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor للتوكن أو headers إضافية
api.interceptors.request.use(
    (config) => {
        // إضافة authorization token إذا كان متوفر
        const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor للتعامل مع الأخطاء والاستجابات
api.interceptors.response.use(
    (response) => {
        console.log(`Response received from: ${response.config.url}`, response.status);
        return response;
    },
    (error) => {
        console.error('API Error:', error);

        // التعامل مع أخطاء مختلفة
        if (error.response) {
            // الخادم رد بحالة خطأ
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // غير مصرح له - إعادة توجيه للتسجيل
                    console.error('Unauthorized access');
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('userInfo');
                        // Only redirect if not already on login page
                        if (window.location.pathname !== '/login') {
                            window.location.href = '/login';
                        }
                    }
                    break;
                case 403:
                    // ممنوع
                    console.error('Access forbidden');
                    break;
                case 404:
                    // غير موجود
                    console.error('Resource not found');
                    break;
                case 500:
                    // خطأ في الخادم
                    console.error('Internal server error');
                    break;
                default:
                    console.error(`HTTP Error ${status}:`, data?.message || 'Unknown error');
            }

            // إرجاع رسالة خطأ مفهومة
            const errorMessage = data?.message || `HTTP Error ${status}`;
            return Promise.reject(new Error(errorMessage));

        } else if (error.request) {
            // الطلب تم إرساله لكن لا توجد استجابة
            console.error('No response received:', error.request);
            return Promise.reject(new Error('Network error - please check your connection'));

        } else {
            // شيء آخر حدث خطأ
            console.error('Request setup error:', error.message);
            return Promise.reject(error);
        }
    }
);

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userInfo');
    return !!(token && user);
};

// Helper function to get current user
export const getCurrentUser = () => {
    if (typeof window === 'undefined') return null;
    try {
        const userInfo = localStorage.getItem('userInfo');
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        console.error('Error parsing user info:', error);
        return null;
    }
};

// Helper function to clear authentication data
export const clearAuthData = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
    }
};

export default api;