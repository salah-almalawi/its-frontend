'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import MySwal from '@/utils/swal';
import {
  createRound,
  selectCreateLoading,
  selectCreateError,
  clearError
} from '@/store/slices/roundsSlice';
import { fetchManagers, selectManagers } from '@/store/slices/managerSlice';
import styles from './CreateTour.module.css';

const CreateTour = ({ onSuccess, onCancel }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // Redux state
  const isSubmitting = useAppSelector(selectCreateLoading);
  const error = useAppSelector(selectCreateError);
  const managers = useAppSelector(selectManagers);

  const [formData, setFormData] = useState({
    managerId: '',
    location: '',
    day: '',
    Hijri: {
      year: '',
      month: '',
      day: '',
      time: ''
    }
  });

  const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const hijriYears = Array.from({ length: 11 }, (_, i) => (1447 + i).toString()); // 1447 to 1457
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString()); // 1 to 12
  const daysInMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString()); // 1 to 31
  const times = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00',
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00', '23:00'
  ];

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchManagers());
    return () => {
      dispatch(clearError('create'));
    };
  }, [dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.managerId) {
      newErrors.managerId = 'المدير مطلوب';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'الموقع مطلوب';
    }
    if (!formData.day.trim()) {
      newErrors.day = 'اليوم مطلوب';
    }
    if (!formData.Hijri.year.trim()) {
      newErrors.Hijri_year = 'السنة الهجرية مطلوبة';
    }
    if (!formData.Hijri.month.trim()) {
      newErrors.Hijri_month = 'الشهر مطلوب';
    }
    if (!formData.Hijri.day.trim()) {
      newErrors.Hijri_day = 'اليوم مطلوب';
    }
    if (!formData.Hijri.time.trim()) {
      newErrors.Hijri_time = 'الوقت مطلوب';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('Hijri.')) {
      const hijriField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        Hijri: {
          ...prev.Hijri,
          [hijriField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear form error when user starts typing
    if (formErrors[name] || formErrors[`Hijri_${name.split('.')[1]}`]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
        [`Hijri_${name.split('.')[1]}`]: ''
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
      const result = await dispatch(createRound(formData)).unwrap();
      
      // Show success message
      MySwal.fire({
        icon: 'success',
        title: 'تم الإنشاء بنجاح!',
        text: `تم إنشاء الجولة بنجاح. `,
        confirmButtonText: 'موافق'
      });

      // Reset form after successful submission
      setFormData({
        managerId: '',
        location: '',
        day: '',
        Hijri: {
          year: '',
          month: '',
          day: '',
          time: ''
        }
      });
      setFormErrors({});

      // Call success callback or redirect
      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push('/tours');
      }
    } catch (err) {
      // Error is handled by Redux state, but show a SweetAlert for user feedback
      console.error('Error creating round:', err);
      MySwal.fire({
        icon: 'error',
        title: 'خطأ في الإنشاء!',
        text: err.message || 'حدث خطأ أثناء إنشاء الجولة.',
        confirmButtonText: 'موافق'
      });
    }
  };

  const handleCancelClick = () => {
    // Reset form
    setFormData({
      managerId: '',
      location: '',
      day: '',
      Hijri: {
        year: '',
        month: '',
        day: '',
        time: ''
      }
    });
    setFormErrors({});
    dispatch(clearError('create'));

    if (onCancel) {
      onCancel();
    } else {
      router.push('/tours');
    }
  };

  return (
    <div className={styles.container} style={{ direction: 'rtl', textAlign: 'right' }}>
      <div className={styles.layoutContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.layoutContentContainer}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
              <Link href="/tours" className={styles.breadcrumbLink}>
                الجولات
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>إضافة جولة</span>
            </div>

            {/* Page Title */}
            <div className={styles.titleContainer}>
              <p className={styles.title}>إضافة جولة</p>
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
              {/* Manager Field */}
              <div className={styles.fieldContainer}>
                <label className={styles.fieldLabel}>
                  <p className={styles.labelText}>المدير</p>
                  <select
                    name="managerId"
                    value={formData.managerId}
                    onChange={handleInputChange}
                    className={`${styles.selectInput} ${formErrors.managerId ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">اختر مدير</option>
                    {managers.map(manager => (
                      <option key={manager._id} value={manager._id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.managerId && (
                    <span className={styles.fieldErrorMessage}>{formErrors.managerId}</span>
                  )}
                </label>
              </div>

              {/* Location Field */}
              <div className={styles.fieldContainer}>
                <label className={styles.fieldLabel}>
                  <p className={styles.labelText}>الموقع</p>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="أدخل الموقع"
                    className={`${styles.textInput} ${formErrors.location ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  />
                  {formErrors.location && (
                    <span className={styles.fieldErrorMessage}>{formErrors.location}</span>
                  )}
                </label>
              </div>

              {/* Day Field */}
              <div className={styles.fieldContainer}>
                <label className={styles.fieldLabel}>
                  <p className={styles.labelText}>اليوم</p>
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleInputChange}
                    className={`${styles.selectInput} ${formErrors.day ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">اختر يوم</option>
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  {formErrors.day && (
                    <span className={styles.fieldErrorMessage}>{formErrors.day}</span>
                  )}
                </label>
              </div>

              {/* Hijri Year and Month Fields */}
              <div className={styles.fieldContainer} style={{ display: 'flex', gap: '1rem' }}>
                <label className={styles.fieldLabel} style={{ flex: 1 }}>
                  <p className={styles.labelText}>السنة الهجرية</p>
                  <select
                    name="Hijri.year"
                    value={formData.Hijri.year}
                    onChange={handleInputChange}
                    className={`${styles.selectInput} ${formErrors.Hijri_year ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">اختر سنة</option>
                    {hijriYears.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {formErrors.Hijri_year && (
                    <span className={styles.fieldErrorMessage}>{formErrors.Hijri_year}</span>
                  )}
                </label>
                <label className={styles.fieldLabel} style={{ flex: 1 }}>
                  <p className={styles.labelText}>الشهر</p>
                  <select
                    name="Hijri.month"
                    value={formData.Hijri.month}
                    onChange={handleInputChange}
                    className={`${styles.selectInput} ${formErrors.Hijri_month ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">اختر شهر</option>
                    {months.map(month => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  {formErrors.Hijri_month && (
                    <span className={styles.fieldErrorMessage}>{formErrors.Hijri_month}</span>
                  )}
                </label>
              </div>

              {/* Hijri Day and Time Fields */}
              <div className={styles.fieldContainer} style={{ display: 'flex', gap: '1rem' }}>
                <label className={styles.fieldLabel} style={{ flex: 1 }}>
                  <p className={styles.labelText}>اليوم</p>
                  <select
                    name="Hijri.day"
                    value={formData.Hijri.day}
                    onChange={handleInputChange}
                    className={`${styles.selectInput} ${formErrors.Hijri_day ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">اختر يوم</option>
                    {daysInMonth.map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  {formErrors.Hijri_day && (
                    <span className={styles.fieldErrorMessage}>{formErrors.Hijri_day}</span>
                  )}
                </label>
                <label className={styles.fieldLabel} style={{ flex: 1 }}>
                  <p className={styles.labelText}>الوقت</p>
                  <select
                    name="Hijri.time"
                    value={formData.Hijri.time}
                    onChange={handleInputChange}
                    className={`${styles.selectInput} ${formErrors.Hijri_time ? styles.inputError : ''}`}
                    disabled={isSubmitting}
                  >
                    <option value="">اختر وقت</option>
                    {times.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {formErrors.Hijri_time && (
                    <span className={styles.fieldErrorMessage}>{formErrors.Hijri_time}</span>
                  )}
                </label>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionsContainer}>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={handleCancelClick}
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
                      {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء جولة'}
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

export default CreateTour;