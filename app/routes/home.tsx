import React from "react";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { clearAllForms, clearPersonsForm, clearBankForm } from "~/store/slices/formSlice";
import { Button } from "~/components/ui/button";

export default function Home() {
  const dispatch = useAppDispatch();
  const { personsForm, bankForm, lastUpdated } = useAppSelector(state => state.forms);

  const handleClearAll = () => {
    dispatch(clearAllForms());
  };

  const handleClearPersons = () => {
    dispatch(clearPersonsForm());
  };

  const handleClearBank = () => {
    dispatch(clearBankForm());
  };

  return (
    <main className="flex items-center justify-center py-8 px-4">
      <div className="flex-1 flex flex-col items-center gap-8 min-h-0 max-w-4xl">
        <h1 className="text-3xl font-bold">Redux Formular-Daten</h1>
        <p className="text-gray-600 text-center">
          Hier siehst du alle gespeicherten Formulardaten aus dem Redux Store. 
          Die Daten sind seitenübergreifend verfügbar und werden automatisch persistiert.
        </p>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personendaten */}
          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Personendaten</h2>
              {personsForm && (
                <Button variant="outline" size="sm" onClick={handleClearPersons}>
                  Löschen
                </Button>
              )}
            </div>
            {personsForm ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Zuletzt aktualisiert: {lastUpdated.personsForm ? new Date(lastUpdated.personsForm).toLocaleString('de-DE') : 'Nie'}
                </p>
                <div className="text-sm">
                  <strong>Anzahl Personen:</strong> {personsForm.personen.length}
                </div>
                {personsForm.personen.map((person, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <div><strong>Name:</strong> {person.vorname} {person.nachname}</div>
                    <div><strong>Adresse:</strong> {person.adresse.strasse} {person.adresse.hausnummer}, {person.adresse.plz} {person.adresse.stadt}</div>
                    {person.geburtsdatum && <div><strong>Geburt:</strong> {person.geburtsdatum}</div>}
                    {person.telefonnummer && <div><strong>Telefon:</strong> {person.telefonnummer}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Keine Personendaten gespeichert</p>
            )}
          </div>

          {/* Bankdaten */}
          <div className="border rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Bankdaten</h2>
              {bankForm && (
                <Button variant="outline" size="sm" onClick={handleClearBank}>
                  Löschen
                </Button>
              )}
            </div>
            {bankForm ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Zuletzt aktualisiert: {lastUpdated.bankForm ? new Date(lastUpdated.bankForm).toLocaleString('de-DE') : 'Nie'}
                </p>
                <div className="text-sm">
                  <strong>Anzahl Bankverbindungen:</strong> {bankForm.bankdaten.length}
                </div>
                {bankForm.bankdaten.map((bank, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <div><strong>IBAN:</strong> {bank.iban}</div>
                    <div><strong>Kontoinhaber:</strong> {bank.kontoinhaber}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Keine Bankdaten gespeichert</p>
            )}
          </div>
        </div>

        {/* Aktionen */}
        <div className="flex gap-4 flex-wrap justify-center">
          <Button variant="destructive" onClick={handleClearAll}>
            Alle Daten löschen
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500 max-w-2xl">
          <p>
            Die Formulardaten werden automatisch im lokalen Browser-Storage gespeichert 
            und beim nächsten Besuch wieder geladen. Du kannst zwischen den Seiten wechseln, 
            und deine Eingaben bleiben erhalten.
          </p>
        </div>
      </div>
    </main>
  );
}
