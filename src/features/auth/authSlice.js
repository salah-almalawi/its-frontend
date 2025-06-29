import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const tokenKey = "authToken";

export const login = createAsyncThunk(
    "auth/login",
    async ({ username, password }) => {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
            throw new Error("Login failed");
        }
        const data = await res.json();
        return data.token;
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async ({ username, password }) => {
        const res = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        if (!res.ok) {
            throw new Error("Register failed");
        }
        const data = await res.json();
        return data.token;
    }
);

const initialState = {
    token:
        typeof window !== "undefined" ? localStorage.getItem(tokenKey) : null,
    status: "idle",
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem(tokenKey);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.token = action.payload;
                if (typeof window !== "undefined") {
                    localStorage.setItem(tokenKey, action.payload);
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.token = action.payload;
                if (typeof window !== "undefined") {
                    localStorage.setItem(tokenKey, action.payload);
                }
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;