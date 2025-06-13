import { z } from "zod";

export const personSchema = z.object({
    vorname: z.string().min(1, "Vorname ist erforderlich"),
    nachname: z.string().min(1, "Nachname ist erforderlich"),
    adresse: z.object({
      strasse: z.string().min(1, "Straße ist erforderlich"),
      hausnummer: z.string().min(1, "Hausnummer ist erforderlich"),
      plz: z.string().min(1, "Postleitzahl ist erforderlich"),
      stadt: z.string().min(1, "Stadt ist erforderlich"),
    }),
    geburtsdatum: z.string().min(1, "Geburtsdatum ist erforderlich"),
    telefonnummer: z.string().min(1, "Telefonnummer ist erforderlich"),
  });
  
  export const formSchema = z.object({
    personen: z.array(personSchema).min(1, "Mindestens eine Person erforderlich"),
  });
  
  export type FormSchema = z.infer<typeof formSchema>;
  