import { Suspense } from "react";
import PersonenFormular from "../components/persons-form/PersonenFormular";
import { useGetPersonsSuspenseQuery } from "~/data-domain/hooks/get-persons-suspense.query";
import {unstable_ViewTransition as ViewTransition} from 'react';

const FormWrapper = () => {
  const { data } = useGetPersonsSuspenseQuery({});

  // API-Daten direkt verwenden - keine Transformation nötig
  const formData = data?.data ? { persons: data.data } : null;

  return <PersonenFormular defaultValues={formData} />;
}

export default function Test2() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <main className="flex items-center justify-center pt-8 pb-20 px-2">
        <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
          <h1 className="text-2xl font-bold">Test-Seite 2</h1>
          <p>Dies ist eine weitere einfache Test-Seite.</p>
          <Suspense fallback={<div>Loading...</div>}>
            <ViewTransition><FormWrapper /></ViewTransition>
          </Suspense>
        </div>
      </main>
    </ViewTransition>
  );
}
