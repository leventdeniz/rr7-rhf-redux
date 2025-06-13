import React from "react";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "~/lib/use-debounce";
import type { BankFormSchema } from "./validation-schema";

const BANK_FORM_SESSION_KEY = "bankdatenFormular";

export function getBankFormFromSession() {
  const sessionItem = sessionStorage.getItem(BANK_FORM_SESSION_KEY);
  if (!sessionItem) return null;
  try {
    const parsed = JSON.parse(sessionItem) as BankFormSchema;
    return parsed;
  } catch {
    return null;
  }
}

export function BankFormWatcher({ control }: { control: Control<BankFormSchema> }) {
  const watchedForm = useWatch<BankFormSchema>({ control });
  const debouncedForm = useDebounce(watchedForm, 1000);

  React.useEffect(() => {
    if (debouncedForm) {
      const sessionItem = getBankFormFromSession();
      if (sessionItem && JSON.stringify(debouncedForm) === JSON.stringify(sessionItem)) {
        toast.info("Formular unverändert", { closeButton: true });
      } else {
        sessionStorage.setItem(BANK_FORM_SESSION_KEY, JSON.stringify(debouncedForm));
        toast.success("Formular gespeichert", { closeButton: true });
      }
    }
  }, [debouncedForm]);

  return null;
} 