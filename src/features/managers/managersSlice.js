import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchManagers = createAsyncThunk(
    "managers/fetchManagers",
    async () => {
        const res = await fetch("http://localhost:3000/api/managers");
        if (!res.ok) {
            throw new Error("Failed to fetch managers");
        }
        return res.json();
    }
);

export const createManager = createAsyncThunk(
    "managers/createManager",
    async (manager) => {
        const res = await fetch("http://localhost:3000/api/managers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(manager),
        });
        if (!res.ok) {
            throw new Error("Failed to create manager");
        }
        return res.json();
    }
);

export const updateManager = createAsyncThunk(
    "managers/updateManager",
    async ({ id, data }) => {
        const res = await fetch(`http://localhost:3000/api/managers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            throw new Error("Failed to update manager");
        }
        return res.json();
    }
);

export const deleteManager = createAsyncThunk(
    "managers/deleteManager",
    async (id) => {
        const res = await fetch(`http://localhost:3000/api/managers/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error("Failed to delete manager");
        }
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
                    (manager) => manager._id === action.payload._id
                );
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteManager.fulfilled, (state, action) => {
                state.items = state.items.filter(
                    (manager) => manager._id !== action.payload
                );
            });
    },
});

export default managersSlice.reducer;
