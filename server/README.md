# Fake Backend Server

Ein einfacher Express.js Server als Mock-Backend für die Entwicklung.

## Verfügbare Endpunkte

### Personen

#### GET /api/persons
Alle Personen abrufen

**Query Parameter:**
- `firstName` (optional) - Filtert nach Vorname
- `lastName` (optional) - Filtert nach Nachname  
- `email` (optional) - Filtert nach E-Mail

**Beispiel:**
```bash
GET /api/persons?firstName=Max
```

#### POST /api/persons
Neue Person erstellen

**Pflichtfelder:**
- `firstName` - Vorname
- `lastName` - Nachname
- `email` - E-Mail-Adresse (muss eindeutig sein)

**Optionale Felder:**
- `dateOfBirth` - Geburtsdatum
- `address` - Adressobjekt mit `street`, `city`, `postalCode`, `country`

**Body:**
```json
{
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@example.com",
  "dateOfBirth": "1990-01-15",
  "address": {
    "street": "Musterstraße 123",
    "city": "Berlin",
    "postalCode": "10115",
    "country": "Deutschland"
  }
}
```

#### PATCH /api/persons/:id
Person aktualisieren

**Body:**
```json
{
  "firstName": "Neuer Name",
  "email": "neue@email.com"
}
```

#### DELETE /api/persons/:id
Person löschen

**Verhalten:**
- Person wird nur gelöscht, wenn sie keine Bankkonten besitzt
- Falls Bankkonten vorhanden sind: HTTP 409 Conflict

**Response bei Erfolg:**
```json
{
  "success": true,
  "data": {...} // Gelöschte Person
}
```

**Response bei Konflikt:**
```json
{
  "success": false,
  "error": "Person kann nicht gelöscht werden, da sie 2 Bankkonto(s) besitzt. Bitte zuerst die Bankkonten löschen."
}
```

#### PATCH /api/persons
Mehrere Personen gleichzeitig aktualisieren oder erstellen

**Body (Array von Personen):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000", // Optional: bei vorhandener Person für Update
    "firstName": "Max",
    "lastName": "Mustermann", 
    "email": "max@example.com",
    "dateOfBirth": "1990-01-15",
    "address": {
      "street": "Musterstraße 123",
      "city": "Berlin", 
      "postalCode": "10115",
      "country": "Deutschland"
    }
  },
  {
    // Neue Person (ohne ID)
    "firstName": "Anna",
    "lastName": "Schmidt",
    "email": "anna@example.com"
  }
]
```

**Verhalten:**
- **Mit ID**: Person wird aktualisiert, falls sie existiert
- **Ohne ID**: Neue Person wird erstellt (E-Mail muss eindeutig sein)
- **Teilweise Fehler**: HTTP 207 Multi-Status mit erfolgreichen Personen und Fehlerliste
- **Alle Fehler**: HTTP 400 mit Fehlerliste

**Response bei Erfolg:**
```json
{
  "success": true,
  "data": [...], // Array der gespeicherten Personen
  "total": 2
}
```

**Response bei teilweisen Fehlern:**
```json
{
  "success": true,
  "data": [...], // Erfolgreich gespeicherte Personen
  "total": 1,
  "warnings": ["Person 2: E-Mail bereits vorhanden"],
  "message": "1 Personen erfolgreich verarbeitet, 1 Fehler aufgetreten"
}
```

### Bankkonten

#### GET /api/bank-accounts
Alle Bankkonten abrufen

**Query Parameter:**
- `personId` (optional) - Filtert nach Person ID
- `accountType` (optional) - Filtert nach Kontotyp
- `isActive` (optional) - Filtert nach Status (true/false)

**Beispiel:**
```bash
GET /api/bank-accounts?isActive=true
```

#### POST /api/bank-accounts
Neues Bankkonto erstellen

**Pflichtfelder:**
- `personId` - ID der Person (muss existieren)
- `accountNumber` - Kontonummer (muss eindeutig sein)
- `bankName` - Name der Bank
- `accountType` - Kontotyp (z.B. "Girokonto", "Sparkonto")

**Optionale Felder:**
- `balance` - Kontostand (Standard: 0)
- `currency` - Währung (Standard: "EUR")
- `isActive` - Status (Standard: true)

**Body:**
```json
{
  "personId": "123e4567-e89b-12d3-a456-426614174000",
  "accountNumber": "DE89370400440532013000",
  "bankName": "Deutsche Bank",
  "accountType": "Girokonto",
  "balance": 1000.50,
  "currency": "EUR",
  "isActive": true
}
```

#### PATCH /api/bank-accounts/:id
Bankkonto aktualisieren

**Body:**
```json
{
  "balance": 1000.50,
  "isActive": false
}
```

#### DELETE /api/bank-accounts/:id
Bankkonto löschen

**Response bei Erfolg:**
```json
{
  "success": true,
  "data": {...} // Gelöschtes Bankkonto
}
```

## Server starten

### Development Mode
```bash
yarn server
```

### Production Mode
```bash
yarn server:prod
```

Der Server läuft standardmäßig auf Port 3001.

## Mock Daten

Der Server kommt mit vorgefertigten Mock-Daten für:
- 3 Beispiel-Personen
- 3 Beispiel-Bankkonten (verknüpft mit den Personen)

Alle Daten werden im Speicher gehalten und gehen beim Neustart verloren.

## Validierung und Fehlerbehandlung

### HTTP Status Codes:
- `200` - Erfolgreiche GET/PATCH/DELETE Anfrage
- `201` - Erfolgreich erstellt (POST)
- `400` - Ungültige Anfrage (fehlende Pflichtfelder)
- `404` - Ressource nicht gefunden
- `409` - Konflikt (z.B. E-Mail oder Kontonummer bereits vorhanden, Person mit Bankkonten kann nicht gelöscht werden)
- `500` - Serverfehler

### Validierungen:
- **Personen**: E-Mail-Adresse muss eindeutig sein
- **Bankkonten**: Kontonummer muss eindeutig sein, personId muss existieren
- **Löschen**: Personen können nur gelöscht werden, wenn sie keine Bankkonten besitzen 
