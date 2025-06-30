'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchRounds } from '../../features/rounds/roundsSlice';
import Navbar from '../../components/Navbar';
import useAuth from '../../hooks/useAuth';
import styles from './page.module.css';

export default function RoundsPage() {
  const dispatch = useDispatch();
  const token = useAuth();
  const { items, status } = useSelector((state) => state.rounds);

  useEffect(() => {
    dispatch(fetchRounds());
  }, [dispatch]);

  if (!token) return null;

  const totalRounds = items.length;
  const uniqueManagers = new Set(items.map((round) => round.managerName)).size;
  const uniqueLocations = new Set(items.map((round) => round.location)).size;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>إدارة الجولات</h1>
          <Link href="/rounds/create" className={styles.addButton}>
            إضافة جولة جديدة
          </Link>
        </div>

        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{totalRounds}</span>
            <span className={styles.statLabel}>إجمالي الجولات</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{uniqueManagers}</span>
            <span className={styles.statLabel}>المديرون النشطون</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{uniqueLocations}</span>
            <span className={styles.statLabel}>المواقع</span>
          </div>
        </div>

        {status === 'loading' ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
          </div>
        ) : items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🔄</div>
            <h3 className={styles.emptyStateTitle}>لا توجد جولات</h3>
            <p className={styles.emptyStateDescription}>
              ابدأ بتتبع الجولات بإضافة أول جولة.
            </p>
            <Link href="/rounds/create" className={styles.addButton}>
              إنشاء أول جولة
            </Link>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>المدير</th>
                  <th className={styles.tableHeaderCell}>القسم</th>
                  <th className={styles.tableHeaderCell}>الرتبة</th>
                  <th className={styles.tableHeaderCell}>الموقع</th>
                  <th className={styles.tableHeaderCell}>اليوم</th>
                  <th className={styles.tableHeaderCell}>السنة</th>
                  <th className={styles.tableHeaderCell}>الشهر</th>
                  <th className={styles.tableHeaderCell}>التاريخ</th>
                  <th className={styles.tableHeaderCell}>الوقت</th>
                </tr>
              </thead>
              <tbody>
                {items.map((round) => (
                  <tr key={round._id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <Link
                        href={`/rounds/${round._id}`}
                        className={styles.managerLink}
                      >
                        {round.managerName}
                      </Link>
                    </td>
                    <td className={styles.tableCell}>{round.managerDepartment}</td>
                    <td className={styles.tableCell}>{round.managerRank}</td>
                    <td className={`${styles.tableCell} ${styles.locationCell}`}>
                      {round.location}
                    </td>
                    <td className={`${styles.tableCell} ${styles.dayCell}`}>
                      {round.day}
                    </td>
                    <td className={`${styles.tableCell} ${styles.dateCell}`}>
                      {round.Hijri?.year}
                    </td>
                    <td className={`${styles.tableCell} ${styles.dateCell}`}>
                      {round.Hijri?.month}
                    </td>
                    <td className={`${styles.tableCell} ${styles.dateCell}`}>
                      {round.Hijri?.day}
                    </td>
                    <td className={`${styles.tableCell} ${styles.timeCell}`}>
                      {round.Hijri?.time}
                    </td>
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
