"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { token, status } = useSelector((state) => state.auth);
    const [form, setForm] = useState({ username: "", password: "" });

    useEffect(() => {
        if (token) {
            router.push("/");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(login(form));
        // لا داعي لـ router.push هنا، لأنه موجود في useEffect
    };

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
            <button type="submit" disabled={status === "loading"}>
                Login
            </button>
        </form>
    );
}
