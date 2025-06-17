import { configureStore } from "@reduxjs/toolkit";
import { formSlice, initialState } from "./slices/formSlice";
import {
  loadFromStorage,
  persistanceMiddleware,
} from "./middleware/persistanceMiddleware";

export const store = configureStore({
  reducer: {
    [formSlice.name]: formSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignoriere diese Action-Typen für die Serialisierbarkeits-Checks
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(persistanceMiddleware),
  preloadedState: {
    [formSlice.name]: {
      ...initialState,
      ...loadFromStorage(),
    },
  },
});

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
