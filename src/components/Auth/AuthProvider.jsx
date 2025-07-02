'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const router = useRouter();

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            try {
                const savedToken = localStorage.getItem('authToken');
                const savedUser = localStorage.getItem('userInfo');

                if (savedToken && savedUser) {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear corrupted data
                localStorage.removeItem('authToken');
                localStorage.removeItem('userInfo');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (username, password) => {
        try {
            setLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            const { token } = data;

            // Store token and user info
            localStorage.setItem('authToken', token);
            localStorage.setItem('userInfo', JSON.stringify({ username }));

            setToken(token);
            setUser({ username });

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message || 'Login failed'
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, password) => {
        try {
            setLoading(true);

            // First, we need to get an admin token to register
            // In a real app, you'd handle this differently
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // This would need admin privileges
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            return { success: true, token: data.token };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.message || 'Registration failed'
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Call logout endpoint (optional since it's just a dummy endpoint)
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage and state regardless of API call result
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            setToken(null);
            setUser(null);
            router.push('/login');
        }
    };

    const isAuthenticated = () => {
        return !!(token && user);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};