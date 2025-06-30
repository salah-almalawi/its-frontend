"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";
import api from "../../api/api";

export default function ReportsPage() {
    const token = useAuth();
    const [managers, setManagers] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [report, setReport] = useState(null);

    useEffect(() => {
        if (!token) return;
        async function loadManagers() {
            try {
                const res = await api.get("/managers", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setManagers(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        loadManagers();
    }, [token]);

    useEffect(() => {
        if (!token || !selectedId) return;
        async function loadReport() {
            try {
                const res = await api.get(`/managers/${selectedId}/summary`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReport(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        loadReport();
    }, [selectedId, token]);

    if (!token) return null;

    return (
        <>
            <Navbar className="print-hidden" />
            <div>
                <select
                    className="print-hidden"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                >
                    <option value="">اختر المدير</option>
                    {managers.map((m) => (
                        <option key={m._id} value={m._id}>
                            {m.name}
                        </option>
                    ))}
                </select>
                {report && (
                    <>
                        <div id="report">
                            <h2>تقرير المدير</h2>
                            <p>الاسم: {report.manager.name}</p>
                            <p>المرتبة: {report.manager.rank}</p>
                            <p>القسم: {report.manager.department}</p>
                            <h3>اخر الجولات</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>المكان</th>
                                        <th>اليوم</th>
                                        <th>السنة</th>
                                        <th>الشهر</th>
                                        <th>اليوم</th>
                                        <th>الوقت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.manager.lastRounds.map((round) => (
                                        <tr key={round._id}>
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
                            <h3>اخر جولات جميع المدراء</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>المدير</th>
                                        <th>المكان</th>
                                        <th>اليوم</th>
                                        <th>السنة</th>
                                        <th>الشهر</th>
                                        <th>اليوم</th>
                                        <th>الوقت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {managers.map((m) => {
                                        const last = m.lastRounds?.[0];
                                        if (!last) return null;
                                        return (
                                            <tr key={m._id}>
                                                <td>{m.name}</td>
                                                <td>{last.location}</td>
                                                <td>{last.day}</td>
                                                <td>{last.Hijri?.year}</td>
                                                <td>{last.Hijri?.month}</td>
                                                <td>{last.Hijri?.day}</td>
                                                <td>{last.Hijri?.time}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <button className="print-hidden" onClick={() => window.print()}>
                            طباعة
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
