import React from "react";
import BankdatenFormular from "../components/bank-form/BankdatenFormular";
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function Test3() {
  return (
    <ViewTransition enter="slide-in" exit="slide-out">
    <main className="flex items-center justify-center pt-8 pb-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
        <h1 className="text-2xl font-bold">Test-Seite 3</h1>
        <p>Dies ist die dritte einfache Test-Seite mit Bankdaten-Formular.</p>
        <BankdatenFormular />
      </div>
    </main>
    </ViewTransition>
  );
}
