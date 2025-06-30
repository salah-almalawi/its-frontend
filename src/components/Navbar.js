"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import useAuth from "../hooks/useAuth";
import useHasMounted from "../hooks/useHasMounted";

export default function Navbar({ className = "" }) {
    const dispatch = useDispatch();
    const token = useAuth(false);
    const mounted = useHasMounted();

    if (!mounted) return null;

    return (
        <nav className={className}>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                {token ? (
                    <>
                        <li>
                            <Link href="/register">Create User</Link>
                        </li>
                        <li>
                            <Link href="/managers">managers</Link>
                        </li>
                        <li>
                            <Link href="/rounds">rounds</Link>
                        </li>
                        <li>
                            <Link href="/reports">reports</Link>
                        </li>
                        <li>
                            <button onClick={() => dispatch(logout())}>Logout</button>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link href="/login">Login</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}
