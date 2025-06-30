import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchManagers = createAsyncThunk(
    "managers/fetchManagers",
    async (_, { getState }) => {
        const token = getState().auth.token;
        const res = await api.get("/managers", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return res.data;
    }
);

export const createManager = createAsyncThunk(
    "managers/createManager",
    async (manager, { getState }) => {
        const token = getState().auth.token;
        const res = await api.post("/managers", manager, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return res.data;
    }
);

export const updateManager = createAsyncThunk(
    "managers/updateManager",
    async ({ id, data }, { getState }) => {
        const token = getState().auth.token;
        const res = await api.put(`/managers/${id}`, data, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return res.data;
    }
);

export const deleteManager = createAsyncThunk(
    "managers/deleteManager",
    async (id, { getState }) => {
        const token = getState().auth.token;
        await api.delete(`/managers/${id}`, {
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
            })
            .addCase(createManager.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateManager.fulfilled, (state, action) => {
                const index = state.items.findIndex(
                    (item) => item._id === action.payload._id
                );
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteManager.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    },
});

export default managersSlice.reducer;
