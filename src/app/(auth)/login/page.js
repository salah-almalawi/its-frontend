"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../features/auth/authSlice";
import { useRouter } from "next/navigation";
import styles from './page.module.css';

export default function LoginPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { token, status, error } = useSelector((state) => state.auth);
    const [form, setForm] = useState({ username: "", password: "" });

    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(login(form));
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginCard}>
                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>Sign in to your account to continue</p>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            className={styles.input}
                            required
                        />
                    </div>
                    
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className={styles.input}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={status === "loading"}
                        className={styles.submitButton}
                    >
                        {status === "loading" && <span className={styles.loadingSpinner}></span>}
                        
                        {status === "loading" ? "Signing In..." : "Sign In"}
                    </button>
                    
                    {error && (
                        <div className={styles.errorMessage}>
                            Login failed. Please check your credentials and try again.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}