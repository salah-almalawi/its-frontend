'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    const label = t(segment.charAt(0).toUpperCase() + segment.slice(1)); // Translate the segment

    return (
      <span key={href} className={styles.breadcrumbItem}>
        <Link href={href} className={styles.breadcrumbLink}>
          {label}
        </Link>
        {!isLast && <span className={styles.breadcrumbSeparator}>/</span>}
      </span>
    );
  });

  if (pathname === '/' || pathname === '/login') {
    return null; // Don't show breadcrumbs on home or login page
  }

  return (
    <div className={styles.breadcrumbContainer}>
      <Link href="/" className={styles.breadcrumbLink}>
        {t('Home')}
      </Link>
      <span className={styles.breadcrumbSeparator}>/</span>
      {breadcrumbItems}
    </div>
  );
};

export default Breadcrumbs;
