import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Straße ist erforderlich"),
  city: z.string().min(1, "Stadt ist erforderlich"),
  postalCode: z.string().min(1, "Postleitzahl ist erforderlich"),
  country: z.string().min(1, "Land ist erforderlich"),
});

export const personSchema = z.object({
  id: z.string().optional(), // Optional für neue Personen
  firstName: z.string().min(1, "Vorname ist erforderlich"),
  lastName: z.string().min(1, "Nachname ist erforderlich"),
  email: z.string().email("Gültige E-Mail-Adresse ist erforderlich"),
  dateOfBirth: z.string().min(1, "Geburtsdatum ist erforderlich"),
  address: addressSchema,
});

export const formSchema = z.object({
  persons: z.array(personSchema).min(1, "Mindestens eine Person erforderlich"),
});

export type FormSchema = z.infer<typeof formSchema>;
export type PersonSchema = z.infer<typeof personSchema>;
export type AddressSchema = z.infer<typeof addressSchema>;
