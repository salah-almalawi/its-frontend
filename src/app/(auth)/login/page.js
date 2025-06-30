'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../features/auth/authSlice';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: '', password: '' });

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(login(form));
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>مرحباً بعودتك</h1>
        <p className={styles.subtitle}>سجّل الدخول إلى حسابك للمتابعة</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>
              اسم المستخدم
            </label>
            <input
              id="username"
              type="text"
              placeholder="أدخل اسم المستخدم"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              placeholder="أدخل كلمة المرور"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className={styles.submitButton}
          >
            {status === 'loading' && (
              <span className={styles.loadingSpinner}></span>
            )}
            {status === 'loading' ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>

          {error && (
            <div className={styles.errorMessage}>
              فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مرة أخرى.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
