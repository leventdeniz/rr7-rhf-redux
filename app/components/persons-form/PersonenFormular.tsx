import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuid } from 'uuid';

import { Button } from "../ui/button";
import { FormField } from "./FormField";

import { formSchema, type FormSchema } from "./validation-schema";
import IconTrash from '~/components/icons/icon-trash';

// Props-Typ für defaultValues
export type PersonenFormularProps = {
  defaultValues?: FormSchema | null;
};

export default function PersonenFormular({ defaultValues }: PersonenFormularProps) {
  const {
    control,
    handleSubmit,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? { personen: [{ key: uuid(), vorname: "", nachname: "", adresse: { strasse: "", hausnummer: "", plz: "", stadt: "" }, geburtsdatum: "", telefonnummer: "" }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "personen",
  });

  function onSubmit(data: FormSchema) {
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-xl">
      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-lg p-4 mb-4 relative">
          <FormField
            label="Vorname"
            placeholder="Vorname"
            path={`personen.${index}.vorname`}
            control={control}
          />
          <FormField
            label="Nachname"
            placeholder="Nachname"
            path={`personen.${index}.nachname`}
            control={control}
          />
          <div className="mb-2 grid grid-cols-2 gap-2">
            <div>
              <FormField
                label="Straße"
                placeholder="Straße"
                path={`personen.${index}.adresse.strasse`}
                control={control}
              />
            </div>
            <div>
              <FormField
                label="Hausnummer"
                placeholder="Hausnummer"
                path={`personen.${index}.adresse.hausnummer`}
                control={control}
              />
            </div>
          </div>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <div>
              <FormField
                label="Postleitzahl"
                placeholder="Postleitzahl"
                path={`personen.${index}.adresse.plz`}
                control={control}
              />
            </div>
            <div>
              <FormField
                label="Stadt"
                placeholder="Stadt"
                path={`personen.${index}.adresse.stadt`}
                control={control}
              />
            </div>
          </div>
          <FormField
            label="Geburtsdatum"
            placeholder="Geburtsdatum"
            path={`personen.${index}.geburtsdatum`}
            control={control}
            type="date"
          />
          <FormField
            label="Telefonnummer"
            placeholder="Telefonnummer"
            path={`personen.${index}.telefonnummer`}
            control={control}
          />
          {fields.length > 1 && index > 0 && (
            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
              <IconTrash />
            </Button>
          )}
        </div>
      ))}
      <Button type="button" onClick={() => append({ key: uuid(), vorname: "", nachname: "", adresse: { strasse: "", hausnummer: "", plz: "", stadt: "" }, geburtsdatum: "", telefonnummer: "" })}>
        Weitere Person hinzufügen
      </Button>
      <Button type="submit" className="ml-4">Absenden</Button>
    </form>
  );
}
