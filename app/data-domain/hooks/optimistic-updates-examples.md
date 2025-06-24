# Optimistic Updates - Verwendungsbeispiele

Diese Beispiele zeigen, wie du die implementierten Optimistic Updates nutzen kannst.

## Ansatz 1: Via Cache (Automatisch)

Die Mutations sind bereits so konfiguriert, dass sie automatisch optimistische Updates durchführen. Du musst nichts weiter tun:

```tsx
// Beispiel: Person erstellen
const createPersonMutation = useCreatePersonMutation();

const handleCreatePerson = () => {
  createPersonMutation.mutate({
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max@example.com'
  });
  // -> Person wird sofort in der UI angezeigt
  // -> Bei Fehler wird automatisch ein Rollback durchgeführt
};
```

## Ansatz 2: Via UI (Manuell)

Für mehr Kontrolle über die optimistische Anzeige:

### Beispiel: Personen Liste mit optimistischen Updates

```tsx
import { 
  useGetPersonsQuery, 
  useCreatePersonMutation,
  useOptimisticPersonCreation 
} from '~/data-domain';

const PersonsList = () => {
  const { data: persons } = useGetPersonsQuery();
  const createPersonMutation = useCreatePersonMutation();
  const optimisticPersons = useOptimisticPersonCreation();

  return (
    <div>
      <h2>Personen</h2>
      <ul>
        {/* Echte Personen */}
        {persons?.data?.map(person => (
          <li key={person.id}>
            {person.firstName} {person.lastName}
          </li>
        ))}
        
        {/* Optimistische Personen (noch nicht gespeichert) */}
        {optimisticPersons.map((optimistic, index) => (
          <li key={`optimistic-${index}`} className="opacity-50">
            {optimistic.variables?.firstName} {optimistic.variables?.lastName}
            <span className="text-sm text-gray-500">
              (wird gespeichert seit {new Date(optimistic.submittedAt).toLocaleTimeString()})
            </span>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={() => createPersonMutation.mutate({
          firstName: 'Neue',
          lastName: 'Person',
          email: 'neue@example.com'
        })}
      >
        Person hinzufügen
      </button>
    </div>
  );
};
```

### Beispiel: Bankkonten mit optimistischen Updates

```tsx
import { 
  useGetBankAccountsQuery,
  useCreateBankAccountMutation,
  useOptimisticBankAccountCreation
} from '~/data-domain';

const BankAccountsList = () => {
  const { data: bankAccounts } = useGetBankAccountsQuery();
  const createBankAccountMutation = useCreateBankAccountMutation();
  const optimisticBankAccounts = useOptimisticBankAccountCreation();

  return (
    <div>
      <h2>Bankkonten</h2>
      <ul>
        {/* Echte Bankkonten */}
        {bankAccounts?.data?.map(account => (
          <li key={account.id}>
            {account.bankName} - {account.accountNumber}
          </li>
        ))}
        
        {/* Optimistische Bankkonten */}
        {optimisticBankAccounts.map((optimistic, index) => (
          <li key={`optimistic-${index}`} className="opacity-50 italic">
            {optimistic.variables?.bankName} - {optimistic.variables?.accountNumber}
            <span className="text-sm text-gray-500">(wird erstellt...)</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### Beispiel: Globale Loading-States

```tsx
import { useAllPendingMutations, useIsMutationPending } from '~/data-domain';

const GlobalLoadingIndicator = () => {
  const pendingMutations = useAllPendingMutations();
  const isPersonCreating = useIsMutationPending(['createPerson']);
  
  if (pendingMutations.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white p-2 rounded">
      {isPersonCreating && <span>Person wird erstellt...</span>}
      <span>{pendingMutations.length} Aktionen werden verarbeitet</span>
    </div>
  );
};
```

## Wann welchen Ansatz verwenden?

### Via Cache (Automatisch)
- ✅ Weniger Code erforderlich
- ✅ Automatisches Rollback bei Fehlern
- ✅ Funktioniert überall wo die Query genutzt wird
- ✅ Ideal für die meisten Anwendungsfälle

### Via UI (Manuell)
- ✅ Mehr Kontrolle über die Darstellung
- ✅ Zusätzliche Informationen (submittedAt, etc.)
- ✅ Ideal für komplexe UI-Zustände
- ✅ Gut für gleichzeitige Mutations

## Fehlerbehandlung

```tsx
const PersonForm = () => {
  const createPersonMutation = useCreatePersonMutation();
  
  const handleSubmit = (data) => {
    createPersonMutation.mutate(data, {
      onError: (error) => {
        // Fehler behandeln
        console.error('Person konnte nicht erstellt werden:', error);
        // Bei Cache-Ansatz: Rollback erfolgt automatisch
        // Bei UI-Ansatz: Optimistische Anzeige verschwindet automatisch
      },
      onSuccess: (newPerson) => {
        console.log('Person erfolgreich erstellt:', newPerson);
        // Cache wird automatisch aktualisiert
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createPersonMutation.isPending}>
        {createPersonMutation.isPending ? 'Wird erstellt...' : 'Person erstellen'}
      </button>
    </form>
  );
};
```

## Performance-Tipps

1. **Debouncing**: Bei häufigen Updates verwende Debouncing
2. **Selective Updates**: Nutze spezifische Query Keys für gezielte Updates
3. **Error Boundaries**: Implementiere Error Boundaries für bessere Fehlerbehandlung
4. **Loading States**: Nutze die verschiedenen Mutation-States für bessere UX

Diese Implementierung folgt den [TanStack Query Best Practices](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates) und bietet sowohl einfache als auch erweiterte Optimistic Updates. 
