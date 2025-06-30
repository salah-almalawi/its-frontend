'use client';
import { use, useEffect, useState, useCallback } from 'react';
import Navbar from '../../../components/Navbar';
import api from '../../../api/api';
import useAuth from '../../../hooks/useAuth';

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
        <p>جاري التحميل...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <h1>تفاصيل الجولة</h1>
      <p>المدير: {round.managerName}</p>
      <p>القسم: {round.managerDepartment}</p>
      <p>الرتبة: {round.managerRank}</p>
      <p>الموقع: {round.location}</p>
      <p>اليوم: {round.day}</p>
      <p>السنة: {round.Hijri?.year}</p>
      <p>الشهر: {round.Hijri?.month}</p>
      <p>التاريخ: {round.Hijri?.day}</p>
      <p>الوقت: {round.Hijri?.time}</p>
    </>
  );
}
