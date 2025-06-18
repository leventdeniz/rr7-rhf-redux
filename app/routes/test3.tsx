import React from "react";
import BankdatenFormular from "../components/bank-form/BankdatenFormular";
import { loadFromStorage } from "~/store/middleware/persistanceMiddleware";
import { useLoaderData } from "react-router";

export const clientLoader = async () => {
  const formData = loadFromStorage();
  return { bankForm: formData?.bankForm };
};

export default function Test3() {
  const { bankForm: formDataFromLoader } = useLoaderData<typeof clientLoader>();
  
  return (
    <main className="flex items-center justify-center pt-8 pb-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
        <h1 className="text-2xl font-bold">Test-Seite 3</h1>
        <p>Dies ist die dritte einfache Test-Seite mit Bankdaten-Formular.</p>
        <BankdatenFormular defaultValues={formDataFromLoader} />
      </div>
    </main>
  );
}