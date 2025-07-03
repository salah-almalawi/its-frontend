import { configureStore } from "@reduxjs/toolkit";
import managerReducer from './slices/managerSlice';
import roundsReducer from './slices/roundsSlice';

export const store = configureStore({
    reducer: {
        managers: managerReducer,
        rounds: roundsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

