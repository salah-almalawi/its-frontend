'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/Auth/AuthProvider';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Don't show navbar on login page or if not authenticated
    if (!isAuthenticated() || pathname === '/login') {
        return null;
    }

    const handleLogout = async () => {
        setIsLoggingOut(true);
        setShowUserMenu(false);

        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const isActivePath = (path) => {
        return pathname === path || pathname.startsWith(path + '/');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                {/* Logo/Brand */}
                <div className={styles.navBrand}>
                    <Link href="/managers" className={styles.brandLink}>
                        <span className={styles.brandText}>ITS System</span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className={styles.navLinks}>
                    <Link
                        href="/managers"
                        className={`${styles.navLink} ${isActivePath('/managers') ? styles.navLinkActive : ''}`}
                    >
                        Managers
                    </Link>
                    <Link
                        href="/managers/new"
                        className={`${styles.navLink} ${isActivePath('/managers/new') ? styles.navLinkActive : ''}`}
                    >
                        Add Manager
                    </Link>
                </div>

                {/* User Menu */}
                <div className={styles.userMenu}>
                    <button
                        onClick={toggleUserMenu}
                        className={styles.userButton}
                        disabled={isLoggingOut}
                    >
                        <div className={styles.userAvatar}>
                            <span className={styles.userInitial}>
                                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <span className={styles.username}>{user?.username || 'User'}</span>
                        <svg
                            className={`${styles.dropdownIcon} ${showUserMenu ? styles.dropdownIconRotated : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownContent}>
                                <div className={styles.userInfo}>
                                    <p className={styles.userInfoName}>{user?.username}</p>
                                    <p className={styles.userInfoRole}>Manager</p>
                                </div>
                                <div className={styles.dropdownDivider}></div>
                                <button
                                    onClick={handleLogout}
                                    className={styles.logoutButton}
                                    disabled={isLoggingOut}
                                >
                                    <svg className={styles.logoutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Overlay to close dropdown */}
                    {showUserMenu && (
                        <div
                            className={styles.overlay}
                            onClick={() => setShowUserMenu(false)}
                        ></div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;