'use client';

import { useEffect } from 'react';
import Link from 'next/link';
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
    window.location.href = '/managers/new';
  };

  const handleRowClick = (managerId) => {
    window.location.href = `/managers/${managerId}`;
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
                <p>Loading managers...</p>
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
                <p>Error loading managers: {error}</p>
                <button 
                  onClick={handleRetry}
                  className={styles.retryButton}
                >
                  Try Again
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
              <p className={styles.title}>Managers</p>
              <button
                className={styles.addButton}
                onClick={handleAddManager}
              >
                <span className={styles.buttonText}>Add Manager</span>
              </button>
            </div>
            <div className={styles.tableContainer}>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.headerRow}>
                      <th className={`${styles.headerCell} ${styles.nameColumn}`}>
                        Name
                      </th>
                      <th className={`${styles.headerCell} ${styles.rankColumn}`}>
                        Rank
                      </th>
                      <th className={`${styles.headerCell} ${styles.departmentColumn}`}>
                        Department
                      </th>
                      <th className={`${styles.headerCell} ${styles.actionsColumn}`}>
                        Actions
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
                        <td className={`${styles.dataCell} ${styles.actionsColumn}`}>
                          <div className={styles.actionButtons}>
                            <Link 
                              href={`/managers/${manager._id || manager.id}`}
                              className={styles.viewButton}
                              onClick={(e) => e.stopPropagation()}
                            >
                              View
                            </Link>
                            <Link 
                              href={`/managers/edit/${manager._id || manager.id}`}
                              className={styles.editButton}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {managers.length === 0 && (
                      <tr className={styles.emptyRow}>
                        <td colSpan="4" className={styles.emptyCell}>
                          No managers found. 
                          <button 
                            onClick={handleAddManager}
                            className={styles.addFirstButton}
                          >
                            Add your first manager
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