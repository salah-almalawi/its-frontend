"use client";
import React, { use, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { updateManager, deleteManager } from "../../../features/managers/managersSlice";
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import api from "../../../api/api";
import useAuth from "../../../hooks/useAuth";

export default function ManagerDetails({ params }) {
    const { id } = use(params);
    const dispatch = useDispatch();
    const router = useRouter();
    const token = useAuth();
    const [manager, setManager] = useState(null);
    const [form, setForm] = useState({ name: "", rank: "", department: "" });

    const fetchManager = useCallback(async () => {
        const res = await api.get(`/managers/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setManager(res.data);
        setForm({
            name: res.data.name,
            rank: res.data.rank,
            department: res.data.department,
        });
    }, [id, token]);

    useEffect(() => {
        fetchManager();
    }, [fetchManager]);

    if (!token) return null;

    const handleUpdate = async (e) => {
        e.preventDefault();
        const data = { ...form, rank: Number(form.rank) };
        await dispatch(updateManager({ id, data }));
        await fetchManager();
    };

    const handleDelete = async () => {
        await dispatch(deleteManager(id));
        router.push("/managers");
    };

    if (!manager) return (
        <>
            <Navbar />
            <p>Loading...</p>
        </>
    );

    return (
        <>
            <Navbar />
            <h1>Manager Details</h1>
            <p>Name: {manager.name}</p>
            <p>Rank: {manager.rank}</p>
            <p>Department: {manager.department}</p>
            {manager.lastRounds && <p>Last Rounds: {manager.lastRounds}</p>}
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="text"
                    value={form.rank}
                    onChange={(e) => setForm({ ...form, rank: e.target.value })}
                />
                <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
                <button type="submit">Update</button>
                <button type="button" onClick={handleDelete}>Delete</button>
            </form>
            <Link href="/managers">Back to list</Link>
        </>
    );
}


