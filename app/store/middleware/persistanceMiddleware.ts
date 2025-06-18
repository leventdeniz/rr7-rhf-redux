import type { Middleware } from "@reduxjs/toolkit";
import { type FormState } from "../slices/formSlice";

const STORAGE_KEY = "redux-form-data";

// Hilfsfunktionen für Storage-Operationen
export const loadFromStorage = (): Partial<FormState> | undefined => {
  if (typeof window === "undefined") return;

  try {
    const item = sessionStorage.getItem(STORAGE_KEY);
    if (!item) return undefined;

    const parsed = JSON.parse(item);
    return parsed;
  } catch (error) {
    console.warn("Fehler beim Laden der Formulardaten aus dem Storage:", error);
    return undefined;
  }
};

const saveToStorage = (state: FormState) => {
  if (typeof window === "undefined") return;

  try {
    const serialized = JSON.stringify(state);
    sessionStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.warn("Fehler beim Speichern der Formulardaten im Storage:", error);
  }
};

// Debounce-Utility für das Speichern
let saveTimeout: NodeJS.Timeout | null = null;
const debouncedSave = (state: FormState) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(() => {
    saveToStorage(state);
  }, 1000); // 1 Sekunde Debounce
};

export const persistanceMiddleware: Middleware = (store) => {
  return (next) => (action) => {
    const response = next(action);

    // Nach jeder Action die sich auf Formulare auswirkt, speichern
    if (action.type.startsWith("forms/")) {
      const state = store.getState();
      debouncedSave(state.forms);
    }

    return response;
  };
};
