"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const token = useSelector((state) => state.auth.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  if (!token) return null;
  return (
    <>
      <Navbar />
      <h1>Home page</h1>
    </>
  );
}
