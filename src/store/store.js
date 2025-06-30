import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import managersReducer from "../features/managers/managersSlice";
import roundsReducer from "../features/rounds/roundsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        managers: managersReducer,
        rounds: roundsReducer,
    },
});