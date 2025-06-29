"use client";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    if (!token) return null;

    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/register">Create User</Link>
                </li>
                <li>
                    <button onClick={() => dispatch(logout())}>Logout</button>
                </li>
            </ul>
        </nav>
    );
}