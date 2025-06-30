"use client";
import React, { use, useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  updateManager,
  deleteManager,
} from "../../../features/managers/managersSlice";
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import api from "../../../api/api";
import useAuth from "../../../hooks/useAuth";

export default function ManagerDetails({ params }) {
  const { id } = use(params);           // unwrap Promise with React.use()
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useAuth();
  const [manager, setManager] = useState(null);
  const [form, setForm] = useState({ name: "", rank: "", department: "" });
  const [editing, setEditing] = useState(false);

  const isChanged =
    manager &&
    (form.name !== manager.name ||
      form.rank !== String(manager.rank) ||
      form.department !== manager.department);

  const fetchManager = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get(`/managers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setManager(res.data);
      setForm({
        name: res.data.name,
        rank: String(res.data.rank),
        department: res.data.department,
      });
    } catch (err) {
      console.error(err);
    }
  }, [id, token]);

  useEffect(() => {
    fetchManager();
  }, [fetchManager]);

  if (!token) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isChanged) return;
    const data = { ...form, rank: Number(form.rank) };
    await dispatch(updateManager({ id, data }));
    await fetchManager();
    setEditing(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteManager(id));
    router.push("/managers");
  };

  if (!manager) {
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

      <h1>Manager Details</h1>
      <p>Name: {manager.name}</p>
      <p>Rank: {manager.rank}</p>
      <p>Department: {manager.department}</p>
      {manager.lastRounds && (
        <div>
          <p>Last Rounds:</p>
          {Array.isArray(manager.lastRounds) ? (
            <ul>
              {manager.lastRounds.map((round) => (
                <li key={round._id || round.id}>
                  {round.location} - {round.day}
                </li>
              ))}
            </ul>
          ) : (
            <pre>{JSON.stringify(manager.lastRounds, null, 2)}</pre>
          )}
        </div>
      )}

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          disabled={!editing}
        />
        <input
          type="text"
          value={form.rank}
          onChange={(e) => setForm({ ...form, rank: e.target.value })}
          disabled={!editing}
        />
        <input
          type="text"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          disabled={!editing}
        />

        {editing && (
          <>
            <button type="submit" disabled={!isChanged}>
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setForm({
                  name: manager.name,
                  rank: String(manager.rank),
                  department: manager.department,
                });
              }}
            >
              Cancel
            </button>
          </>
        )}
      </form>

      {!editing && (
        <>
          <button type="button" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        </>
      )}

      <Link href="/managers">Back to list</Link>
    </>
  );
}
