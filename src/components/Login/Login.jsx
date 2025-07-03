'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Auth/AuthProvider';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');

    const router = useRouter();
    const { login, isAuthenticated, loading } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (!loading && isAuthenticated()) {
            router.push('/managers');
        }
    }, [loading, isAuthenticated, router]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'اسم المستخدم مطلوب';
        }

        if (!formData.password) {
            newErrors.password = 'كلمة المرور مطلوبة';
        } else if (formData.password.length < 6) {
            newErrors.password = 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear API error when user starts typing
        if (apiError) {
            setApiError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setApiError('');

        try {
            const result = await login(formData.username, formData.password);

            if (result.success) {
                // Redirect to managers page
                router.push('/managers');
            } else {
                setApiError(result.error || 'فشل تسجيل الدخول');
            }
        } catch (error) {
            setApiError('حدث خطأ غير متوقع');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
                style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
                <div className="layout-container flex h-full grow flex-col">
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                            <p className="mt-4 text-gray-700">جاري التحميل...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Don't render login form if already authenticated
    if (isAuthenticated()) {
        return null;
    }

    return (
        <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"                 style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
            <div className="layout-container flex h-full grow flex-col">
                <div className="flex flex-1 justify-center items-center p-5 md:p-10">
                    <div className="flex flex-col max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                            <p className="text-[#111518] tracking-[-0.025em] text-2xl font-bold leading-tight min-w-72 text-center">تسجيل الدخول</p>
                        </div>

                        {apiError && (
                            <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg border-l-4 border-red-500">
                                <p className="text-red-700 text-sm font-medium">{apiError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col max-w-full flex-wrap items-end gap-4 py-3">
                                <label className="flex flex-col min-w-40 flex-1">
                                    <p className="text-[#111518] text-base font-medium leading-normal pb-2">اسم المستخدم</p>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="أدخل اسم المستخدم"
                                        className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border border-[#dbe1e6] bg-white h-14 px-4 text-base font-normal leading-normal text-[#111518] transition-all duration-200 ease-in-out focus:outline-none focus:border-[#dbe1e6] focus:shadow-none text-right ${errors.username ? 'border-red-500 bg-red-50' : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.username && (
                                        <span className="text-red-500 text-sm font-normal mt-1 text-right">{errors.username}</span>
                                    )}
                                </label>
                            </div>

                            <div className="flex flex-col max-w-full flex-wrap items-end gap-4 py-3">
                                <label className="flex flex-col min-w-40 flex-1">
                                    <p className="text-[#111518] text-base font-medium leading-normal pb-2">كلمة المرور</p>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="أدخل كلمة المرور"
                                        className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl border border-[#dbe1e6] bg-white h-14 px-4 text-base font-normal leading-normal text-[#111518] transition-all duration-200 ease-in-out focus:outline-none focus:border-[#dbe1e6] focus:shadow-none text-right ${errors.password ? 'border-red-500 bg-red-50' : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.password && (
                                        <span className="text-red-500 text-sm font-normal mt-1 text-right">{errors.password}</span>
                                    )}
                                </label>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="flex min-w-24 max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 text-sm font-bold leading-normal tracking-wide border-none bg-[#0b80ee] text-white transition-all duration-200 ease-in-out hover:bg-[#0969da] hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                    disabled={isSubmitting}
                                >
                                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                        {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;