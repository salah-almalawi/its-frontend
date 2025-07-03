'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchManagers,
  selectManagers,
  selectManagersLoading,
  selectManagersError,
  clearError
} from '@/store/slices/managerSlice';
import styles from './ManagersTable.module.css';

const ManagersTable = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Redux state
  const managers = useAppSelector(selectManagers);
  const uniqueManagers = Array.from(new Map(managers.map(manager => [manager._id || manager.id, manager])).values());
  const loading = useAppSelector(selectManagersLoading);
  const error = useAppSelector(selectManagersError);

  // Fetch managers on component mount
  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError('managers'));
    };
  }, [dispatch]);

  const handleAddManager = () => {
    router.push('/managers/new');
  };

  const handleRowClick = (managerId) => {
    router.push(`/managers/${managerId}`);
  };

  const handleRetry = () => {
    dispatch(clearError('managers'));
    dispatch(fetchManagers());
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
                <p>جاري تحميل المديرين...</p>
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
                <p>خطأ في تحميل المديرين: {error}</p>
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
              <p className={styles.title}>المديرين</p>
              <button
                className={styles.addButton}
                onClick={handleAddManager}
              >
                <span className={styles.buttonText}>إضافة مدير</span>
              </button>
            </div>
            <div className={styles.tableContainer}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.headerRow}>
                      <th className={`${styles.headerCell} ${styles.nameColumn}`}>
                        الاسم
                      </th>
                      <th className={`${styles.headerCell} ${styles.rankColumn}`}>
                        الرتبة
                      </th>
                      <th className={`${styles.headerCell} ${styles.departmentColumn}`}>
                        القسم
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueManagers.map((manager) => (
                      <tr 
                        key={manager._id || manager.id} 
                        className={styles.dataRow}
                        onClick={() => handleRowClick(manager._id || manager.id)}
                      >
                        <td className={`${styles.dataCell} ${styles.nameColumn} ${styles.nameCell}`}>
                          {manager.name}
                        </td>
                        <td className={`${styles.dataCell} ${styles.rankColumn} ${styles.secondaryCell}`}>
                          {manager.rank}
                        </td>
                        <td className={`${styles.dataCell} ${styles.departmentColumn} ${styles.secondaryCell}`}>
                          {manager.department}
                        </td>
                      </tr>
                    ))}
                    {uniqueManagers.length === 0 && (
                      <tr className={styles.emptyRow}>
                        <td colSpan="4" className={styles.emptyCell}>
                          لا توجد مديرين.
                          <button 
                            onClick={handleAddManager}
                            className={styles.addFirstButton}
                          >
                            إضافة أول مدير
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

export default ManagersTable;