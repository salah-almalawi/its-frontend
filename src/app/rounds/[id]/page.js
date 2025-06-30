"use client";
import { use, useEffect, useState, useCallback } from "react";
import Navbar from "../../../components/Navbar";
import api from "../../../api/api";
import useAuth from "../../../hooks/useAuth";

export default function RoundDetails({ params }) {
    const { id } = use(params);
    const token = useAuth();
    const [round, setRound] = useState(null);

    const fetchRound = useCallback(async () => {
        if (!token) return;
        try {
            const res = await api.get(`/rounds/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRound(res.data);
        } catch (err) {
            console.error(err);
        }
    }, [id, token]);

    useEffect(() => {
        fetchRound();
    }, [fetchRound]);

    if (!token) return null;

    if (!round) {
        return (
            <>
                <Navbar />
                <p>Loading...</p>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <h1>Round Details</h1>
            <p>Manager: {round.managerName}</p>
            <p>Department: {round.managerDepartment}</p>
            <p>Rank: {round.managerRank}</p>
            <p>Location: {round.location}</p>
            <p>Day: {round.day}</p>
            <p>Year: {round.Hijri?.year}</p>
            <p>Month: {round.Hijri?.month}</p>
            <p>Date: {round.Hijri?.day}</p>
            <p>Time: {round.Hijri?.time}</p>
        </>
    );
}