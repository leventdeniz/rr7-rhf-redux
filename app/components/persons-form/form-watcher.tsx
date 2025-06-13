import React from "react";
import type { Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "~/lib/use-debounce";
import type { FormSchema } from "./validation-schema";
import { formSchema } from "./validation-schema";

const PERSON_FORM_SESSION_KEY = "personenFormular";

export function getPersonsFormFromSession() {
  const sessionItem = sessionStorage.getItem(PERSON_FORM_SESSION_KEY);
  if (!sessionItem) return null;
  try {
    const parsed = JSON.parse(sessionItem) as FormSchema;
    // TODO: validate parsed
    return parsed;
  } catch {
    return null;
  }
}

export function FormWatcher({ control }: { control: Control<FormSchema> }) {
  const watchedForm = useWatch<FormSchema>({ control });
  const debouncedForm = useDebounce(watchedForm, 1000);

  React.useEffect(() => {
    if (debouncedForm) {
      const sessionItem = getPersonsFormFromSession();
      if (sessionItem && JSON.stringify(debouncedForm) === JSON.stringify(sessionItem)) {
        toast.info("Formular unverändert", { closeButton: true });
      } else {
        sessionStorage.setItem(PERSON_FORM_SESSION_KEY, JSON.stringify(debouncedForm));
        toast.success("Formular gespeichert", { closeButton: true });
      }
    }
  }, [debouncedForm]);

  return null;
}
