'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import styles from './Dashboard.module.css';
import { fetchManagers } from '@/store/slices/managerSlice';
import { fetchRounds } from '@/store/slices/roundsSlice';

const Dashboard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const managers = useSelector((state) => state.managers.managers);
    const rounds = useSelector((state) => state.rounds.rounds);

    useEffect(() => {
        dispatch(fetchManagers());
        dispatch(fetchRounds());
    }, [dispatch]);

    return (
        <div className={styles.container}>
            <div className={styles.layoutContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.layoutContentContainer}>
                        <div className={styles.header}>
                            <p className={styles.title}>{t('Dashboard')}</p>
                        </div>

                        <h2 className={styles.sectionTitle}>{t('Quick Actions')}</h2>
                        <div className={styles.actionsContainer}>
                            <div className={styles.actionGroup}>
                                <Link href="/register" passHref>
                                    <button className={styles.primaryButton}>
                                        <span className={styles.buttonText}>{t('Create Account')}</span>
                                    </button>
                                </Link>
                                <Link href="/managers" passHref>
                                    <button className={styles.secondaryButton}>
                                        المدراء
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className={styles.singleActionContainer}>
                            <Link href="/tours" passHref>
                                <button className={styles.primaryButton}>
                                    الجولات
                                </button>
                            </Link>
                        </div>

                        <h2 className={styles.sectionTitle}>{t('Summary')}</h2>
                        <div className={styles.summaryContainer}>
                            <div className={styles.summaryCard}>
                                <p className={styles.cardTitle}>{t('Total Managers')}</p>
                                <p className={styles.cardValue}>{managers.length}</p>
                            </div>
                            <div className={styles.summaryCard}>
                                <p className={styles.cardTitle}>{t('Total Inspection Rounds')}</p>
                                <p className={styles.cardValue}>{rounds.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;