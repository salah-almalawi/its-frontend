"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { fetchManagers, createManager } from "../../features/managers/managersSlice";
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";

export default function ManagersPage() {
    const dispatch = useDispatch();
    const token = useAuth();
    const { items, status } = useSelector((state) => state.managers);
    const [form, setForm] = useState({ name: "", rank: "", department: "" });

    useEffect(() => {
        dispatch(fetchManagers());
    }, [dispatch]);

    if (!token) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form, rank: Number(form.rank) };
        await dispatch(createManager(data));
        setForm({ name: "", rank: "", department: "" });
    };

    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="rank"
                    value={form.rank}
                    onChange={(e) => setForm({ ...form, rank: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="department"
                    value={form.department}
                    onChange={(e) =>
                        setForm({ ...form, department: e.target.value })
                    }
                />
                <button type="submit">Create</button>
            </form>
            {status === "loading" && <p>Loading...</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Rank</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((manager) => (
                        <tr key={manager._id}>
                            <td>
                                <Link href={`/managers/${manager._id}`}>{manager.name}</Link>
                            </td>
                            <td>{manager.department}</td>
                            <td>{manager.rank}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
