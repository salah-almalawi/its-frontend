"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchManagers } from "../../../features/managers/managersSlice";
import { createRound } from "../../../features/rounds/roundsSlice";
import Navbar from "../../../components/Navbar";
import useAuth from "../../../hooks/useAuth";

export default function CreateRoundPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const token = useAuth();
    const { items: managers } = useSelector((state) => state.managers);
    const [form, setForm] = useState({
        managerId: "",
        location: "",
        day: "",
        Hijri: { year: "", month: "", day: "", time: "" },
    });

    useEffect(() => {
        dispatch(fetchManagers());
    }, [dispatch]);

    if (!token) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            managerId: form.managerId,
            location: form.location,
            day: form.day,
            Hijri: {
                year: Number(form.Hijri.year),
                month: Number(form.Hijri.month),
                day: Number(form.Hijri.day),
                time: form.Hijri.time,
            },
        };
        await dispatch(createRound(data));
        router.push("/rounds");
    };

    return (
        <>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <select
                    value={form.managerId}
                    onChange={(e) => setForm({ ...form, managerId: e.target.value })}
                >
                    <option value="">Select manager</option>
                    {managers.map((m) => (
                        <option key={m._id} value={m._id}>
                            {m.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="day"
                    value={form.day}
                    onChange={(e) => setForm({ ...form, day: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="year"
                    value={form.Hijri.year}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            Hijri: { ...form.Hijri, year: e.target.value },
                        })
                    }
                />
                <input
                    type="number"
                    placeholder="month"
                    value={form.Hijri.month}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            Hijri: { ...form.Hijri, month: e.target.value },
                        })
                    }
                />
                <input
                    type="number"
                    placeholder="day"
                    value={form.Hijri.day}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            Hijri: { ...form.Hijri, day: e.target.value },
                        })
                    }
                />
                <input
                    type="text"
                    placeholder="time"
                    value={form.Hijri.time}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            Hijri: { ...form.Hijri, time: e.target.value },
                        })
                    }
                />
                <button type="submit">Create</button>
            </form>
        </>
    );
}