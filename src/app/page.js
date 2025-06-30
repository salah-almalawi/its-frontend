'use client';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';
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
            <h1 className={styles.title}>نظام إدارة ITS</h1>
            <p className={styles.subtitle}>
              سهِّل عملياتك مع منصتنا الشاملة لإدارة النظام. تتبع المديرين، راقب
              الجولات، واستخرج التقارير التفصيلية بسهولة.
            </p>
            <div className={styles.quickActions}>
              <Link href="/managers" className={styles.actionButton}>
                إدارة الفريق
              </Link>
              <Link
                href="/rounds"
                className={`${styles.actionButton} ${styles.secondary}`}
              >
                عرض الجولات
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>إدارة المديرين</h3>
            <p className={styles.featureDescription}>
              قم بإدارة أعضاء فريقك بكفاءة، وتابع معلوماتهم، وراقب نشاطهم لحظة
              بلحظة.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>متابعة الجولات</h3>
            <p className={styles.featureDescription}>
              احتفظ بسجلات مفصلة لكل الجولات بما في ذلك المواقع والتوقيت
              وتعيينات المديرين لمتابعة شاملة.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>تقارير شاملة</h3>
            <p className={styles.featureDescription}>
              أنشئ تقارير مفصلة وإحصائيات للحصول على رؤى حول العمليات واتخاذ
              قرارات مبنية على البيانات.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
