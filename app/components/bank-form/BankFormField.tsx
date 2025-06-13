import React from "react";
import { Input } from "../ui/input";
import { useController } from "react-hook-form";
import type {
  Control,
  FieldPath,
} from "react-hook-form";
import type { BankFormSchema } from "./validation-schema";

interface BankFormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  path: FieldPath<BankFormSchema>;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  control: Control<BankFormSchema>;
}

export function BankFormField({
  label,
  path,
  control,
  className = "",
  labelClassName = "",
  errorClassName = "",
  ...inputProps
}: BankFormFieldProps) {
  const {
    field,
    fieldState: { error },
  } = useController<BankFormSchema>({
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