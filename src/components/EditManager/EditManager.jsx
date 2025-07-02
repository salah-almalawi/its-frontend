'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { clearError } from '@/store/slices/managerSlice';
import { useTranslation } from 'react-i18next';
import styles from './EditManager.module.css';

const EditManager = ({ manager = null, onSave, onCancel, isSubmitting = false, error = null }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: manager?.name || '',
    rank: manager?.rank?.toString() || '', // تحويل الرقم إلى نص للعرض
    department: manager?.department || ''
  });

  const [formErrors, setFormErrors] = useState({});

  // خيارات الـ rank من 1 إلى 16
  const rankOptions = [
    { value: '', label: t('Select rank') },
    ...Array.from({ length: 16 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Rank ${i + 1}`
    }))
  ];

  // Update form data when manager prop changes
  useEffect(() => {
    if (manager) {
      setFormData({
        name: manager.name || '',
        rank: manager.rank?.toString() || '', // تحويل الرقم إلى نص للعرض
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
      newErrors.name = t('Name is required');
    }

    if (!formData.rank) {
      newErrors.rank = t('Rank is required');
    }

    if (!formData.department.trim()) {
      newErrors.department = t('Department is required');
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
                {t("Managers")}
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>{t("Edit Manager")}</span>
            </div>

            {/* Page Title */}
            <div className={styles.titleContainer}>
              <p className={styles.title}>{t("Edit Manager")}</p>
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
                  <p className={styles.labelText}>{t("Name")}</p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${styles.textInput} ${formErrors.name ? styles.inputError : ''}`}
                    placeholder={t("Enter manager name")}
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
                  <p className={styles.labelText}>{t("Rank")}</p>
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
                  <p className={styles.labelText}>{t("Department")}</p>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`${styles.textInput} ${formErrors.department ? styles.inputError : ''}`}
                    placeholder={t("Enter department")}
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
                    <span className={styles.buttonText}>{t("Cancel")}</span>
                  </button>
                  <button
                    type="submit"
                    className={styles.updateButton}
                    disabled={isSubmitting}
                  >
                    <span className={styles.buttonText}>
                      {isSubmitting ? t('Updating...') : t('Update')}
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