import React, { Suspense } from "react";
import PersonenFormular from "../components/persons-form/PersonenFormular";
import { loadFromStorage } from "~/store/middleware/persistanceMiddleware";
import { Await, useLoaderData } from "react-router";
import uniqBy from "lodash/uniqBy";

type PersonsData = {
  personen: {
    key: string;
    vorname: string;
    nachname: string;
    adresse: {
      strasse: string;
      hausnummer: string;
      plz: string;
      stadt: string;
    };
    geburtsdatum: string;
    telefonnummer: string;
  }[];
};


const fakeRequestPersonsData = () => {
  return new Promise<PersonsData>((resolve) => {
    setTimeout(() => {
      resolve({personen: [{
        key: "1",
        vorname: "Max",
        nachname: "Mustermann",
        adresse: {
            strasse: "Musterstraße 1",
            hausnummer: "1",
            plz: "12345",
            stadt: "Musterstadt",
          },
          geburtsdatum: "1990-01-01",
          telefonnummer: "1234567890",
        },
      ]});
    }, 4000);
  });
};

export const clientLoader = async () => {
  const formData = loadFromStorage();
  const personsData = fakeRequestPersonsData();
  return { personsForm: formData?.personsForm, personsData };
};

export default function Test2() {
  const { personsForm: formDataFromLoader, personsData } = useLoaderData<typeof clientLoader>();

  return (
    <main className="flex items-center justify-center pt-8 pb-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
        <h1 className="text-2xl font-bold">Test-Seite 2</h1>
        <p>Dies ist eine weitere einfache Test-Seite.</p>
        <Suspense fallback={<div>Loading...</div>} >
          <Await resolve={personsData} errorElement={
            <PersonenFormular defaultValues={{personen: [
              ...(formDataFromLoader?.personen ?? []),
            ]}} />
          }>
            {(personsData) => (
              <PersonenFormular defaultValues={{personen: uniqBy(
                [
                  ...(formDataFromLoader?.personen ?? []),
                  ...personsData.personen
                ],
                "key"
              )}} />
            )}
          </Await>
        </Suspense>
      </div>
    </main>
  );
} 
