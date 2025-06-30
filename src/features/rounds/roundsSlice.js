import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchRounds = createAsyncThunk(
    "rounds/fetchRounds",
    async (_, { getState }) => {
        const token = getState().auth.token;
        const res = await api.get("/rounds", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return res.data;
    }
);

export const createRound = createAsyncThunk(
    "rounds/createRound",
    async (round, { getState }) => {
        const token = getState().auth.token;
        const res = await api.post("/rounds", round, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return res.data;
    }
);

const roundsSlice = createSlice({
    name: "rounds",
    initialState: {
        items: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRounds.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchRounds.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchRounds.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(createRound.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default roundsSlice.reducer;