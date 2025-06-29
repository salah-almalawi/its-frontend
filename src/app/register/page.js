"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const token = useSelector((state) => state.auth.token);
    const [form, setForm] = useState({ username: "", password: "" });

    useEffect(() => {
        if (!token) {
            router.push("/login");
        }
    }, [token, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(register(form));
        router.push("/");
    };

    if (!token) return null;

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
                type="password"
                placeholder="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit">Register</button>
        </form>
    );
}