import React from "react";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "~/lib/use-debounce";
import type { FormSchema } from "./validation-schema";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { updatePersonsForm } from "~/store/slices/formSlice";

export function ReduxFormWatcher({ control }: { control: Control<FormSchema> }) {
  const dispatch = useAppDispatch();
  const currentFormData = useAppSelector(state => state.forms.personsForm);
  
  const watchedForm = useWatch<FormSchema>({ control });
  const debouncedForm = useDebounce(watchedForm, 1000);

  React.useEffect(() => {
    if (!debouncedForm) return;
    
    // Vergleiche mit den aktuellen Redux-Daten
    if (currentFormData && JSON.stringify(debouncedForm) === JSON.stringify(currentFormData)) {
      toast.info("Formular unverändert", { closeButton: true });
      return;
    }
    
    // Aktualisiere Redux Store
    dispatch(updatePersonsForm(debouncedForm));
    toast.success("Formular gespeichert", { closeButton: true });
  }, [debouncedForm, dispatch, currentFormData]);

  return null;
} 