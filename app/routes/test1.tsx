import React from "react";
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function Test1() {
  return (
    <ViewTransition default="slide-in" enter="slide-in" exit="slide-out">
      <main className="flex items-center justify-center pt-8 pb-4">
        <div className="flex-1 flex flex-col items-center gap-8 min-h-0">
          <h1 className="text-2xl font-bold">Test-Seite 1</h1>
          <p>Dies ist eine einfache Test-Seite.</p>
        </div>
      </main>
    </ViewTransition>
  );
}
