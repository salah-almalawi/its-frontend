"use client";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { useEffect } from "react";
import { setToken } from "../features/auth/authSlice";

function InitAuth() {
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            store.dispatch(setToken(token));
        }
    }, []);
    return null;
}

export default function Providers({ children }) {
    return (
        <Provider store={store}>
            <InitAuth />
            {children}
        </Provider>
    );
}
