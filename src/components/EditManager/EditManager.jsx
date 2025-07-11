'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { clearError } from '@/store/slices/managerSlice';
import MySwal from '@/utils/swal';
import styles from './EditManager.module.css';

const EditManager = ({ manager = null, onSave, onCancel, isSubmitting = false, error = null }) => {
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    name: manager?.name || '',
    rank: manager?.rank?.toString() || '', // تحويل الرقم إلى نص للعرض
    department: manager?.department || ''
  });

  const [formErrors, setFormErrors] = useState({});

  

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
      newErrors.name = 'الاسم مطلوب';
    }

    if (!formData.rank.trim()) {
      newErrors.rank = 'الرتبة مطلوبة';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'القسم مطلوب';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Store original manager data to compare changes
    const originalManagerData = {
      name: manager?.name || '',
      rank: manager?.rank?.toString() || '',
      department: manager?.department || ''
    };

    try {
      if (onSave) {
        await onSave(formData);

        // Determine which fields were updated
        const updatedFields = [];
        if (formData.name !== originalManagerData.name) {
          updatedFields.push('الاسم');
        }
        if (formData.rank !== originalManagerData.rank) {
          updatedFields.push('الرتبة');
        }
        if (formData.department !== originalManagerData.department) {
          updatedFields.push('القسم');
        }

        let successMessage = 'تم تحديث بيانات المدير بنجاح.';
        if (updatedFields.length > 0) {
          successMessage = `تم تحديث ${updatedFields.join(' و ')} بنجاح.`;
        }

        MySwal.fire({
          icon: 'success',
          title: 'تم التحديث بنجاح!',
          text: successMessage,
          confirmButtonText: 'موافق'
        });
      }
    } catch (err) {
      console.error('Error updating manager:', err);
      MySwal.fire({
        icon: 'error',
        title: 'خطأ في التحديث!',
        text: err.message || 'حدث خطأ أثناء تحديث بيانات المدير.',
        confirmButtonText: 'موافق'
      });
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


            {/* Page Title */}
            <div className={styles.titleContainer}>
              <p className={styles.title}>تحديث مدير</p>
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
                  <p className={styles.labelText}>الاسم</p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`${styles.textInput} ${formErrors.name ? styles.inputError : ''}`}
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
                  <p className={styles.labelText}>الرتبة</p>
                  <input
                    type="text"
                    name="rank"
                    value={formData.rank}
                    onChange={handleInputChange}
                    className={`${styles.textInput} ${formErrors.rank ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.rank && (
                    <span className={styles.fieldErrorMessage}>{formErrors.rank}</span>
                  )}
                </label>
              </div>

              {/* Department Field */}
              <div className={styles.fieldContainer}>
                <label className={styles.fieldLabel}>
                  <p className={styles.labelText}>القسم</p>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`${styles.textInput} ${formErrors.department ? styles.inputError : ''}`}
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
                    <span className={styles.buttonText}>إلغاء</span>
                  </button>
                  <button
                    type="submit"
                    className={styles.updateButton}
                    disabled={isSubmitting}
                  >
                    <span className={styles.buttonText}>
                      {isSubmitting ? 'جاري التحديث...' : 'تحديث'}
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