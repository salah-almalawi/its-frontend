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

// For TypeScript users: uncomment these lines and rename file to store.ts
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;