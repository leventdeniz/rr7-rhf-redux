import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FormSchema } from '~/components/persons-form/validation-schema';
import type { BankFormSchema } from '~/components/bank-form/validation-schema';

export interface FormState {
  personsForm: FormSchema | null;
  bankForm: BankFormSchema | null;
  lastUpdated: {
    personsForm: number | null;
    bankForm: number | null;
  };
}

const initialState: FormState = {
  personsForm: null,
  bankForm: null,
  lastUpdated: {
    personsForm: null,
    bankForm: null,
  },
};

export const formSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    updatePersonsForm: (state, action: PayloadAction<FormSchema>) => {
      state.personsForm = action.payload;
      state.lastUpdated.personsForm = Date.now();
    },
    updateBankForm: (state, action: PayloadAction<BankFormSchema>) => {
      state.bankForm = action.payload;
      state.lastUpdated.bankForm = Date.now();
    },
    clearPersonsForm: (state) => {
      state.personsForm = null;
      state.lastUpdated.personsForm = null;
    },
    clearBankForm: (state) => {
      state.bankForm = null;
      state.lastUpdated.bankForm = null;
    },
    clearAllForms: (state) => {
      state.personsForm = null;
      state.bankForm = null;
      state.lastUpdated.personsForm = null;
      state.lastUpdated.bankForm = null;
    },
    // Action für das Laden der Daten aus dem Storage
    hydrateForms: (state, action: PayloadAction<Partial<FormState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  updatePersonsForm,
  updateBankForm,
  clearPersonsForm,
  clearBankForm,
  clearAllForms,
  hydrateForms,
} = formSlice.actions;

export const formReducer = formSlice.reducer; 