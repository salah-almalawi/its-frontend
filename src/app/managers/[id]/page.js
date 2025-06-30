"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { updateManager, deleteManager } from "../../../features/managers/managersSlice";
import Navbar from "../../../components/Navbar";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

export default function ManagerDetails({ params }) {
    const { id } = params;
    const dispatch = useDispatch();
    const router = useRouter();
    const token = useAuth();
    const [manager, setManager] = useState(null);
    const [form, setForm] = useState({ name: "", rank: "", department: "" });

    useEffect(() => {
        const fetchManager = async () => {
            const res = await axios.get(`http://localhost:3000/api/managers/${id}`);
            setManager(res.data);
            setForm({
                name: res.data.name,
                rank: res.data.rank,
                department: res.data.department,
            });
        };
        fetchManager();
    }, [id]);

    if (!token) return null;

    const handleUpdate = async (e) => {
        e.preventDefault();
        const data = { ...form, rank: Number(form.rank) };
        await dispatch(updateManager({ id, data }));
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
            <p>ID: {manager._id}</p>
            <p>Created At: {manager.createdAt}</p>
            <p>Updated At: {manager.updatedAt}</p>
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    type="number"
                    value={form.rank}
                    onChange={(e) => setForm({ ...form, rank: e.target.value })}
                />
                <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
                <button type="submit">Update</button>
            </form>
            <button onClick={handleDelete}>Delete</button>
        </>
    );
}