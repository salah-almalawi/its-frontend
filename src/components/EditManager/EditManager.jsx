'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { clearError } from '@/store/slices/managerSlice';
import styles from './EditManager.module.css';

const EditManager = ({ manager = null, onSave, onCancel, isSubmitting = false, error = null }) => {
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    name: manager?.name || '',
    rank: manager?.rank || '',
    department: manager?.department || ''
  });

  const [formErrors, setFormErrors] = useState({});

  const rankOptions = [
    { value: '', label: 'Select Rank' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Senior Manager', label: 'Senior Manager' },
    { value: 'Director', label: 'Director' },
    { value: 'Senior Director', label: 'Senior Director' },
    { value: 'VP', label: 'Vice President' }
  ];

  // Update form data when manager prop changes
  useEffect(() => {
    if (manager) {
      setFormData({
        name: manager.name || '',
        rank: manager.rank || '',
        department: manager.department || ''
      });
    }
  }, [manager]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError('update'));
    };
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.rank) {
      newErrors.rank = 'Rank is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear form error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear Redux error when user starts typing
    if (error) {
      dispatch(clearError('update'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (onSave) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    dispatch(clearError('update'));
    
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.layoutContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.layoutContentContainer}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
              <Link href="/managers" className={styles.breadcrumbLink}>
                Managers
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>Edit Manager</span>
            </div>

            {/* Page Title */}
            <div className={styles.titleContainer}>
              <p className={styles.title}>Edit Manager</p>
            </div>

            {/* Global Error Message */}
            {error && (
              <div className={styles.errorContainer}>
                <div className={styles.errorMessage}>
                  {error}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className={styles.fieldContainer}>
                <label className={styles.fieldLabel}>
                  <p className={styles.labelText}>Name</p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${styles.textInput} ${formErrors.name ? styles.inputError : ''}`}
                    placeholder="Enter manager name"
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.name && (
                    <span className={styles.fieldErrorMessage}>{formErrors.name}</span>
                  )}
                </label>
              </div>

              {/* Rank Field */}
              <div className={styles.fieldContainer}>
                <label className={styles.fieldLabel}>
                  <p className={styles.labelText}>Rank</p>
                  <select
                    name="rank"
                    value={formData.rank}
                    onChange={handleInputChange}
                    className={`${styles.selectInput} ${formErrors.rank ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                    required
                  >
                    {rankOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.rank && (
                    <span className={styles.fieldErrorMessage}>{formErrors.rank}</span>
                  )}
                </label>
              </div>

              {/* Department Field */}
              <div className={styles.fieldContainer}>
                <label className={styles.fieldLabel}>
                  <p className={styles.labelText}>Department</p>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`${styles.textInput} ${formErrors.department ? styles.inputError : ''}`}
                    placeholder="Enter department"
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.department && (
                    <span className={styles.fieldErrorMessage}>{formErrors.department}</span>
                  )}
                </label>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionsContainer}>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={styles.cancelButton}
                    disabled={isSubmitting}
                  >
                    <span className={styles.buttonText}>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className={styles.updateButton}
                    disabled={isSubmitting}
                  >
                    <span className={styles.buttonText}>
                      {isSubmitting ? 'Updating...' : 'Update'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditManager;