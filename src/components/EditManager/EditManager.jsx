'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './EditManager.module.css';

const EditManager = ({ manager = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: manager?.name || '',
    rank: manager?.rank || '',
    department: manager?.department || ''
  });

  const rankOptions = [
    { value: '', label: 'Select Rank' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Senior Manager', label: 'Senior Manager' },
    { value: 'Director', label: 'Director' },
    { value: 'Senior Director', label: 'Senior Director' },
    { value: 'VP', label: 'Vice President' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  const handleCancel = () => {
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
                    className={styles.textInput}
                    placeholder="Enter manager name"
                    required
                  />
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
                    className={styles.selectInput}
                    required
                  >
                    {rankOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
                    className={styles.textInput}
                    placeholder="Enter department"
                    required
                  />
                </label>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionsContainer}>
                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={styles.cancelButton}
                  >
                    <span className={styles.buttonText}>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className={styles.updateButton}
                  >
                    <span className={styles.buttonText}>Update</span>
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