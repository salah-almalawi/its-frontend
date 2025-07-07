'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import MySwal from '@/utils/swal';

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
    const { t } = useTranslation();

    const [isDeleting, setIsDeleting] = useState(false);

    const handlePrintReport = async () => {
        MySwal.fire({
            title: t('Create Report'),
            html: `
                <input id="day" class="swal2-input" placeholder="${t('Day')}">
                <input id="year" class="swal2-input" placeholder="${t('Hijri Year')}">
                <input id="month" class="swal2-input" placeholder="${t('Hijri Month')}">
                <input id="date_day" class="swal2-input" placeholder="${t('Hijri Day')}">
            `,
            confirmButtonText: t('Generate'),
            showCancelButton: true,
            cancelButtonText: t('Cancel'),
            preConfirm: () => {
                const day = document.getElementById('day').value;
                const year = document.getElementById('year').value;
                const month = document.getElementById('month').value;
                const date_day = document.getElementById('date_day').value;
                if (!day || !year || !month || !date_day) {
                    MySwal.showValidationMessage(t('Please fill all fields'));
                    return false;
                }
                return { day, date: { year, month, day: date_day } };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { day, date } = result.value;
                try {
                    const response = await fetch(`http://localhost:3000/api/managers/${manager.id}/generate-report`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ day, date }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const blob = await response.blob();
                    const fileURL = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = fileURL;
                    const contentDisposition = response.headers.get('content-disposition');
                    let filename = 'output.docx';
                    if (contentDisposition) {
                        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                        if (filenameMatch.length > 1) {
                            filename = filenameMatch[1];
                        }
                    }
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);

                    MySwal.fire({
                        icon: 'success',
                        title: t('تم إنشاء التقرير بنجاح!'),
                        text: t('تم تنزيل التقرير.'),
                        confirmButtonText: t('موافق')
                    });
                } catch (error) {
                    console.error('Error generating report:', error);
                    MySwal.fire({
                        icon: 'error',
                        title: t('خطأ في إنشاء التقرير!'),
                        text: t('فشل إنشاء التقرير. الرجاء المحاولة مرة أخرى.'),
                        confirmButtonText: t('موافق')
                    });
                }
            }
        });
    };

    const handleUpdate = () => {
        if (onUpdate) {
            onUpdate(manager);
        }
    };

    const handleDeleteClick = () => {
        MySwal.fire({
            title: t("Confirm Delete"),
            text: t("Are you sure you want to delete {{managerName}}? This action cannot be undone.", { managerName: manager.name }),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: t('Delete'),
            cancelButtonText: t('Cancel')
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsDeleting(true);
                try {
                    if (onDelete) {
                        await onDelete(manager.id);
                        MySwal.fire(
                            t('تم الحذف!'),
                            t('تم حذف المدير بنجاح.'),
                            'success'
                        );
                    }
                } catch (error) {
                    console.error('Error deleting manager:', error);
                    MySwal.fire(
                        t('Error!'),
                        t('Failed to delete manager.'),
                        'error'
                    );
                } finally {
                    setIsDeleting(false);
                }
            }
        });
    };



    return (
        <div className={styles.container}>
            <div className={styles.layoutContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.layoutContentContainer}>
                        {/* Breadcrumb */}


                        {/* Page Header */}
                        <div className={styles.headerContainer}>
                            <div className={styles.headerContent}>
                                <p className={styles.title}>{t("Manager Details")}</p>
                                <p className={styles.subtitle}>
                                    {t("View and manage details for this manager.")}
                                </p>
                            </div>
                        </div>

                        {/* Manager Information Section */}
                        <h2 className={styles.sectionTitle}>{t("Manager Information")}</h2>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoRow}>
                                <p className={styles.infoLabel}>{t("Name")}</p>
                                <p className={styles.infoValue}>{manager.name}</p>
                            </div>
                            <div className={styles.infoRow}>
                                <p className={styles.infoLabel}>{t("Rank")}</p>
                                <p className={styles.infoValue}>{manager.rank}</p>
                            </div>
                            <div className={styles.infoRow}>
                                <p className={styles.infoLabel}>{t("Department")}</p>
                                <p className={styles.infoValue}>{manager.department}</p>
                            </div>
                        </div>

                        {/* Last Rounds Section */}
                        <h2 className={styles.sectionTitle}>{t("Last Rounds")}</h2>
                        <div className={styles.tableContainer}>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr className={styles.headerRow}>
                                            <th className={`${styles.headerCell} ${styles.locationColumn}`}>
                                                {t("Location")}
                                            </th>
                                            <th className={`${styles.headerCell} ${styles.dayColumn}`}>
                                                {t("Day")}
                                            </th>
                                            <th className={`${styles.headerCell} ${styles.dateColumn}`}>
                                                {t("Hijri Date")}
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
                                                    {t("No rounds available")}
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
                                    <span className={styles.buttonText}>{t("Create Report")}</span>
                                </button>
                            </div>

                            <div className={styles.rightActions}>
                                <button
                                    onClick={handleDeleteClick}
                                    className={styles.deleteButton}
                                    disabled={isDeleting}
                                >
                                    <span className={styles.buttonText}>
                                        {isDeleting ? t('Deleting...') : t('Delete Manager')}
                                    </span>
                                </button>

                                <button
                                    onClick={handleUpdate}
                                    className={styles.updateButton}
                                >
                                    <span className={styles.buttonText}>{t("Update Manager")}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ManagerDetails;
