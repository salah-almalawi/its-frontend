'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
    fetchRounds,
    selectRounds,
    selectRoundsLoading,
    selectRoundsError,
    clearError
} from '@/store/slices/roundsSlice';
import styles from './RoundsTable.module.css';

const RoundsTable = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    // Redux state
    const rounds = useAppSelector(selectRounds);
    const loading = useAppSelector(selectRoundsLoading);
    const error = useAppSelector(selectRoundsError);

    // Fetch rounds on component mount
    useEffect(() => {
        dispatch(fetchRounds());
    }, [dispatch]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearError('rounds'));
        };
    }, [dispatch]);

    const handleAddRound = () => {
        router.push('/tours/new');
    };

    const handleRowClick = (roundId) => {
        router.push(`/tours/${roundId}`);
    };

    const handleRetry = () => {
        dispatch(clearError('rounds'));
        dispatch(fetchRounds());
    };

    // Loading state
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.layoutContainer}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.layoutContentContainer}>
                            <div className={styles.loadingContainer}>
                                <div className={styles.loader}></div>
                                <p>جاري تحميل الجولات...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.layoutContainer}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.layoutContentContainer}>
                            <div className={styles.errorContainer}>
                                <p>خطأ في تحميل الجولات: {error}</p>
                                <button
                                    onClick={handleRetry}
                                    className={styles.retryButton}
                                >
                                    إعادة المحاولة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.layoutContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.layoutContentContainer}>
                        <div className={styles.header}>
                            <p className={styles.title}>جولات التفتيش</p>
                            <button
                                className={styles.addButton}
                                onClick={handleAddRound}
                            >
                                <span className={styles.buttonText}>إضافة جولة</span>
                            </button>
                        </div>
                        <div className={styles.tableContainer}>
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr className={styles.headerRow}>
                                            <th className={`${styles.headerCell} ${styles.managerColumn}`}>
                                                اسم المدير
                                            </th>
                                            <th className={`${styles.headerCell} ${styles.locationColumn}`}>
                                                الموقع
                                            </th>
                                            <th className={`${styles.headerCell} ${styles.dayColumn}`}>
                                                اليوم
                                            </th>
                                            <th className={`${styles.headerCell} ${styles.dateColumn}`}>
                                                التاريخ الهجري (السنة/الشهر/اليوم)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rounds.map((round) => (
                                            <tr
                                                key={round._id || round.id}
                                                className={styles.dataRow}
                                                onClick={() => handleRowClick(round._id || round.id)}
                                            >
                                                <td className={`${styles.dataCell} ${styles.managerColumn} ${styles.nameCell}`}>
                                                    {round.managerName || 'غير محدد'}
                                                </td>
                                                <td className={`${styles.dataCell} ${styles.locationColumn} ${styles.secondaryCell}`}>
                                                    {round.location}
                                                </td>
                                                <td className={`${styles.dataCell} ${styles.dayColumn} ${styles.secondaryCell}`}>
                                                    {round.day}
                                                </td>
                                                <td className={`${styles.dataCell} ${styles.dateColumn} ${styles.secondaryCell}`}>
                                                    {round.Hijri ? `${round.Hijri.year}/${round.Hijri.month}/${round.Hijri.day}` : 'غير محدد'}
                                                </td>
                                            </tr>
                                        ))}
                                        {rounds.length === 0 && (
                                            <tr className={styles.emptyRow}>
                                                <td colSpan="4" className={styles.emptyCell}>
                                                    لا توجد جولات.
                                                    <button
                                                        onClick={handleAddRound}
                                                        className={styles.addFirstButton}
                                                    >
                                                        إضافة أول جولة
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoundsTable;