'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // سيتم ربط اللوجك لاحقاً مع Redux
        console.log('Form submitted:', formData);
    };

    return (
        <div className={styles.container}>
            <div className={styles.layoutContainer}>
                <div className={styles.contentWrapper}>
                    <div className={styles.layoutContentContainer}>
                        <h2 className={styles.title}>إنشاء حساب جديد</h2>

                        <form onSubmit={handleSubmit}>
                            <div className={styles.fieldContainer}>
                                <label className={styles.fieldLabel}>
                                    <p className={styles.labelText}>اسم المستخدم</p>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="ادخل اسم المستخدم"
                                        className={styles.formInput}
                                    />
                                </label>
                            </div>

                            <div className={styles.fieldContainer}>
                                <label className={styles.fieldLabel}>
                                    <p className={styles.labelText}>كلمة المرور</p>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="أدخل كلمة المرور"
                                        className={styles.formInput}
                                    />
                                </label>
                            </div>

                            <div className={styles.buttonContainer}>
                                <button
                                    type="submit"
                                    className={styles.createButton}
                                >
                                    <span className={styles.buttonText}>إنشاء مستخدم</span>
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => router.back()}
                                >
                                    <span className={styles.buttonText}>إلغاء</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;