'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  // Redux state
  const managers = useAppSelector(selectManagers);
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
                <p>{t("Loading managers...")}</p>
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
                <p>{t("Error loading managers: {{error}}", { error })}</p>
                <button 
                  onClick={handleRetry}
                  className={styles.retryButton}
                >
                  {t("Try Again")}
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
              <p className={styles.title}>{t("Managers")}</p>
              <button
                className={styles.addButton}
                onClick={handleAddManager}
              >
                <span className={styles.buttonText}>{t("Add Manager")}</span>
              </button>
            </div>
            <div className={styles.tableContainer}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.headerRow}>
                      <th className={`${styles.headerCell} ${styles.nameColumn}`}>
                        {t("Name")}
                      </th>
                      <th className={`${styles.headerCell} ${styles.rankColumn}`}>
                        {t("Rank")}
                      </th>
                      <th className={`${styles.headerCell} ${styles.departmentColumn}`}>
                        {t("Department")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {managers.map((manager) => (
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
                    {managers.length === 0 && (
                      <tr className={styles.emptyRow}>
                        <td colSpan="3" className={styles.emptyCell}>
                          {t("No managers found.")} 
                          <button 
                            onClick={handleAddManager}
                            className={styles.addFirstButton}
                          >
                            {t("Add your first manager")}
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