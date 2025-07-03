# Data Domain Integration

Diese Integration verbindet das React Router 7 Frontend mit dem Express Fake Backend über React Query.

## 🏗️ Struktur

```
app/data-domain/
├── types.ts                    # TypeScript-Interfaces für API
├── api-client.ts              # HTTP-Client-Funktionen
├── query-client.ts            # React Query Konfiguration
├── index.ts                   # Zentrale Exports
├── queries/                   # React Query Hooks
│   ├── get-persons/
│   │   ├── get-persons.query.ts
│   │   └── get-persons-suspense.query.ts
│   └── get-bank-accounts/
│       ├── get-bank-accounts.query.ts
│       └── get-bank-accounts-suspense.query.ts
└── mutations/                 # Mutation Hooks
    ├── create-person.mutation.ts
    ├── update-person.mutation.ts
    ├── create-bank-account.mutation.ts
    └── update-bank-account.mutation.ts
```

## 🚀 Verwendung

### 1. Import der benötigten Hooks

```typescript
import {
  useGetPersonsQuery,
  useGetPersonsSuspenseQuery,
  useCreatePersonMutation,
  useUpdatePersonMutation,
  useDeletePersonMutation,
  useBulkUpdatePersonsMutation,
  useGetBankAccountsQuery,
  useGetBankAccountsSuspenseQuery,
  useCreateBankAccountMutation,
  useUpdateBankAccountMutation,
  useDeleteBankAccountMutation,
  type Person,
  type CreatePersonRequest,
  type BankAccountWithPerson,
} from '../data-domain';
```

### 2. Personen abrufen (Standard Query)

```typescript
function PersonsComponent() {
  const { data, isLoading, error } = useGetPersonsQuery({
    firstName: 'Max',  // Optional: Filter
    lastName: '',      // Optional: Filter
    email: '',         // Optional: Filter
  });

  if (isLoading) return <div>Lade...</div>;
  if (error) return <div>Fehler: {error.message}</div>;

  const persons = data?.data || [];
  
  return (
    <div>
      {persons.map(person => (
        <div key={person.id}>
          {person.firstName} {person.lastName}
        </div>
      ))}
    </div>
  );
}
```

### 3. Personen abrufen (Suspense Query)

```typescript
import { Suspense } from 'react';

function PersonsSuspenseComponent() {
  const { data } = useGetPersonsSuspenseQuery({
    firstName: 'Max',  // Optional: Filter
  });

  // Kein isLoading oder error handling nötig - wird von Suspense übernommen
  const persons = data?.data || [];
  
  return (
    <div>
      {persons.map(person => (
        <div key={person.id}>
          {person.firstName} {person.lastName}
        </div>
      ))}
    </div>
  );
}

// Verwendung mit Suspense Boundary
function PersonsPageWithSuspense() {
  return (
    <Suspense fallback={<div>Lade Personen...</div>}>
      <PersonsSuspenseComponent />
    </Suspense>
  );
}
```

### 4. Person erstellen

```typescript
function CreatePersonForm() {
  const createPersonMutation = useCreatePersonMutation();

  const handleSubmit = async (formData: CreatePersonRequest) => {
    try {
      const result = await createPersonMutation.mutateAsync(formData);
      console.log('Person erstellt:', result.data);
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  return (
    <button 
      onClick={() => handleSubmit({
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@example.com',
        address: {
          street: 'Musterstraße 1',
          city: 'Berlin',
          postalCode: '10115',
          country: 'Deutschland'
        }
      })}
      disabled={createPersonMutation.isPending}
    >
      {createPersonMutation.isPending ? 'Erstelle...' : 'Person erstellen'}
    </button>
  );
}
```

### 5. Person löschen

```typescript
function DeletePersonButton({ personId }: { personId: string }) {
  const deletePersonMutation = useDeletePersonMutation();

  const handleDelete = async () => {
    if (confirm('Person wirklich löschen?')) {
      try {
        await deletePersonMutation.mutateAsync(personId);
        console.log('Person gelöscht');
      } catch (error) {
        console.error('Fehler beim Löschen:', error);
        // Behandle 409 Konflikt (Person hat noch Bankkonten)
        if (error.status === 409) {
          alert('Person kann nicht gelöscht werden, da sie noch Bankkonten besitzt.');
        }
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={deletePersonMutation.isPending}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      {deletePersonMutation.isPending ? 'Lösche...' : 'Löschen'}
    </button>
  );
}
```

### 6. Mehrere Personen auf einmal speichern (Bulk Update)

```typescript
function BulkUpdatePersonsForm() {
  const bulkUpdateMutation = useBulkUpdatePersonsMutation();

  const handleBulkUpdate = async () => {
    try {
      const result = await bulkUpdateMutation.mutateAsync([
        {
          // Neue Person (ohne ID)
          firstName: 'Anna',
          lastName: 'Müller',
          email: 'anna@example.com'
        },
        {
          // Update existierende Person (mit ID)
          id: 'existing-person-id',
          firstName: 'Max Updated',
          lastName: 'Mustermann'
        }
      ]);

      if (result.warnings && result.warnings.length > 0) {
        console.log('Teilweise erfolgreich:', result.message);
        console.log('Warnungen:', result.warnings);
      } else {
        console.log(`${result.total} Personen erfolgreich gespeichert`);
      }
    } catch (error) {
      console.error('Fehler:', error);
    }
  };

  return (
    <button 
      onClick={handleBulkUpdate}
      disabled={bulkUpdateMutation.isPending}
    >
      {bulkUpdateMutation.isPending ? 'Speichere...' : 'Bulk Update'}
    </button>
  );
}
```

### 7. Bankkonten abrufen (Standard Query)

```typescript
function BankAccountsComponent() {
  const { data, isLoading } = useGetBankAccountsQuery({
    isActive: true,        // Optional: Nur aktive Konten
    accountType: 'Giro',   // Optional: Filter nach Typ
  });

  const bankAccounts = data?.data || [];
  
  return (
    <div>
      {bankAccounts.map(account => (
        <div key={account.id}>
          <h3>{account.bankName}</h3>
          <p>Saldo: {account.balance} {account.currency}</p>
          {account.person && (
            <p>Inhaber: {account.person.firstName} {account.person.lastName}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 8. Bankkonten abrufen (Suspense Query)

```typescript
import { Suspense, ErrorBoundary } from 'react';

function BankAccountsSuspenseComponent() {
  const { data } = useGetBankAccountsSuspenseQuery({
    isActive: true,
  });

  const bankAccounts = data?.data || [];
  
  return (
    <div>
      {bankAccounts.map(account => (
        <div key={account.id}>
          <h3>{account.bankName}</h3>
          <p>Saldo: {account.balance} {account.currency}</p>
          {account.person && (
            <p>Inhaber: {account.person.firstName} {account.person.lastName}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// Verwendung mit Suspense und Error Boundary
function BankAccountsPageWithSuspense() {
  return (
    <ErrorBoundary fallback={<div>Fehler beim Laden der Bankkonten</div>}>
      <Suspense fallback={<div>Lade Bankkonten...</div>}>
        <BankAccountsSuspenseComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 9. Bankkonto löschen

```typescript
function DeleteBankAccountButton({ accountId }: { accountId: string }) {
  const deleteBankAccountMutation = useDeleteBankAccountMutation();

  const handleDelete = async () => {
    if (confirm('Bankkonto wirklich löschen?')) {
      try {
        await deleteBankAccountMutation.mutateAsync(accountId);
        console.log('Bankkonto gelöscht');
      } catch (error) {
        console.error('Fehler beim Löschen:', error);
      }
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={deleteBankAccountMutation.isPending}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      {deleteBankAccountMutation.isPending ? 'Lösche...' : 'Löschen'}
    </button>
  );
}
```

## 🔧 API-Endpunkte

### Personen
- `GET /api/persons` - Alle Personen (mit Filterung)
- `POST /api/persons` - Neue Person erstellen
- `PATCH /api/persons/:id` - Person aktualisieren
- `PATCH /api/persons` - Mehrere Personen aktualisieren/erstellen
- `DELETE /api/persons/:id` - Person löschen (nur wenn keine Bankkonten vorhanden)

### Bankkonten
- `GET /api/bank-accounts` - Alle Bankkonten (mit Filterung)
- `POST /api/bank-accounts` - Neues Bankkonto erstellen
- `PATCH /api/bank-accounts/:id` - Bankkonto aktualisieren
- `DELETE /api/bank-accounts/:id` - Bankkonto löschen

## ⚡ Features

### React Query Integration
- **Caching**: Automatisches Caching von API-Responses
- **Background Updates**: Daten werden im Hintergrund aktualisiert
- **Error Handling**: Eingebaute Fehlerbehandlung
- **Loading States**: Automatische Loading-Zustände
- **Optimistic Updates**: Bei Mutations werden Queries automatisch invalidiert
- **Suspense Support**: Hooks für React Suspense und Server-Side Rendering

### Optimistic Updates
- **Create**: Neue Einträge werden sofort in der UI angezeigt
- **Delete**: Einträge werden sofort aus der UI entfernt
- **Rollback**: Bei Fehlern wird der ursprüngliche Zustand wiederhergestellt
- **Cache Invalidation**: Nach erfolgreichen/fehlgeschlagenen Operationen wird der Cache aktualisiert

### Query Varianten
- **Standard Queries** (`useGetPersonsQuery`, `useGetBankAccountsQuery`): 
  - Für Client-Side Rendering
  - Manuelles Loading- und Error-Handling
  - Flexibler für komplexe UI-States
  
- **Suspense Queries** (`useGetPersonsSuspenseQuery`, `useGetBankAccountsSuspenseQuery`):
  - Für Server-Side Rendering und React Suspense
  - Automatisches Loading- und Error-Handling durch Suspense Boundaries
  - Vereinfachter Code in Komponenten

### TypeScript Support
- Vollständige Typisierung aller API-Responses
- IntelliSense für alle Felder und Parameter
- Compile-Time Validierung

### Filterung und Suche
- Personen: Nach Vorname, Nachname, E-Mail
- Bankkonten: Nach Person, Kontotyp, Status

### Bulk Operations
- **Bulk Update/Create**: Mehrere Personen gleichzeitig verarbeiten
- **Smart Logic**: Automatische Erkennung ob Update (mit ID) oder Create (ohne ID)
- **Partial Success Handling**: Behandlung von teilweise erfolgreichen Operationen

## 🛠️ Konfiguration

### API Base URL
Die API Base URL ist in `api-client.ts` konfiguriert:

```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

### Query Client Einstellungen
In `query-client.ts`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: () => 60 * 1000, // 60 Sekunden
    },
  },
});
```

## 📝 Wann welche Query verwenden?

### Standard Queries verwenden wenn:
- Du granulare Kontrolle über Loading- und Error-States brauchst
- Du komplexe UI-Logik basierend auf Query-Status implementierst
- Du Client-Side Rendering verwendest
- Du verschiedene Loading-Zustände für verschiedene Teile der UI brauchst

### Suspense Queries verwenden wenn:
- Du Server-Side Rendering verwendest (React Router 7 SSR)
- Du React Suspense für Loading-States nutzen möchtest
- Du einfachere Komponenten ohne manuelles Loading-Handling willst
- Du Error Boundaries für Fehlerbehandlung verwendest

## 🔗 Abhängigkeiten

- `@tanstack/react-query` - Für Data Fetching und Caching
- `React` - Für Hooks und Komponenten
- Native `fetch` API - Für HTTP-Requests

## 🚦 Server starten

Vergiss nicht, den Backend-Server zu starten:

```bash
yarn server
```

Der Server läuft auf `http://localhost:3001` und die API ist unter `/api/*` verfügbar. 
