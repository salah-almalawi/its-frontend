"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
            setEditingId(null);
        } else {
            dispatch(createManager(data));
        }
        setForm({ name: "", rank: "", department: "" });
    };

    const handleEdit = (manager) => {
        setEditingId(manager._id);
        setForm({
            name: manager.name,
            rank: manager.rank,
            department: manager.department,
        });
    };

    return (
        <>
            <Navbar />
            <h1>Managers</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="number"
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
            <ul>
                {items.map((manager) => (
                    <li key={manager._id}>
                        {manager.name} - {manager.department} - rank {manager.rank}
                        <button onClick={() => handleEdit(manager)}>Edit</button>
                        <button
                            onClick={() => dispatch(deleteManager(manager._id))}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}