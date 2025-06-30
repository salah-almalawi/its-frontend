"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { fetchRounds } from "../../features/rounds/roundsSlice";
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";

export default function RoundsPage() {
    const dispatch = useDispatch();
    const token = useAuth();
    const { items, status } = useSelector((state) => state.rounds);

    useEffect(() => {
        dispatch(fetchRounds());
    }, [dispatch]);

    if (!token) return null;

    return (
        <>
            <Navbar />
            <Link href="/rounds/create">Add Round</Link>
            {status === "loading" && <p>Loading...</p>}
            <table>
                <thead>
                    <tr>
                        <th>Manager Name</th>
                        <th>Department</th>
                        <th>Rank</th>
                        <th>Location</th>
                        <th>Day</th>
                        <th>Year</th>
                        <th>Month</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((round) => (
                        <tr key={round._id}>
                            <td>
                                <Link href={`/rounds/${round._id}`}>{round.managerName}</Link>
                            </td>
                            <td>{round.managerDepartment}</td>
                            <td>{round.managerRank}</td>
                            <td>{round.location}</td>
                            <td>{round.day}</td>
                            <td>{round.Hijri?.year}</td>
                            <td>{round.Hijri?.month}</td>
                            <td>{round.Hijri?.day}</td>
                            <td>{round.Hijri?.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}