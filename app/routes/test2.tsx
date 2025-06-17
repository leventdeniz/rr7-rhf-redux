import React from "react";
import PersonenFormular from "../components/persons-form/PersonenFormular";
import { loadFromStorage } from "~/store/middleware/persistanceMiddleware";
import { useLoaderData } from "react-router";

export const clientLoader = async () => {
  const formData = loadFromStorage();
  return { personsForm: formData?.personsForm };
};

export default function Test2() {
  const { personsForm: formDataFromLoader } = useLoaderData<typeof clientLoader>();

  return (
    <main className="flex items-center justify-center pt-8 pb-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
        <h1 className="text-2xl font-bold">Test-Seite 2</h1>
        <p>Dies ist eine weitere einfache Test-Seite.</p>
        <PersonenFormular defaultValues={formDataFromLoader} />
      </div>
    </main>
  );
} 
