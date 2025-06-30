"use client";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  const token = useAuth();

  if (!token) return null;
  
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>ITS Management System</h1>
            <p className={styles.subtitle}>
              Streamline your operations with our comprehensive management platform. 
              Track managers, monitor rounds, and generate detailed reports with ease.
            </p>
            <div className={styles.quickActions}>
              <Link href="/managers" className={styles.actionButton}>
                Manage Team
              </Link>
              <Link href="/rounds" className={`${styles.actionButton} ${styles.secondary}`}>
                View Rounds
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👥</div>
            <h3 className={styles.featureTitle}>Manager Management</h3>
            <p className={styles.featureDescription}>
              Efficiently manage your team members, track their information, and monitor their activities in real-time.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔄</div>
            <h3 className={styles.featureTitle}>Round Tracking</h3>
            <p className={styles.featureDescription}>
              Keep detailed records of all rounds, including locations, timing, and manager assignments for complete oversight.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Comprehensive Reports</h3>
            <p className={styles.featureDescription}>
              Generate detailed reports and analytics to gain insights into operations and make data-driven decisions.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}