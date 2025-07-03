'use client';

import styles from './Dashboard.module.css';

const Dashboard = () => {
    return (
        <div className={styles.container}>
            <div className={styles.layoutContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.layoutContentContainer}>
                        <div className={styles.header}>
                            <p className={styles.title}>Dashboard</p>
                        </div>

                        <h2 className={styles.sectionTitle}>Quick Actions</h2>
                        <div className={styles.actionsContainer}>
                            <div className={styles.actionGroup}>
                                <button className={styles.primaryButton}>
                                    <span className={styles.buttonText}>Create Account</span>
                                </button>
                                <button className={styles.secondaryButton}>
                                    <span className={styles.buttonText}>Create Manager</span>
                                </button>
                            </div>
                        </div>

                        <div className={styles.singleActionContainer}>
                            <button className={styles.primaryButton}>
                                <span className={styles.buttonText}>Create Inspection Round</span>
                            </button>
                        </div>

                        <h2 className={styles.sectionTitle}>Summary</h2>
                        <div className={styles.summaryContainer}>
                            <div className={styles.summaryCard}>
                                <p className={styles.cardTitle}>Total Managers</p>
                                <p className={styles.cardValue}>12</p>
                            </div>
                            <div className={styles.summaryCard}>
                                <p className={styles.cardTitle}>Total Inspection Rounds</p>
                                <p className={styles.cardValue}>34</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;