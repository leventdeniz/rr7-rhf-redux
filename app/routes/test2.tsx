import { Suspense } from "react";
import PersonenFormular from "../components/persons-form/PersonenFormular";
import { Await, useLoaderData } from "react-router";
import queryClient from "~/data-domain/query-client";
import {
  getPersonsSuggestionsQuery,
  key,
} from "~/data-domain/queries/get-persons-suggestions/get-persons-suggestions.query";
import type { Route } from "./+types/test2";
import { keepPreviousData, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {unstable_ViewTransition as ViewTransition} from 'react';
import type { PersonsData } from "~/data-domain/queries/get-persons-suggestions/response.type";

export const clientLoader = () => {
  const data = queryClient.fetchQuery({
    queryKey: [key],
    queryFn: getPersonsSuggestionsQuery,
  });

  // await Promise.race([new Promise((resolve) => setTimeout(resolve, 30)), data]);

  return {
    personsData: data,
  };
};

const FormWrapper = () => {
  const { data } = useSuspenseQuery<PersonsData>({
    queryKey: [key],
    queryFn: getPersonsSuggestionsQuery,
  });

  return <PersonenFormular defaultValues={data} />;
}

export default function Test2() {
  // const { personsData } = useLoaderData<typeof clientLoader>();
  /*const data = queryClient.fetchQuery({
    queryKey: [key],
    queryFn: getPersonsSuggestionsQuery,
  });*/

  return (
    <ViewTransition enter="slide-in" exit="slide-out">
      <main className="flex items-center justify-center pt-8 pb-4">
        <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
          <h1 className="text-2xl font-bold">Test-Seite 2</h1>
          <p>Dies ist eine weitere einfache Test-Seite.</p>
          {/*<Suspense fallback={<div>Loading...</div>}>
            <Await resolve={personsData} errorElement={<PersonenFormular/>}>
              {(personsData) => <ViewTransition><PersonenFormular defaultValues={personsData}/></ViewTransition>}
            </Await>
          </Suspense>*/}
          <Suspense fallback={<div>Loading...</div>}>
            <ViewTransition><FormWrapper /></ViewTransition>
          </Suspense>
        </div>
      </main>
    </ViewTransition>
  );
}
