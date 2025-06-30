'use client';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import useAuth from '../hooks/useAuth';
import useHasMounted from '../hooks/useHasMounted';
import styles from './Navbar.module.css';
import { useState } from 'react';

export default function Navbar({ className = '' }) {
  const dispatch = useDispatch();
  const token = useAuth(false);
  const mounted = useHasMounted();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!mounted) return null;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`${styles.navbar} ${className}`}>
      <div className={styles.navContainer}>
        <button
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>

        <ul className={`${styles.navList} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
          <li className={styles.navItem}>
            <Link href="/" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
              الصفحة الرئيسية
            </Link>
          </li>

          {token ? (
            <>
              <li className={styles.navItem}>
                <Link
                  href="/register"
                  className={styles.navLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  إنشاء مستخدم
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/managers"
                  className={styles.navLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  المديرون
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/rounds"
                  className={styles.navLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  الجولات
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/reports"
                  className={styles.navLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  التقارير
                </Link>
              </li>
              <li className={styles.navItem}>
                <button
                  className={styles.logoutButton}
                  onClick={() => {
                    dispatch(logout());
                    setMobileMenuOpen(false);
                  }}
                >
                  تسجيل الخروج
                </button>
              </li>
            </>
          ) : (
            <li className={styles.navItem}>
              <Link
                href="/login"
                className={styles.navLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                تسجيل الدخول
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
