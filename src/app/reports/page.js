"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";
import api from "../../api/api";
import styles from './page.module.css';

export default function ReportsPage() {
    const token = useAuth();
    const [managers, setManagers] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) return;
        async function loadManagers() {
            try {
                const res = await api.get("/managers", {
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
                    <h1 className={styles.title}>Manager Reports</h1>
                    <p className={styles.subtitle}>
                        Generate comprehensive reports for manager activities and rounds
                    </p>
                </div>

                <div className={styles.controlsSection}>
                    <div className={styles.selectGroup}>
                        <label htmlFor="manager-select" className={styles.selectLabel}>
                            Select Manager for Report
                        </label>
                        <select
                            id="manager-select"
                            className={`${styles.select} print-hidden`}
                            value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value)}
                        >
                            <option value="">Choose a manager...</option>
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
                            <h2 className={styles.reportTitle}>Manager Activity Report</h2>
                            <p className={styles.reportSubtitle}>
                                Generated on {new Date().toLocaleDateString()}
                            </p>
                        </div>

                        <div className={styles.reportContent} id="report">
                            <div className={styles.managerInfo}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Name</span>
                                    <span className={styles.infoValue}>{report.manager.name}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Rank</span>
                                    <span className={styles.infoValue}>{report.manager.rank}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Department</span>
                                    <span className={styles.infoValue}>{report.manager.department}</span>
                                </div>
                            </div>

                            <h3 className={`${styles.sectionTitle} ${styles.rounds}`}>
                                Manager's Recent Rounds
                            </h3>
                            <table className={styles.table}>
                                <thead className={styles.tableHeader}>
                                    <tr>
                                        <th className={styles.tableHeaderCell}>Location</th>
                                        <th className={styles.tableHeaderCell}>Day</th>
                                        <th className={styles.tableHeaderCell}>Year</th>
                                        <th className={styles.tableHeaderCell}>Month</th>
                                        <th className={styles.tableHeaderCell}>Date</th>
                                        <th className={styles.tableHeaderCell}>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.manager.lastRounds.map((round) => (
                                        <tr key={round._id} className={styles.tableRow}>
                                            <td className={`${styles.tableCell} ${styles.location}`}>
                                                {round.location}
                                            </td>
                                            <td className={`${styles.tableCell} ${styles.day}`}>
                                                {round.day}
                                            </td>
                                            <td className={`${styles.tableCell} ${styles.date}`}>
                                                {round.Hijri?.year}
                                            </td>
                                            <td className={`${styles.tableCell} ${styles.date}`}>
                                                {round.Hijri?.month}
                                            </td>
                                            <td className={`${styles.tableCell} ${styles.date}`}>
                                                {round.Hijri?.day}
                                            </td>
                                            <td className={`${styles.tableCell} ${styles.time}`}>
                                                {round.Hijri?.time}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <h3 className={`${styles.sectionTitle} ${styles.allRounds}`}>
                                All Managers' Latest Rounds
                            </h3>
                            <table className={styles.table}>
                                <thead className={styles.tableHeader}>
                                    <tr>
                                        <th className={styles.tableHeaderCell}>Manager</th>
                                        <th className={styles.tableHeaderCell}>Location</th>
                                        <th className={styles.tableHeaderCell}>Day</th>
                                        <th className={styles.tableHeaderCell}>Year</th>
                                        <th className={styles.tableHeaderCell}>Month</th>
                                        <th className={styles.tableHeaderCell}>Date</th>
                                        <th className={styles.tableHeaderCell}>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {managers.map((m) => {
                                        const last = m.lastRounds?.[0];
                                        if (!last) return (
                                            <tr key={m._id} className={styles.tableRow}>
                                                <td className={`${styles.tableCell} ${styles.manager}`}>
                                                    {m.name}
                                                </td>
                                                <td className={styles.tableCell} colSpan="6">
                                                    No rounds recorded
                                                </td>
                                            </tr>
                                        );
                                        return (
                                            <tr key={m._id} className={styles.tableRow}>
                                                <td className={`${styles.tableCell} ${styles.manager}`}>
                                                    {m.name}
                                                </td>
                                                <td className={`${styles.tableCell} ${styles.location}`}>
                                                    {last.location}
                                                </td>
                                                <td className={`${styles.tableCell} ${styles.day}`}>
                                                    {last.day}
                                                </td>
                                                <td className={`${styles.tableCell} ${styles.date}`}>
                                                    {last.Hijri?.year}
                                                </td>
                                                <td className={`${styles.tableCell} ${styles.date}`}>
                                                    {last.Hijri?.month}
                                                </td>
                                                <td className={`${styles.tableCell} ${styles.date}`}>
                                                    {last.Hijri?.day}
                                                </td>
                                                <td className={`${styles.tableCell} ${styles.time}`}>
                                                    {last.Hijri?.time}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <button 
                            className={`${styles.printButton} print-hidden`} 
                            onClick={() => window.print()}
                        >
                            Print Report
                        </button>
                    </div>
                )}

                {!selectedId && !loading && (
                    <div className={styles.noData}>
                        Please select a manager to generate a report
                    </div>
                )}
            </div>
        </>
    );
}