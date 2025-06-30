'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import useAuth from '../../hooks/useAuth';
import api from '../../api/api';
import styles from './page.module.css';

export default function ReportsPage() {
  const token = useAuth();
  const [managers, setManagers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    async function loadManagers() {
      try {
        const res = await api.get('/managers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setManagers(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadManagers();
  }, [token]);

  useEffect(() => {
    if (!token || !selectedId) return;
    async function loadReport() {
      setLoading(true);
      try {
        const res = await api.get(`/managers/${selectedId}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [selectedId, token]);

  if (!token) return null;

  return (
    <>
      <Navbar className="print-hidden" />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>تقارير المديرين</h1>
          <p className={styles.subtitle}>أنشئ تقارير شاملة لأنشطة المديرين والجولات</p>
        </div>

        <div className={styles.controlsSection}>
          <div className={styles.selectGroup}>
            <label htmlFor="manager-select" className={styles.selectLabel}>
              اختر مديراً للتقرير
            </label>
            <select
              id="manager-select"
              className={`${styles.select} print-hidden`}
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="">اختر مديراً...</option>
              {managers.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} - {m.department}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}

        {report && !loading && (
          <div className={styles.reportContainer}>
            <div className={styles.reportHeader}>
              <h2 className={styles.reportTitle}>تقرير نشاط المدير</h2>
              <p className={styles.reportSubtitle}>تم الإنشاء في {new Date().toLocaleDateString()}</p>
            </div>

            <div className={styles.reportContent} id="report">
              <div className={styles.managerInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>الاسم</span>
                  <span className={styles.infoValue}>{report.manager.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>الرتبة</span>
                  <span className={styles.infoValue}>{report.manager.rank}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>القسم</span>
                  <span className={styles.infoValue}>{report.manager.department}</span>
                </div>
              </div>

              <h3 className={`${styles.sectionTitle} ${styles.rounds}`}>الجولات الأخيرة للمدير</h3>
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCell}>الموقع</th>
                    <th className={styles.tableHeaderCell}>اليوم</th>
                    <th className={styles.tableHeaderCell}>السنة</th>
                    <th className={styles.tableHeaderCell}>الشهر</th>
                    <th className={styles.tableHeaderCell}>التاريخ</th>
                    <th className={styles.tableHeaderCell}>الوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {report.manager.lastRounds.map((round) => (
                    <tr key={round._id} className={styles.tableRow}>
                      <td className={`${styles.tableCell} ${styles.location}`}>{round.location}</td>
                      <td className={`${styles.tableCell} ${styles.day}`}>{round.day}</td>
                      <td className={`${styles.tableCell} ${styles.date}`}>{round.Hijri?.year}</td>
                      <td className={`${styles.tableCell} ${styles.date}`}>{round.Hijri?.month}</td>
                      <td className={`${styles.tableCell} ${styles.date}`}>{round.Hijri?.day}</td>
                      <td className={`${styles.tableCell} ${styles.time}`}>{round.Hijri?.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3 className={`${styles.sectionTitle} ${styles.allRounds}`}>أحدث جولات جميع المديرين</h3>
              <table className={styles.table}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCell}>المدير</th>
                    <th className={styles.tableHeaderCell}>الموقع</th>
                    <th className={styles.tableHeaderCell}>اليوم</th>
                    <th className={styles.tableHeaderCell}>السنة</th>
                    <th className={styles.tableHeaderCell}>الشهر</th>
                    <th className={styles.tableHeaderCell}>التاريخ</th>
                    <th className={styles.tableHeaderCell}>الوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((m) => {
                    const last = m.lastRounds?.[0];
                    if (!last)
                      return (
                        <tr key={m._id} className={styles.tableRow}>
                          <td className={`${styles.tableCell} ${styles.manager}`}>{m.name}</td>
                          <td className={styles.tableCell} colSpan="6">
                            لا توجد جولات مسجلة
                          </td>
                        </tr>
                      );
                    return (
                      <tr key={m._id} className={styles.tableRow}>
                        <td className={`${styles.tableCell} ${styles.manager}`}>{m.name}</td>
                        <td className={`${styles.tableCell} ${styles.location}`}>{last.location}</td>
                        <td className={`${styles.tableCell} ${styles.day}`}>{last.day}</td>
                        <td className={`${styles.tableCell} ${styles.date}`}>{last.Hijri?.year}</td>
                        <td className={`${styles.tableCell} ${styles.date}`}>{last.Hijri?.month}</td>
                        <td className={`${styles.tableCell} ${styles.date}`}>{last.Hijri?.day}</td>
                        <td className={`${styles.tableCell} ${styles.time}`}>{last.Hijri?.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button className={`${styles.printButton} print-hidden`} onClick={() => window.print()}>
              طباعة التقرير
            </button>
          </div>
        )}

        {!selectedId && !loading && <div className={styles.noData}>يرجى اختيار مدير لإنشاء التقرير</div>}
      </div>
    </>
  );
}
