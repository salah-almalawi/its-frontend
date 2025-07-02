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
            router.push('/managers');
        }
    }, [loading, isAuthenticated, router]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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
                setApiError(result.error || 'Login failed');
            }
        } catch (error) {
            setApiError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Don't render login form if already authenticated
    if (isAuthenticated()) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <div className={styles.logoContainer}>
                    <h1 className={styles.title}>ITS System</h1>
                    <p className={styles.subtitle}>Inspection Tours Management</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.formTitle}>Sign In</h2>

                    {apiError && (
                        <div className={styles.errorAlert}>
                            <p className={styles.errorMessage}>{apiError}</p>
                        </div>
                    )}

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                            Username
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`${styles.textInput} ${errors.username ? styles.inputError : ''}`}
                                placeholder="Enter your username"
                                disabled={isSubmitting}
                            />
                            {errors.username && (
                                <span className={styles.fieldError}>{errors.username}</span>
                            )}
                        </label>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                            Password
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`${styles.textInput} ${errors.password ? styles.inputError : ''}`}
                                placeholder="Enter your password"
                                disabled={isSubmitting}
                            />
                            {errors.password && (
                                <span className={styles.fieldError}>{errors.password}</span>
                            )}
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className={styles.loadingText}>
                                <span className={styles.spinner}></span>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Welcome to the Inspection Tours Management System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;