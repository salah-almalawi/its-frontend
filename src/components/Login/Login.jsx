'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Auth/AuthProvider';
import styles from './Login.module.css';

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
            router.push('/dashboard');
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
                // Redirect to dashboard page
                router.push('/dashboard');
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
            <div className={styles.container}>
                <div className={styles.layoutContainer}>
                    <div className={styles.loadingWrapper}>
                        <div className={styles.loadingSpinner}></div>
                        <p className={styles.loadingText}>جاري التحميل...</p>
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
        <div className={styles.container}>
            <div className={styles.layoutContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.layoutContentContainer}>
                        <h2 className={styles.title}>تسجيل الدخول</h2>

                        {apiError && (
                            <div className={styles.errorContainer}>
                                <p className={styles.errorMessage}>{apiError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className={styles.fieldContainer}>
                                <label className={styles.fieldLabel}>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="اسم المستخدم"
                                        className={`${styles.formInput} ${errors.username ? styles.inputError : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.username && (
                                        <span className={styles.fieldErrorMessage}>{errors.username}</span>
                                    )}
                                </label>
                            </div>

                            <div className={styles.fieldContainer}>
                                <label className={styles.fieldLabel}>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="كلمة المرور"
                                        className={`${styles.formInput} ${errors.password ? styles.inputError : ''}`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.password && (
                                        <span className={styles.fieldErrorMessage}>{errors.password}</span>
                                    )}
                                </label>
                            </div>

                            <div className={styles.buttonContainer}>
                                <button
                                    type="submit"
                                    className={styles.loginButton}
                                    disabled={isSubmitting}
                                >
                                    <span className={styles.buttonText}>
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