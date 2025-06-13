import { z } from "zod";

export const bankdatenSchema = z.object({
  iban: z.string()
    .min(15, "IBAN muss mindestens 15 Zeichen haben")
    .max(34, "IBAN darf maximal 34 Zeichen haben")
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/, "IBAN-Format ist ungültig"),
  kontoinhaber: z.string().min(1, "Kontoinhaber ist erforderlich"),
});

export const bankFormSchema = z.object({
  bankdaten: z.array(bankdatenSchema).min(1, "Mindestens eine Bankverbindung erforderlich"),
});

export type BankFormSchema = z.infer<typeof bankFormSchema>; 