"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { setToken } from "../features/auth/authSlice";

export default function useAuth(redirect = true) {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!checked) {
            const stored = localStorage.getItem("authToken");
            if (stored && !token) {
                dispatch(setToken(stored));
            }
            setChecked(true);
        } else if (redirect && !token) {
            router.push("/login");
        }
    }, [checked, token, redirect, router, dispatch]);

    return token;
}
