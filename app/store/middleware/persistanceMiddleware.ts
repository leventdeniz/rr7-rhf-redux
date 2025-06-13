import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { hydrateForms, type FormState } from '../slices/formSlice';

const STORAGE_KEY = 'redux-form-data';

// Hilfsfunktionen für Storage-Operationen
const loadFromStorage = (): Partial<FormState> | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    return parsed;
  } catch (error) {
    console.warn('Fehler beim Laden der Formulardaten aus dem Storage:', error);
    return null;
  }
};

const saveToStorage = (state: FormState) => {
  if (typeof window === 'undefined') return;
  
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.warn('Fehler beim Speichern der Formulardaten im Storage:', error);
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

export const persistanceMiddleware: Middleware<{}, RootState> = (store) => {
  // Beim ersten Laden die Daten aus dem Storage laden
  if (typeof window !== 'undefined') {
    const savedData = loadFromStorage();
    if (savedData) {
      store.dispatch(hydrateForms(savedData));
    }
  }
  
  return (next) => (action) => {
    const result = next(action);
    
    // Nach jeder Action die sich auf Formulare auswirkt, speichern
    if (action.type.startsWith('forms/')) {
      const state = store.getState();
      debouncedSave(state.forms);
    }
    
    return result;
  };
}; 