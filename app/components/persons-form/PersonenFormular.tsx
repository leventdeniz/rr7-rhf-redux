import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { FormField } from "./FormField";
import {
  useBulkUpdatePersonsMutation,
  useDeletePersonMutation,
} from "~/data-domain";

import { formSchema, type FormSchema } from "./validation-schema";
import IconTrash from "~/components/icons/icon-trash";
import IconCopyX from "../icons/icon-copy-x";

// Props-Typ für defaultValues
export type PersonenFormularProps = {
  defaultValues?: FormSchema | null;
};

export default function PersonenFormular({
  defaultValues,
}: PersonenFormularProps) {
  const bulkUpdateMutation = useBulkUpdatePersonsMutation();
  const deletePersonMutation = useDeletePersonMutation();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      persons: [
        {
          firstName: "",
          lastName: "",
          email: "",
          dateOfBirth: "",
          address: {
            street: "",
            city: "",
            postalCode: "",
            country: "Deutschland",
          },
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "persons",
  });

  // Aktueller Formular-Zustand überwachen
  const watchedPersons = watch("persons");

  async function onSubmit(data: FormSchema) {
    try {
      const result = await bulkUpdateMutation.mutateAsync(data.persons);

      if (result.warnings && result.warnings.length > 0) {
        toast.warning(`Teilweise erfolgreich: ${result.message}`, {
          description: result.warnings.join(", "),
        });
      } else {
        toast.success(`${result.total} Personen erfolgreich gespeichert!`);
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      toast.error("Fehler beim Speichern der Personen");
    }
  }

  async function handleDeletePerson(index: number) {
    const person = watchedPersons[index];

    // Prüfen ob Person eine ID hat (existiert in der Datenbank)
    if (person.id) {
      // Person aus Datenbank löschen
      if (
        confirm(
          `Person "${person.firstName} ${person.lastName}" wirklich löschen?`
        )
      ) {
        try {
          await deletePersonMutation.mutateAsync(person.id);
          toast.success(
            `Person "${person.firstName} ${person.lastName}" erfolgreich gelöscht!`
          );
          // Person auch aus Formular entfernen
          remove(index);
        } catch (error: any) {
          console.error("Fehler beim Löschen:", error);

          // Spezielle Behandlung für 409 Konflikt (Person hat Bankkonten)
          if (error?.status === 409) {
            toast.error(
              "Person kann nicht gelöscht werden, da sie noch Bankkonten besitzt."
            );
          } else {
            toast.error("Fehler beim Löschen der Person", {
              description: deletePersonMutation.error?.message,
              duration: 10000,
            });
          }
        }
      }
    } else {
      // Neue Person (ohne ID) - nur aus Formular entfernen
      remove(index);
      toast.info("Person aus Formular entfernt");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-xl"
    >
      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-lg p-4 mb-4 relative">
          <FormField
            label="Vorname"
            placeholder="Vorname"
            path={`persons.${index}.firstName`}
            control={control}
          />
          <FormField
            label="Nachname"
            placeholder="Nachname"
            path={`persons.${index}.lastName`}
            control={control}
          />
          <FormField
            label="E-Mail"
            placeholder="E-Mail-Adresse"
            path={`persons.${index}.email`}
            control={control}
            type="email"
          />
          <FormField
            label="Geburtsdatum"
            placeholder="Geburtsdatum"
            path={`persons.${index}.dateOfBirth`}
            control={control}
            type="date"
          />
          <div className="mb-2">
            <FormField
              label="Straße"
              placeholder="Straße"
              path={`persons.${index}.address.street`}
              control={control}
            />
          </div>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <div>
              <FormField
                label="Postleitzahl"
                placeholder="Postleitzahl"
                path={`persons.${index}.address.postalCode`}
                control={control}
              />
            </div>
            <div>
              <FormField
                label="Stadt"
                placeholder="Stadt"
                path={`persons.${index}.address.city`}
                control={control}
              />
            </div>
          </div>
          <FormField
            label="Land"
            placeholder="Land"
            path={`persons.${index}.address.country`}
            control={control}
          />
          {fields.length > 1 && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => handleDeletePerson(index)}
              disabled={deletePersonMutation.isPending}
              title={
                watchedPersons[index]?.id
                  ? "Person aus Datenbank löschen"
                  : "Person aus Formular entfernen"
              }
            >
              {watchedPersons[index]?.id ? <IconTrash /> : <IconCopyX />}
            </Button>
          )}
        </div>
      ))}
      <div className="flex gap-4">
        <Button
          type="button"
          onClick={() =>
            append({
              firstName: "",
              lastName: "",
              email: "",
              dateOfBirth: "",
              address: {
                street: "",
                city: "",
                postalCode: "",
                country: "Deutschland",
              },
            })
          }
          disabled={isSubmitting}
        >
          Weitere Person hinzufügen
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting || bulkUpdateMutation.isPending}
        >
          {isSubmitting || bulkUpdateMutation.isPending
            ? "Speichere..."
            : "Speichern"}
        </Button>
      </div>
    </form>
  );
}
