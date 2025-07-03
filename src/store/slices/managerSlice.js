import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/api/api';

// Async thunks for API calls
export const fetchManagers = createAsyncThunk(
    'managers/fetchManagers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/managers');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch managers');
        }
    }
);

export const fetchManagerDetails = createAsyncThunk(
    'managers/fetchManagerDetails',
    async (managerId, { rejectWithValue }) => {
        try {
            // استخدام الـ endpoint الصحيح
            const response = await api.get(`/managers/${managerId}`);
            // تعديل البيانات لتتوافق مع الـ component
            return {
                manager: response.data,
                allRounds: response.data.lastRounds || []
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch manager details');
        }
    }
);

export const createManager = createAsyncThunk(
    'managers/createManager',
    async (managerData, { rejectWithValue }) => {
        try {
            const response = await api.post('/managers', managerData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create manager');
        }
    }
);

export const updateManager = createAsyncThunk(
    'managers/updateManager',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/managers/${id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update manager');
        }
    }
);

export const deleteManager = createAsyncThunk(
    'managers/deleteManager',
    async (managerId, { rejectWithValue }) => {
        try {
            await api.delete(`/managers/${managerId}`);
            return managerId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete manager');
        }
    }
);

// Initial state
const initialState = {
    // List of all managers
    managers: [],

    // Current selected manager details
    currentManager: null,

    // All rounds data (from summary API)
    allRounds: [],

    // Loading states
    loading: {
        managers: false,
        details: false,
        create: false,
        update: false,
        delete: false,
    },

    // Error states
    error: {
        managers: null,
        details: null,
        create: null,
        update: null,
        delete: null,
    },

    // UI states
    ui: {
        showDeleteConfirm: false,
        deletingManagerId: null,
        selectedManagerId: null,
    }
};

// Create slice
const managerSlice = createSlice({
    name: 'managers',
    initialState,
    reducers: {
        // Clear errors
        clearError: (state, action) => {
            const errorType = action.payload;
            if (errorType) {
                state.error[errorType] = null;
            } else {
                // Clear all errors
                Object.keys(state.error).forEach(key => {
                    state.error[key] = null;
                });
            }
        },

        // Set current manager
        setCurrentManager: (state, action) => {
            state.currentManager = action.payload;
            state.ui.selectedManagerId = action.payload?._id || action.payload?.id;
        },

        // Clear current manager
        clearCurrentManager: (state) => {
            state.currentManager = null;
            state.allRounds = [];
            state.ui.selectedManagerId = null;
        },

        // UI actions
        showDeleteConfirmation: (state, action) => {
            state.ui.showDeleteConfirm = true;
            state.ui.deletingManagerId = action.payload;
        },

        hideDeleteConfirmation: (state) => {
            state.ui.showDeleteConfirm = false;
            state.ui.deletingManagerId = null;
        },

        // Reset loading states
        resetLoadingStates: (state) => {
            Object.keys(state.loading).forEach(key => {
                state.loading[key] = false;
            });
        }
    },

    extraReducers: (builder) => {
        // Fetch managers
        builder
            .addCase(fetchManagers.pending, (state) => {
                state.loading.managers = true;
                state.error.managers = null;
            })
            .addCase(fetchManagers.fulfilled, (state, action) => {
                state.loading.managers = false;
                state.managers = action.payload;
                state.error.managers = null;
            })
            .addCase(fetchManagers.rejected, (state, action) => {
                state.loading.managers = false;
                state.error.managers = action.payload;
            });

        // Fetch manager details
        builder
            .addCase(fetchManagerDetails.pending, (state) => {
                state.loading.details = true;
                state.error.details = null;
            })
            .addCase(fetchManagerDetails.fulfilled, (state, action) => {
                state.loading.details = false;
                state.currentManager = action.payload.manager;
                state.allRounds = action.payload.allRounds;
                state.ui.selectedManagerId = action.payload.manager._id;
                state.error.details = null;
            })
            .addCase(fetchManagerDetails.rejected, (state, action) => {
                state.loading.details = false;
                state.error.details = action.payload;
            });

        // Create manager
        builder
            .addCase(createManager.pending, (state) => {
                state.loading.create = true;
                state.error.create = null;
            })
            .addCase(createManager.fulfilled, (state, action) => {
                state.loading.create = false;
                console.log('Created manager payload:', action.payload); // Add this line
                state.managers.push(action.payload);
                state.error.create = null;
            })
            .addCase(createManager.rejected, (state, action) => {
                state.loading.create = false;
                state.error.create = action.payload;
            });

        // Update manager
        builder
            .addCase(updateManager.pending, (state) => {
                state.loading.update = true;
                state.error.update = null;
            })
            .addCase(updateManager.fulfilled, (state, action) => {
                state.loading.update = false;

                // Update in managers list
                const index = state.managers.findIndex(
                    manager => manager._id === action.payload._id || manager.id === action.payload.id
                );
                if (index !== -1) {
                    state.managers[index] = action.payload;
                }

                // Update current manager if it's the same one
                if (state.currentManager &&
                    (state.currentManager._id === action.payload._id ||
                        state.currentManager.id === action.payload.id)) {
                    state.currentManager = { ...state.currentManager, ...action.payload };
                }

                state.error.update = null;
            })
            .addCase(updateManager.rejected, (state, action) => {
                state.loading.update = false;
                state.error.update = action.payload;
            });

        // Delete manager
        builder
            .addCase(deleteManager.pending, (state) => {
                state.loading.delete = true;
                state.error.delete = null;
            })
            .addCase(deleteManager.fulfilled, (state, action) => {
                state.loading.delete = false;

                // Remove from managers list
                state.managers = state.managers.filter(
                    manager => manager._id !== action.payload && manager.id !== action.payload
                );

                // Clear current manager if it's the deleted one
                if (state.currentManager &&
                    (state.currentManager._id === action.payload ||
                        state.currentManager.id === action.payload)) {
                    state.currentManager = null;
                    state.allRounds = [];
                }

                // Reset UI state
                state.ui.showDeleteConfirm = false;
                state.ui.deletingManagerId = null;
                state.error.delete = null;
            })
            .addCase(deleteManager.rejected, (state, action) => {
                state.loading.delete = false;
                state.error.delete = action.payload;
            });
    }
});

// Export actions
export const {
    clearError,
    setCurrentManager,
    clearCurrentManager,
    showDeleteConfirmation,
    hideDeleteConfirmation,
    resetLoadingStates
} = managerSlice.actions;

// Selectors
export const selectManagers = (state) => state.managers.managers;
export const selectCurrentManager = (state) => state.managers.currentManager;
export const selectAllRounds = (state) => state.managers.allRounds;
export const selectManagersLoading = (state) => state.managers.loading.managers;
export const selectDetailsLoading = (state) => state.managers.loading.details;
export const selectCreateLoading = (state) => state.managers.loading.create;
export const selectUpdateLoading = (state) => state.managers.loading.update;
export const selectDeleteLoading = (state) => state.managers.loading.delete;
export const selectManagersError = (state) => state.managers.error.managers;
export const selectDetailsError = (state) => state.managers.error.details;
export const selectCreateError = (state) => state.managers.error.create;
export const selectUpdateError = (state) => state.managers.error.update;
export const selectDeleteError = (state) => state.managers.error.delete;
export const selectDeleteConfirmation = (state) => state.managers.ui.showDeleteConfirm;
export const selectDeletingManagerId = (state) => state.managers.ui.deletingManagerId;

// Export reducer
export default managerSlice.reducer;