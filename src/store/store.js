import { configureStore } from "@reduxjs/toolkit";
import managerReducer from './slices/managerSlice';

export const store = configureStore({
    reducer: {
        managers: managerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;