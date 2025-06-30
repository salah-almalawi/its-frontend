'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import {
  fetchManagers,
  createManager,
} from '../../features/managers/managersSlice';
import Navbar from '../../components/Navbar';
import useAuth from '../../hooks/useAuth';
import styles from './page.module.css';

export default function ManagersPage() {
  const dispatch = useDispatch();
  const token = useAuth();
  const { items, status } = useSelector((state) => state.managers);
  const [form, setForm] = useState({ name: '', rank: '', department: '' });

  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  if (!token) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, rank: Number(form.rank) };
    await dispatch(createManager(data));
    setForm({ name: '', rank: '', department: '' });
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>المديرون</h1>
        </div>

        <div className={styles.createSection}>
          <h2 className={styles.createTitle}>إضافة مدير جديد</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                الاسم
              </label>
              <input
                id="name"
                type="text"
                placeholder="أدخل اسم المدير"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="rank" className={styles.label}>
                الرتبة
              </label>
              <input
                id="rank"
                type="number"
                placeholder="أدخل الرتبة"
                value={form.rank}
                onChange={(e) => setForm({ ...form, rank: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="department" className={styles.label}>
                القسم
              </label>
              <input
                id="department"
                type="text"
                placeholder="أدخل القسم"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className={styles.input}
                required
              />
            </div>
            <button type="submit" className={styles.createButton}>
              إنشاء مدير
            </button>
          </form>
        </div>

        {status === 'loading' ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>👥</div>
            <h3 className={styles.emptyStateTitle}>لا يوجد مديرون</h3>
            <p className={styles.emptyStateDescription}>
              ابدأ بإضافة أول مدير باستخدام النموذج أعلاه.
            </p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>الاسم</th>
                  <th className={styles.tableHeaderCell}>القسم</th>
                  <th className={styles.tableHeaderCell}>الرتبة</th>
                </tr>
              </thead>
              <tbody>
                {items.map((manager) => (
                  <tr key={manager._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <Link
                        href={`/managers/${manager._id}`}
                        className={styles.managerLink}
                      >
                        {manager.name}
                      </Link>
                    </td>
                    <td className={styles.tableCell}>{manager.department}</td>
                    <td className={styles.tableCell}>{manager.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
