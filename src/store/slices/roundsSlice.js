import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';

// إنشاء جولة جديدة - POST /api/rounds
export const createRound = createAsyncThunk(
    'rounds/createRound',
    async (roundData, { rejectWithValue }) => {
        try {
            const response = await api.post('/rounds', roundData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create round');
        }
    }
);

// جلب جميع الجولات - GET /api/rounds
export const fetchRounds = createAsyncThunk(
    'rounds/fetchRounds',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/rounds');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch rounds');
        }
    }
);

// جلب جولة محددة - GET /api/rounds/:id
export const fetchRoundById = createAsyncThunk(
    'rounds/fetchRoundById',
    async (roundId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/rounds/${roundId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch round');
        }
    }
);

const initialState = {
    rounds: [],
    currentRound: null,
    loading: {
        rounds: false,
        details: false,
        create: false,
    },
    error: {
        rounds: null,
        details: null,
        create: null,
    }
};

const roundsSlice = createSlice({
    name: 'rounds',
    initialState,
    reducers: {
        clearError: (state, action) => {
            const errorType = action.payload;
            if (errorType && state.error[errorType] !== undefined) {
                state.error[errorType] = null;
            }
        },
        clearCurrentRound: (state) => {
            state.currentRound = null;
        }
    },
    extraReducers: (builder) => {
        // إنشاء جولة
        builder
            .addCase(createRound.pending, (state) => {
                state.loading.create = true;
                state.error.create = null;
            })
            .addCase(createRound.fulfilled, (state, action) => {
                state.loading.create = false;
                state.rounds.unshift(action.payload);
                state.error.create = null;
            })
            .addCase(createRound.rejected, (state, action) => {
                state.loading.create = false;
                state.error.create = action.payload;
            });

        // جلب جميع الجولات
        builder
            .addCase(fetchRounds.pending, (state) => {
                state.loading.rounds = true;
                state.error.rounds = null;
            })
            .addCase(fetchRounds.fulfilled, (state, action) => {
                state.loading.rounds = false;
                state.rounds = action.payload;
                state.error.rounds = null;
            })
            .addCase(fetchRounds.rejected, (state, action) => {
                state.loading.rounds = false;
                state.error.rounds = action.payload;
            });

        // جلب جولة محددة
        builder
            .addCase(fetchRoundById.pending, (state) => {
                state.loading.details = true;
                state.error.details = null;
            })
            .addCase(fetchRoundById.fulfilled, (state, action) => {
                state.loading.details = false;
                state.currentRound = action.payload;
                state.error.details = null;
            })
            .addCase(fetchRoundById.rejected, (state, action) => {
                state.loading.details = false;
                state.error.details = action.payload;
            });
    }
});

export const { clearError, clearCurrentRound } = roundsSlice.actions;

// Selectors
export const selectRounds = (state) => state.rounds.rounds;
export const selectCurrentRound = (state) => state.rounds.currentRound;
export const selectRoundsLoading = (state) => state.rounds.loading.rounds;
export const selectDetailsLoading = (state) => state.rounds.loading.details;
export const selectCreateLoading = (state) => state.rounds.loading.create;
export const selectRoundsError = (state) => state.rounds.error.rounds;
export const selectDetailsError = (state) => state.rounds.error.details;
export const selectCreateError = (state) => state.rounds.error.create;

export default roundsSlice.reducer;