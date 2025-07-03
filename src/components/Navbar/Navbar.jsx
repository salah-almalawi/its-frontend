'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/Auth/AuthProvider';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { logout, isAuthenticated } = useAuth();
    const pathname = usePathname();
    const { t } = useTranslation();

    // Don't show navbar on login page or if not authenticated
    if (!isAuthenticated() || pathname === '/login') {
        return null;
    }

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.navAndBreadcrumbsContainer}>
                <nav className={styles.navLinks}>
                    <Link className={styles.navLink} href="/">
                        لوحة التحكم
                    </Link>
                    <Link className={styles.navLink} href="/managers">
                        المدراء
                    </Link>
                    <Link className={styles.navLink} href="/tours">
                        الجولات
                    </Link>
                </nav>
                <Breadcrumbs />
            </div>
            <div className={styles.logoutButtonContainer}>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    <span className={styles.logoutButtonText}>تسجيل الخروج</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;