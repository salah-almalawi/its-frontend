"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../../features/auth/authSlice";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import useAuth from "../../../hooks/useAuth";

export default function RegisterPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const token = useAuth();
    const [form, setForm] = useState({ username: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(register(form));
        router.push("/");
    };

    if (!token) return null;

    return (
        <>
            <Navbar />
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
                <button type="button" onClick={() => router.push("/")}>Cancel</button>
            </form>
        </>
    );
}
