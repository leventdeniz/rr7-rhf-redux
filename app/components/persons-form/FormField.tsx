import React from "react";
import { Input } from "../ui/input";
import { useController, useFormContext, useFormState } from "react-hook-form";
import type {
  Control,
  FieldError,
  FieldErrorsImpl,
  FieldPath,
  Merge,
} from "react-hook-form";
import { useFormAction } from "react-router";
import type { FormSchema } from "./validation-schema";

// path: string ist jetzt Pflicht, alle weiteren Input-Props werden direkt übergeben
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  path: FieldPath<FormSchema>;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  control: Control<FormSchema>;
}

export function FormField({
  label,
  path,
  control,
  className = "",
  labelClassName = "",
  errorClassName = "",
  ...inputProps
}: FormFieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController<FormSchema>({
    control: control,
    name: path,
  });

  return (
    <div className={`mb-2 ${className}`}>
      <label
        className={`block text-sm text-muted-foreground italic mb-1 ${labelClassName}`}
      >
        {label}
      </label>
      {/*
        value darf bei <input> nur string, number oder string[] sein.
        Mit useController kann field.value aber auch ein Objekt oder Array von Objekten sein (z.B. bei verschachtelten Feldern).
        Deshalb prüfen wir hier explizit und setzen value sonst auf einen leeren String, um Fehler zu vermeiden.
      */}
      <Input
        {...field}
        {...inputProps}
        value={
          typeof field.value === "string" ||
          typeof field.value === "number"
            ? field.value
            : Array.isArray(field.value) && field.value.every(v => typeof v === "string")
              ? field.value
              : ""
        }
      />
      {error && (
        <span className={`text-red-500 text-xs ${errorClassName}`}>
          {error.message}
        </span>
      )}
    </div>
  );
}
