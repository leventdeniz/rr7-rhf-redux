import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { BankFormField } from "./BankFormField";

import { bankFormSchema, type BankFormSchema } from "./validation-schema";
import { ReduxBankFormWatcher } from "./ReduxBankFormWatcher";
import IconTrash from '~/components/icons/icon-trash';

export type BankdatenFormularProps = {
  defaultValues?: BankFormSchema | null;
};

export default function BankdatenFormular({ defaultValues }: BankdatenFormularProps) {
  const {
    control,
    handleSubmit,
  } = useForm<BankFormSchema>({
    resolver: zodResolver(bankFormSchema),
    defaultValues: defaultValues ?? { bankdaten: [{ iban: "", kontoinhaber: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bankdaten",
  });

  function onSubmit(data: BankFormSchema) {
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-xl">
      <ReduxBankFormWatcher control={control} />
      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-lg p-4 mb-4 relative">
          <BankFormField
            label="IBAN"
            placeholder="DE89 3704 0044 0532 0130 00"
            path={`bankdaten.${index}.iban`}
            control={control}
            style={{ textTransform: 'uppercase' }}
          />
          <BankFormField
            label="Kontoinhaber"
            placeholder="Max Mustermann"
            path={`bankdaten.${index}.kontoinhaber`}
            control={control}
          />
          {fields.length > 1 && (
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2" 
              onClick={() => remove(index)}
            >
              <IconTrash />
            </Button>
          )}
        </div>
      ))}
      <Button 
        type="button" 
        onClick={() => append({ iban: "", kontoinhaber: "" })}
      >
        Weitere Bankverbindung hinzufügen
      </Button>
      <Button type="submit" className="ml-4">Absenden</Button>
    </form>
  );
} 