import React from "react";

export default function Home() {
  return (
    <main className="flex items-center justify-center py-8 px-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0 max-w-4xl">
        <h1 className="text-3xl font-bold">Willkommen zu deiner Anwendung</h1>
        <p className="text-gray-600 text-center">
          Hier findest du deine Formulare für Personen- und Bankdaten. 
          Nutze die Navigation oben, um zwischen den verschiedenen Seiten zu wechseln.
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Personendaten</h2>
            <p className="text-gray-500 mb-4">
              Erfasse und verwalte Personendaten mit Adressen und Kontaktinformationen.
            </p>
            <a href="/test1" className="text-blue-600 hover:underline">
              Zu den Personendaten →
            </a>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Bankdaten</h2>
            <p className="text-gray-500 mb-4">
              Verwalte Bankverbindungen und IBAN-Informationen sicher.
            </p>
            <a href="/test2" className="text-blue-600 hover:underline">
              Zu den Bankdaten →
            </a>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 max-w-2xl">
          <p>
            Diese Anwendung nutzt React Hook Form für die Formularverarbeitung 
            und bietet eine moderne, benutzerfreundliche Oberfläche.
          </p>
        </div>
      </div>
    </main>
  );
}
