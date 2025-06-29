"use client";
import Navbar from "../components/Navbar";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const token = useAuth();

  if (!token) return null;
  return (
    <>
      <Navbar />
      <h1>Home page</h1>
    </>
  );
}
