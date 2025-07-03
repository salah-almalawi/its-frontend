'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/Auth/AuthProvider';

const AuthGuard = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isReady, setIsReady] = useState(false);

    // List of public routes that don't require authentication
    const publicRoutes = ['/login', '/'];

    useEffect(() => {
        if (!loading) {
            const isPublicRoute = publicRoutes.includes(pathname);

            if (!isAuthenticated() && !isPublicRoute) {
                // Redirect to login if not authenticated and trying to access protected route
                router.push('/login');
                return;
            }

            if (isAuthenticated() && pathname === '/login') {
                // Redirect to dashboard if authenticated and trying to access login
                router.push('/dashboard');
                return;
            }

            // Handle root path redirect
            if (pathname === '/') {
                if (isAuthenticated()) {
                    router.push('/dashboard');
                } else {
                    router.push('/login');
                }
                return;
            }

            setIsReady(true);
        }
    }, [loading, isAuthenticated, pathname, router]);

    // Show loading spinner while checking authentication
    if (loading || !isReady) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontFamily: 'Inter, "Noto Sans", sans-serif',
                gap: '1rem'
            }}>
                <div style={{
                    width: '3rem',
                    height: '3rem',
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '4px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}>
                    Loading...
                </p>
                <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    return children;
};

export default AuthGuard;