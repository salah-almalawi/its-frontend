import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const tokenKey = "authToken";

export const login = createAsyncThunk(
    "auth/login",
    async ({ username, password }) => {
        const res = await api.post("/auth/login", { username, password });
        return res.data.token;
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async ({ username, password }, { getState }) => {
        const token = getState().auth.token;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await api.post("/auth/register", { username, password }, { headers });
        return res.data.token;
    }
);

const initialState = {
    token: null,
    status: "idle",
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
            if (typeof window !== "undefined" && action.payload) {
                localStorage.setItem(tokenKey, action.payload);
            }
        },
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

export const { logout, setToken } = authSlice.actions;

export default authSlice.reducer;
