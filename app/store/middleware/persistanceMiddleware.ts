import type { Action, Middleware, PayloadAction } from "@reduxjs/toolkit";
import { hydrateForms, type FormState } from "../slices/formSlice";
import type { StoreState } from '~/store';

const STORAGE_KEY = "redux-form-data";

// Hilfsfunktionen für Storage-Operationen
export const loadFromStorage = (): Partial<FormState> | undefined => {
  console.log("loadFromStorage", typeof window);
  if (typeof window === "undefined") return;

  try {
    const item = localStorage.getItem(STORAGE_KEY);
    console.log("item", item);
    if (!item) return undefined;

    const parsed = JSON.parse(item);
    console.log("parsed", parsed);
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
    localStorage.setItem(STORAGE_KEY, serialized);
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
/*     if (action.type.startsWith("forms/hydrateForms")) {
      return response;
    }

    console.log({action, window: typeof window});
    // Beim ersten Laden die Daten aus dem Storage laden
    if (typeof window !== "undefined") {
      const savedData = loadFromStorage();
      const state = store.getState() as StoreState;
      const lastUpdated = state.forms.lastUpdated.bankForm === null
       || state.forms.lastUpdated.personsForm === null;
      console.log({lastUpdated, savedData});
      if (savedData && lastUpdated) {
        store.dispatch(hydrateForms(savedData));
        if (action.type.startsWith("forms/")) {
          return response;
        }
      }
    }
 */

    // Nach jeder Action die sich auf Formulare auswirkt, speichern
    if (action.type.startsWith("forms/")) {
      const state = store.getState();
      debouncedSave(state.forms);
    }

    return response;
  };
};
