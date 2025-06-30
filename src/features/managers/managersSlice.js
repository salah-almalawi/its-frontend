import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchManagers = createAsyncThunk(
    "managers/fetchManagers",
    async (_, { getState }) => {
        const token = getState().auth.token;
        const res = await axios.get("http://localhost:3000/api/managers", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return res.data;
    }
);

export const createManager = createAsyncThunk(
    "managers/createManager",
    async (manager, { getState }) => {
        const token = getState().auth.token;
        const res = await axios.post(
            "http://localhost:3000/api/managers",
            manager,
            {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            }
        );
        return res.data;
    }
);

export const updateManager = createAsyncThunk(
    "managers/updateManager",
    async ({ id, data }, { getState }) => {
        const token = getState().auth.token;
        const res = await axios.put(
            `http://localhost:3000/api/managers/${id}`,
            data,
            {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            }
        );
        return res.data;
    }
);

export const deleteManager = createAsyncThunk(
    "managers/deleteManager",
    async (id, { getState }) => {
        const token = getState().auth.token;
        await axios.delete(`http://localhost:3000/api/managers/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return id;
    }
);

const managersSlice = createSlice({
    name: "managers",
    initialState: {
        items: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchManagers.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchManagers.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchManagers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default managersSlice.reducer;
