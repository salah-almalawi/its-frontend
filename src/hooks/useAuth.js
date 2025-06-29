"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useAuth(redirect = true) {
    const token = useSelector((state) => state.auth.token);
    const router = useRouter();

    useEffect(() => {
        if (redirect && !token) {
            router.push("/login");
        }
    }, [token, redirect, router]);

    return token;
}