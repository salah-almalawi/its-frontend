"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
    fetchManagers,
    createManager,
    updateManager,
    deleteManager,
} from "../../features/managers/managersSlice";
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";

export default function ManagersPage() {
    const dispatch = useDispatch();
    const token = useAuth();
    const { items, status } = useSelector((state) => state.managers);
    const [form, setForm] = useState({ name: "", rank: "", department: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        dispatch(fetchManagers());
    }, [dispatch]);

    if (!token) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = { ...form, rank: Number(form.rank) };
        if (editingId) {
            dispatch(updateManager({ id: editingId, data }));
        } else {
            dispatch(createManager(data));
        }
        setForm({ name: "", rank: "", department: "" });
        setEditingId(null);
    };

    const handleEdit = (manager) => {
        setEditingId(manager._id);
        setForm({
            name: manager.name,
            rank: manager.rank.toString(),
            department: manager.department,
        });
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
                <button type="submit">
                    {editingId ? "Update" : "Create"}
                </button>
                {editingId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setForm({ name: "", rank: "", department: "" });
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>
            {status === "loading" && <p>Loading...</p>}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Rank</th>
                        <th>Actions</th>
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
                            <td>
                                <button onClick={() => handleEdit(manager)}>
                                    Edit
                                </button>
                                <button
                                    onClick={() => dispatch(deleteManager(manager._id))}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
