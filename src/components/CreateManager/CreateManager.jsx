'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import MySwal from '@/utils/swal';
import {
  createManager,
  selectCreateLoading,
  selectCreateError,
  clearError
} from '@/store/slices/managerSlice';
import styles from './CreateManager.module.css';

const CreateManager = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Redux state
  const isSubmitting = useAppSelector(selectCreateLoading);
  const error = useAppSelector(selectCreateError);

  const [formData, setFormData] = useState({
    name: '',
    rank: '',
    department: ''
  });

  const [formErrors, setFormErrors] = useState({});

  

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError('create'));
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
      dispatch(clearError('create'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(createManager(formData)).unwrap();
      
      // Show success message
      MySwal.fire({
        icon: 'success',
        title: 'تم الإنشاء بنجاح!',
        text: `تم إنشاء المدير ${result.name} بنجاح. `,
        confirmButtonText: 'موافق'
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        rank: '',
        department: ''
      });
      setFormErrors({});

      // Call success callback or redirect
      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push('/managers');
      }
    } catch (err) {
      // Error is handled by Redux state, but show a SweetAlert for user feedback
      console.error('Error creating manager:', err);
      MySwal.fire({
        icon: 'error',
        title: 'خطأ في الإنشاء!',
        text: err.message || 'حدث خطأ أثناء إنشاء المدير.',
        confirmButtonText: 'موافق'
      });
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: '',
      rank: '',
      department: ''
    });
    setFormErrors({});
    dispatch(clearError('create'));

    if (onCancel) {
      onCancel();
    } else {
      router.push('/managers');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.layoutContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.layoutContentContainer}>
            {/* Page Title */}
            <div className={styles.titleContainer}>
              <p className={styles.title}>إنشاء مدير</p>
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
                    placeholder="أدخل الاسم"
                    className={`${styles.textInput} ${formErrors.name ? styles.inputError : ''}`}
                    disabled={isSubmitting}
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
                    placeholder="أدخل الرتبة"
                    className={`${styles.textInput} ${formErrors.rank ? styles.inputError : ''}`}
                    disabled={isSubmitting}
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
                    placeholder="أدخل القسم"
                    className={`${styles.textInput} ${formErrors.department ? styles.inputError : ''}`}
                    disabled={isSubmitting}
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
                    className={styles.createButton}
                    disabled={isSubmitting}
                  >
                    <span className={styles.buttonText}>
                      {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء'}
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

export default CreateManager;