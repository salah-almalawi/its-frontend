import axios from 'axios';
import MySwal from '../utils/swal';

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

        let errorMessage = 'حدث خطأ غير متوقع.';
        let errorTitle = 'خطأ!';

        if (error.response) {
            const { status, data } = error.response;
            errorMessage = data?.message || `خطأ في الخادم: ${status}`;

            switch (status) {
                case 401:
                    errorTitle = 'غير مصرح به!';
                    errorMessage = 'انتهت صلاحية جلستك أو ليس لديك إذن. الرجاء تسجيل الدخول مرة أخرى.';
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('userInfo');
                        if (window.location.pathname !== '/login') {
                            window.location.href = '/login';
                        }
                    }
                    break;
                case 403:
                    errorTitle = 'ممنوع!';
                    errorMessage = 'ليس لديك إذن للوصول إلى هذا المورد.';
                    break;
                case 404:
                    errorTitle = 'غير موجود!';
                    errorMessage = 'المورد المطلوب غير موجود.';
                    break;
                case 429:
                    errorTitle = 'طلبات كثيرة جداً!';
                    errorMessage = 'لقد أرسلت طلبات كثيرة جداً في فترة زمنية قصيرة. الرجاء المحاولة مرة أخرى لاحقاً.';
                    break;
                case 500:
                    errorTitle = 'خطأ في الخادم!';
                    errorMessage = 'حدث خطأ داخلي في الخادم. الرجاء المحاولة مرة أخرى لاحقاً.';
                    break;
                case 503:
                    errorTitle = 'الخدمة غير متاحة!';
                    errorMessage = 'الخادم غير قادر حالياً على التعامل مع الطلب. الرجاء المحاولة مرة أخرى لاحقاً.';
                    break;
                default:
                    errorTitle = `خطأ HTTP ${status}!`;
                    errorMessage = data?.message || `حدث خطأ في الخادم بحالة ${status}.`;
            }
        } else if (error.request) {
            errorTitle = 'خطأ في الشبكة!';
            errorMessage = 'تعذر الاتصال بالخادم. الرجاء التحقق من اتصالك بالإنترنت.';
        } else {
            errorTitle = 'خطأ في الطلب!';
            errorMessage = `حدث خطأ أثناء إعداد الطلب: ${error.message}`;
        }

        MySwal.fire({
            icon: 'error',
            title: errorTitle,
            text: errorMessage,
            confirmButtonText: 'موافق'
        });

        return Promise.reject(new Error(errorMessage));
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