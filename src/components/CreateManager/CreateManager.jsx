'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './CreateManager.module.css';

const CreateManager = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    rank: '',
    department: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rankOptions = [
    { value: '', label: 'Select rank' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Senior Manager', label: 'Senior Manager' },
    { value: 'Director', label: 'Director' },
    { value: 'Senior Director', label: 'Senior Director' },
    { value: 'VP', label: 'Vice President' },
    { value: 'SVP', label: 'Senior Vice President' }
  ];

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSave) {
        await onSave(formData);
      }

      // Reset form after successful submission
      setFormData({
        name: '',
        rank: '',
        department: ''
      });
    } catch (error) {
      console.error('Error creating manager:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: '',
      rank: '',
      department: ''
    });
    setErrors({});

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
              <span className={styles.breadcrumbCurrent}>Create Manager</span>
            </div>

            {/* Page Title */}
            <div className={styles.titleContainer}>
              <p className={styles.title}>Create Manager</p>
            </div>

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
                    placeholder="Enter name"
                    className={`${styles.textInput} ${errors.name ? styles.inputError : ''}`}
                  />
                  {errors.name && (
                    <span className={styles.errorMessage}>{errors.name}</span>
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
                    className={`${styles.selectInput} ${errors.rank ? styles.inputError : ''}`}
                  >
                    {rankOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.rank && (
                    <span className={styles.errorMessage}>{errors.rank}</span>
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
                    placeholder="Enter department"
                    className={`${styles.textInput} ${errors.department ? styles.inputError : ''}`}
                  />
                  {errors.department && (
                    <span className={styles.errorMessage}>{errors.department}</span>
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
                    className={styles.createButton}
                    disabled={isSubmitting}
                  >
                    <span className={styles.buttonText}>
                      {isSubmitting ? 'Creating...' : 'Create'}
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