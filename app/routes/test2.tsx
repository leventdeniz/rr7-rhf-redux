import React from "react";
import PersonenFormular from "../components/persons-form/PersonenFormular";
import { useAppSelector } from "~/store/hooks";

export default function Test2() {
  const formData = useAppSelector(state => state.forms.personsForm);
  
  return (
    <main className="flex items-center justify-center pt-8 pb-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
        <h1 className="text-2xl font-bold">Test-Seite 2</h1>
        <p>Dies ist eine weitere einfache Test-Seite.</p>
        <PersonenFormular defaultValues={formData} />
      </div>
    </main>
  );
} 
