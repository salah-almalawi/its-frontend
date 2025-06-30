"use client";
import React, { use, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  updateManager,
  deleteManager,
} from "../../../features/managers/managersSlice";
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import api from "../../../api/api";
import useAuth from "../../../hooks/useAuth";
import styles from './page.module.css';

export default function ManagerDetails({ params }) {
  const { id } = use(params);
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useAuth();
  const [manager, setManager] = useState(null);
  const [form, setForm] = useState({ name: "", rank: "", department: "" });
  const [editing, setEditing] = useState(false);

  const isChanged =
    manager &&
    (form.name !== manager.name ||
      form.rank !== String(manager.rank) ||
      form.department !== manager.department);

  const fetchManager = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get(`/managers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setManager(res.data);
      setForm({
        name: res.data.name,
        rank: String(res.data.rank),
        department: res.data.department,
      });
    } catch (err) {
      console.error(err);
    }
  }, [id, token]);

  useEffect(() => {
    fetchManager();
  }, [fetchManager]);

  if (!token) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isChanged) return;
    const data = { ...form, rank: Number(form.rank) };
    await dispatch(updateManager({ id, data }));
    await fetchManager();
    setEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this manager?')) {
      await dispatch(deleteManager(id));
      router.push("/managers");
    }
  };

  if (!manager) {
    return (
      <>
        <Navbar />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Manager Details</h1>
          <Link href="/managers" className={styles.backLink}>
            ← Back to Managers
          </Link>
        </div>

        <div className={styles.detailsCard}>
          {!editing ? (
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Name</span>
                <span className={styles.detailValue}>{manager.name}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Rank</span>
                <span className={styles.detailValue}>{manager.rank}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Department</span>
                <span className={styles.detailValue}>{manager.department}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>Name</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="rank" className={styles.label}>Rank</label>
                <input
                  id="rank"
                  type="number"
                  value={form.rank}
                  onChange={(e) => setForm({ ...form, rank: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="department" className={styles.label}>Department</label>
                <input
                  id="department"
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className={styles.input}
                  required
                />
              </div>
            </form>
          )}

          <div className={styles.buttonGroup}>
            {editing ? (
              <>
                <button 
                  type="submit" 
                  onClick={handleUpdate}
                  disabled={!isChanged}
                  className={`${styles.button} ${styles.saveButton}`}
                >
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      name: manager.name,
                      rank: String(manager.rank),
                      department: manager.department,
                    });
                  }}
                  className={`${styles.button} ${styles.cancelButton}`}
                >
                  ✕ Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  onClick={() => setEditing(true)}
                  className={`${styles.button} ${styles.editButton}`}
                >
                  ✏️ Edit
                </button>
                <button 
                  type="button" 
                  onClick={handleDelete}
                  className={`${styles.button} ${styles.deleteButton}`}
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>

        {manager.lastRounds && (
          <div className={styles.roundsSection}>
            <h2 className={styles.roundsTitle}>Recent Rounds</h2>
            {Array.isArray(manager.lastRounds) && manager.lastRounds.length > 0 ? (
              <table className={styles.roundsTable}>
                <thead className={styles.roundsTableHeader}>
                  <tr>
                    <th className={styles.roundsTableHeaderCell}>Location</th>
                    <th className={styles.roundsTableHeaderCell}>Day</th>
                    <th className={styles.roundsTableHeaderCell}>Year</th>
                    <th className={styles.roundsTableHeaderCell}>Month</th>
                    <th className={styles.roundsTableHeaderCell}>Date</th>
                    <th className={styles.roundsTableHeaderCell}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {manager.lastRounds.map((round) => (
                    <tr key={round._id || round.id} className={styles.roundsTableRow}>
                      <td className={styles.roundsTableCell}>{round.location}</td>
                      <td className={styles.roundsTableCell}>{round.day}</td>
                      <td className={styles.roundsTableCell}>{round.Hijri?.year}</td>
                      <td className={styles.roundsTableCell}>{round.Hijri?.month}</td>
                      <td className={styles.roundsTableCell}>{round.Hijri?.day}</td>
                      <td className={styles.roundsTableCell}>{round.Hijri?.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.noRounds}>
                No rounds recorded for this manager yet.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}