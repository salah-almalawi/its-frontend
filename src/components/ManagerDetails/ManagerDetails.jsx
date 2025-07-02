'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ManagerDetails.module.css';

const ManagerDetails = ({
    manager = {
        id: 1,
        name: "Ethan Harper",
        rank: "Senior Manager",
        department: "Engineering",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAELfAdKb1wG7uxw2Xy2lEC-I7U4_FMFGRnyF7ZIW2bE6WXzBu7NEM3Gxbdh36VDSsTxIuqfsKvO6QwZLoqdVtqwyec7ZoTvN017_7LLmLk5GokM-01VQglYNffrMkXNW-vqpJ4RIeylsRjO-wpPveREw4mNBFKhkyD0k-iB1_jN9b1E-lV0TKKLzs5_qEieBLTpheEScPoExypXx8zdQsRi-JVrJEHZzpHouiKG-ZBJJZinwTTzaACsLhPFb7m2Yj86wlqJn__fvfQ"
    },
    rounds = [
        {
            id: 1,
            location: "Office A",
            day: "Monday",
            hijriDate: "1445-08-20 10:00"
        }
    ],
    onUpdate,
    onDelete,
    onPrintReport
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handlePrintReport = () => {
        if (onPrintReport) {
            onPrintReport(manager);
        } else {
            // Default print functionality
            window.print();
        }
    };

    const handleUpdate = () => {
        if (onUpdate) {
            onUpdate(manager);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            if (onDelete) {
                await onDelete(manager.id);
            }
        } catch (error) {
            console.error('Error deleting manager:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.layoutContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.layoutContentContainer}>
                        {/* Breadcrumb */}
                        <div className={styles.breadcrumb}>
                            <Link href="/managers" className={styles.breadcrumbLink}>
                                Managers
                            </Link>
                            <span className={styles.breadcrumbSeparator}>/</span>
                            <span className={styles.breadcrumbCurrent}>Manager Details</span>
                        </div>

                        {/* Page Header */}
                        <div className={styles.headerContainer}>
                            <div className={styles.headerContent}>
                                <p className={styles.title}>Manager Details</p>
                                <p className={styles.subtitle}>
                                    View and manage details for this manager.
                                </p>
                            </div>
                        </div>

                        {/* Manager Profile */}
                        <div className={styles.profileContainer}>
                            <div className={styles.profileContent}>
                                <div className={styles.profileInfo}>
                                    <div className={styles.avatarContainer}>
                                        <Image
                                            src={manager.avatar}
                                            alt={`${manager.name} avatar`}
                                            width={128}
                                            height={128}
                                            className={styles.avatar}
                                        />
                                    </div>
                                    <div className={styles.managerInfo}>
                                        <p className={styles.managerName}>{manager.name}</p>
                                        <p className={styles.managerRole}>
                                            {manager.rank}, {manager.department}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Manager Information Section */}
                        <h2 className={styles.sectionTitle}>Manager Information</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoRow}>
                                <p className={styles.infoLabel}>Rank</p>
                                <p className={styles.infoValue}>{manager.rank}</p>
                            </div>
                            <div className={styles.infoRow}>
                                <p className={styles.infoLabel}>Department</p>
                                <p className={styles.infoValue}>{manager.department}</p>
                            </div>
                        </div>

                        {/* Last Rounds Section */}
                        <h2 className={styles.sectionTitle}>Last Rounds</h2>
                        <div className={styles.tableContainer}>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr className={styles.headerRow}>
                                            <th className={`${styles.headerCell} ${styles.locationColumn}`}>
                                                Location
                                            </th>
                                            <th className={`${styles.headerCell} ${styles.dayColumn}`}>
                                                Day
                                            </th>
                                            <th className={`${styles.headerCell} ${styles.dateColumn}`}>
                                                Hijri Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rounds.map((round) => (
                                            <tr key={round.id} className={styles.dataRow}>
                                                <td className={`${styles.dataCell} ${styles.locationColumn}`}>
                                                    {round.location}
                                                </td>
                                                <td className={`${styles.dataCell} ${styles.dayColumn}`}>
                                                    {round.day}
                                                </td>
                                                <td className={`${styles.dataCell} ${styles.dateColumn}`}>
                                                    {round.hijriDate}
                                                </td>
                                            </tr>
                                        ))}
                                        {rounds.length === 0 && (
                                            <tr className={styles.emptyRow}>
                                                <td colSpan="3" className={styles.emptyCell}>
                                                    No rounds available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={styles.actionsContainer}>
                            <div className={styles.leftActions}>
                                <button
                                    onClick={handlePrintReport}
                                    className={styles.printButton}
                                >
                                    <span className={styles.buttonText}>Print Report</span>
                                </button>
                            </div>

                            <div className={styles.rightActions}>
                                <button
                                    onClick={handleDeleteClick}
                                    className={styles.deleteButton}
                                    disabled={isDeleting}
                                >
                                    <span className={styles.buttonText}>
                                        {isDeleting ? 'Deleting...' : 'Delete Manager'}
                                    </span>
                                </button>

                                <button
                                    onClick={handleUpdate}
                                    className={styles.updateButton}
                                >
                                    <span className={styles.buttonText}>Update Manager</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Confirm Delete</h3>
                        </div>
                        <div className={styles.modalBody}>
                            <p className={styles.modalText}>
                                Are you sure you want to delete <strong>{manager.name}</strong>?
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                onClick={handleDeleteCancel}
                                className={styles.modalCancelButton}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className={styles.modalDeleteButton}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerDetails;