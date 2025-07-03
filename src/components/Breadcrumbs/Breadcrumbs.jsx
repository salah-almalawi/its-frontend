// src/components/Breadcrumbs/Breadcrumbs.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/redux';
import { selectCurrentManager } from '@/store/slices/managerSlice';
import { selectCurrentRound } from '@/store/slices/roundsSlice';
import { formatHijriDate } from '@/utils/api';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = () => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  const currentManager = useAppSelector(selectCurrentManager);
  const currentRound = useAppSelector(selectCurrentRound);

  // دالة للحصول على الأيقونة المناسبة لكل مسار
  const getIconForSegment = (segment) => {
    const icons = {
      dashboard: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z" fill="currentColor"/>
        </svg>
      ),
      managers: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
        </svg>
      ),
      tours: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
        </svg>
      ),
      new: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
        </svg>
      ),
      edit: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
        </svg>
      )
    };
    return icons[segment] || null;
  };

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    let label = t(segment.charAt(0).toUpperCase() + segment.slice(1));

    // Check if the current segment is 'edit' and the previous is 'managers'
    if (segment === 'edit' && pathSegments[index - 1] === 'managers') {
      label = t('Edit');
    }
    // Check if the current segment is an ID for manager or tour
    else if (pathSegments[index - 1] === 'managers' && currentManager && segment === currentManager._id) {
      label = currentManager.name;
    } else if (pathSegments[index - 2] === 'managers' && pathSegments[index - 1] === 'edit' && currentManager && segment === currentManager._id) {
      label = currentManager.name;
    }
    else if (pathSegments[index - 1] === 'tours' && currentRound && segment === currentRound._id) {
      label = formatHijriDate(currentRound.Hijri);
    }
    const icon = getIconForSegment(segment);

    return (
      <span key={href} className={styles.breadcrumbItem}>
        {!isLast ? (
          <Link href={href} className={styles.breadcrumbLink}>
            {icon && <span className={styles.breadcrumbIcon}>{icon}</span>}
            <span className={styles.breadcrumbLabel}>{label}</span>
          </Link>
        ) : (
          <span className={styles.breadcrumbCurrent}>
            {icon && <span className={styles.breadcrumbIcon}>{icon}</span>}
            <span className={styles.breadcrumbLabel}>{label}</span>
          </span>
        )}
        {!isLast && (
          <span className={styles.breadcrumbSeparator}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z" fill="currentColor"/>
            </svg>
          </span>
        )}
      </span>
    );
  });

  if (pathname === '/login') {
    return null;
  }

  if (pathname === '/') {
    return (
      <div className={styles.breadcrumbContainer}>
        <span className={styles.breadcrumbCurrent}>
          <span className={styles.breadcrumbIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
            </svg>
          </span>
          <span className={styles.breadcrumbLabel}>{t('Home')}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={styles.breadcrumbContainer}>
      {/* Home icon */}
      <Link href="/" className={styles.breadcrumbLink}>
        <span className={styles.breadcrumbIcon}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
          </svg>
        </span>
        <span className={styles.breadcrumbLabel}>{t('Home')}</span>
      </Link>
      {pathSegments.length > 0 && (
        <span className={styles.breadcrumbSeparator}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z" fill="currentColor"/>
          </svg>
        </span>
      )}
      {breadcrumbItems}
    </div>
  );
};

export default Breadcrumbs