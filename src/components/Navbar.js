"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import useAuth from "../hooks/useAuth";
import useHasMounted from "../hooks/useHasMounted";

export default function Navbar() {
    const dispatch = useDispatch();
    const token = useAuth(false);
    const mounted = useHasMounted();

    if (!mounted) return null;

    return (
        <nav>
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
