import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import type { Person, BankAccount, BankAccountWithPerson, ApiResponse } from './types.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for persons
let persons: Person[] = [
  {
    id: uuidv4(),
    firstName: 'Max',
    lastName: 'Mustermann',
    email: 'max.mustermann@example.com',
    dateOfBirth: '1990-01-15',
    address: {
      street: 'Musterstraße 123',
      city: 'Berlin',
      postalCode: '10115',
      country: 'Deutschland'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    firstName: 'Anna',
    lastName: 'Schmidt',
    email: 'anna.schmidt@example.com',
    dateOfBirth: '1985-07-22',
    address: {
      street: 'Beispielweg 456',
      city: 'München',
      postalCode: '80331',
      country: 'Deutschland'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    firstName: 'Thomas',
    lastName: 'Weber',
    email: 'thomas.weber@example.com',
    dateOfBirth: '1992-12-03',
    address: {
      street: 'Teststraße 789',
      city: 'Hamburg',
      postalCode: '20095',
      country: 'Deutschland'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock data for bank accounts
let bankAccounts: BankAccount[] = [
  {
    id: uuidv4(),
    personId: persons[0].id,
    accountNumber: 'DE89370400440532013000',
    bankName: 'Deutsche Bank',
    accountType: 'Girokonto',
    balance: 2500.75,
    currency: 'EUR',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    personId: persons[1].id,
    accountNumber: 'DE75512108001245126199',
    bankName: 'Commerzbank',
    accountType: 'Sparkonto',
    balance: 15000.00,
    currency: 'EUR',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    personId: persons[2].id,
    accountNumber: 'DE62370400440012345678',
    bankName: 'Postbank',
    accountType: 'Girokonto',
    balance: 850.25,
    currency: 'EUR',
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/persons - Alle Personen abrufen
app.get('/api/persons', (req: Request, res: Response) => {
  try {
    // Optional: Query parameters für Filterung
    const { firstName, lastName, email } = req.query;
    
    let filteredPersons = persons;
    
    if (firstName) {
      filteredPersons = filteredPersons.filter(p => 
        p.firstName.toLowerCase().includes((firstName as string).toLowerCase())
      );
    }
    
    if (lastName) {
      filteredPersons = filteredPersons.filter(p => 
        p.lastName.toLowerCase().includes((lastName as string).toLowerCase())
      );
    }
    
    if (email) {
      filteredPersons = filteredPersons.filter(p => 
        p.email.toLowerCase().includes((email as string).toLowerCase())
      );
    }
    
    const response: ApiResponse<Person[]> = {
      success: true,
      data: filteredPersons,
      total: filteredPersons.length
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Personen'
    });
  }
});

// POST /api/persons - Neue Person erstellen
app.post('/api/persons', (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, dateOfBirth, address } = req.body;
    
    // Validierung der Pflichtfelder
    if (!firstName || !lastName || !email) {
      res.status(400).json({
        success: false,
        error: 'firstName, lastName und email sind Pflichtfelder'
      });
      return;
    }
    
    // Prüfen ob Email bereits existiert
    const existingPerson = persons.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (existingPerson) {
      res.status(409).json({
        success: false,
        error: 'Eine Person mit dieser E-Mail-Adresse existiert bereits'
      });
      return;
    }
    
    // Neue Person erstellen
    const newPerson: Person = {
      id: uuidv4(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      dateOfBirth: dateOfBirth || '',
      address: address || {
        street: '',
        city: '',
        postalCode: '',
        country: 'Deutschland'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    persons.push(newPerson);
    
    const response: ApiResponse<Person> = {
      success: true,
      data: newPerson
    };
    
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen der Person'
    });
  }
});

// PATCH /api/persons/:id - Person aktualisieren
app.patch('/api/persons/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const personIndex = persons.findIndex(p => p.id === id);
    
    if (personIndex === -1) {
      res.status(404).json({
        success: false,
        error: 'Person nicht gefunden'
      });
      return;
    }
    
    // Person aktualisieren
    persons[personIndex] = {
      ...persons[personIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const response: ApiResponse<Person> = {
      success: true,
      data: persons[personIndex]
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Aktualisieren der Person'
    });
  }
});

// PATCH /api/persons - Mehrere Personen aktualisieren/erstellen
app.patch('/api/persons', (req: Request, res: Response) => {
  try {
    const personsData = req.body;
    
    // Validierung: Body muss ein Array sein
    if (!Array.isArray(personsData)) {
      res.status(400).json({
        success: false,
        error: 'Body muss ein Array von Personen sein'
      });
      return;
    }
    
    if (personsData.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Array darf nicht leer sein'
      });
      return;
    }
    
    const results: Person[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < personsData.length; i++) {
      const personData = personsData[i];
      
      try {
        // Validierung der Pflichtfelder für jede Person
        if (!personData.firstName || !personData.lastName || !personData.email) {
          errors.push(`Person ${i + 1}: firstName, lastName und email sind Pflichtfelder`);
          continue;
        }
        
        // Prüfen ob Person bereits existiert (basierend auf ID oder E-Mail)
        let existingPersonIndex = -1;
        
        if (personData.id) {
          // Update basierend auf ID
          existingPersonIndex = persons.findIndex(p => p.id === personData.id);
        } else {
          // Prüfen auf E-Mail-Duplikate bei neuen Personen
          const emailExists = persons.find(p => p.email.toLowerCase() === personData.email.toLowerCase());
          if (emailExists) {
            errors.push(`Person ${i + 1}: Eine Person mit der E-Mail-Adresse "${personData.email}" existiert bereits`);
            continue;
          }
        }
        
        if (existingPersonIndex !== -1) {
          // Person aktualisieren
          persons[existingPersonIndex] = {
            ...persons[existingPersonIndex],
            firstName: personData.firstName.trim(),
            lastName: personData.lastName.trim(),
            email: personData.email.trim().toLowerCase(),
            dateOfBirth: personData.dateOfBirth || persons[existingPersonIndex].dateOfBirth,
            address: personData.address ? {
              street: personData.address.street || persons[existingPersonIndex].address.street,
              city: personData.address.city || persons[existingPersonIndex].address.city,
              postalCode: personData.address.postalCode || persons[existingPersonIndex].address.postalCode,
              country: personData.address.country || persons[existingPersonIndex].address.country
            } : persons[existingPersonIndex].address,
            updatedAt: new Date().toISOString()
          };
          
          results.push(persons[existingPersonIndex]);
        } else {
          // Neue Person erstellen
          const newPerson: Person = {
            id: uuidv4(),
            firstName: personData.firstName.trim(),
            lastName: personData.lastName.trim(),
            email: personData.email.trim().toLowerCase(),
            dateOfBirth: personData.dateOfBirth || '',
            address: personData.address || {
              street: '',
              city: '',
              postalCode: '',
              country: 'Deutschland'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          persons.push(newPerson);
          results.push(newPerson);
        }
      } catch (error) {
        errors.push(`Person ${i + 1}: Fehler beim Verarbeiten - ${error}`);
      }
    }
    
    // Response erstellen
    if (errors.length > 0 && results.length === 0) {
      // Alle Personen hatten Fehler
      res.status(400).json({
        success: false,
        error: 'Fehler beim Verarbeiten aller Personen',
        details: errors
      });
      return;
    } else if (errors.length > 0) {
      // Teilweise erfolgreich
      res.status(207).json({ // 207 Multi-Status
        success: true,
        data: results,
        total: results.length,
        warnings: errors,
        message: `${results.length} Personen erfolgreich verarbeitet, ${errors.length} Fehler aufgetreten`
      });
      return;
    } else {
      // Alle erfolgreich
      const response: ApiResponse<Person[]> = {
        success: true,
        data: results,
        total: results.length
      };
      
      res.json(response);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Verarbeiten der Personen'
    });
  }
});

// DELETE /api/persons/:id - Person löschen
app.delete('/api/persons/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    
    const personIndex = persons.findIndex(p => p.id === id);
    
    if (personIndex === -1) {
      res.status(404).json({
        success: false,
        error: 'Person nicht gefunden'
      });
      return;
    }
    
    // Prüfen ob Person Bankkonten hat
    const personBankAccounts = bankAccounts.filter(acc => acc.personId === id);
    if (personBankAccounts.length > 0) {
      res.status(409).json({
        success: false,
        error: `Person kann nicht gelöscht werden, da sie ${personBankAccounts.length} Bankkonto(s) besitzt. Bitte zuerst die Bankkonten löschen.`
      });
      return;
    }
    
    // Person löschen
    const deletedPerson = persons[personIndex];
    persons.splice(personIndex, 1);
    
    const response: ApiResponse<Person> = {
      success: true,
      data: deletedPerson
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Löschen der Person'
    });
  }
});

// GET /api/bank-accounts - Alle Bankkonten abrufen
app.get('/api/bank-accounts', (req: Request, res: Response) => {
  try {
    // Optional: Query parameters für Filterung
    const { personId, accountType, isActive } = req.query;
    
    let filteredAccounts = bankAccounts;
    
    if (personId) {
      filteredAccounts = filteredAccounts.filter(acc => acc.personId === personId);
    }
    
    if (accountType) {
      filteredAccounts = filteredAccounts.filter(acc => 
        acc.accountType.toLowerCase().includes((accountType as string).toLowerCase())
      );
    }
    
    if (isActive !== undefined) {
      const activeFilter = isActive === 'true';
      filteredAccounts = filteredAccounts.filter(acc => acc.isActive === activeFilter);
    }
    
    // Bankkonten mit Personendaten anreichern
    const enrichedAccounts: BankAccountWithPerson[] = filteredAccounts.map(account => {
      const person = persons.find(p => p.id === account.personId);
      return {
        ...account,
        person: person ? {
          id: person.id,
          firstName: person.firstName,
          lastName: person.lastName,
          email: person.email
        } : null
      };
    });
    
    const response: ApiResponse<BankAccountWithPerson[]> = {
      success: true,
      data: enrichedAccounts,
      total: enrichedAccounts.length
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Abrufen der Bankkonten'
    });
  }
});

// POST /api/bank-accounts - Neues Bankkonto erstellen
app.post('/api/bank-accounts', (req: Request, res: Response) => {
  try {
    const { personId, accountNumber, bankName, accountType, balance, currency, isActive } = req.body;
    
    // Validierung der Pflichtfelder
    if (!personId || !accountNumber || !bankName || !accountType) {
      res.status(400).json({
        success: false,
        error: 'personId, accountNumber, bankName und accountType sind Pflichtfelder'
      });
      return;
    }
    
    // Prüfen ob Person existiert
    const person = persons.find(p => p.id === personId);
    if (!person) {
      res.status(404).json({
        success: false,
        error: 'Person mit der angegebenen ID nicht gefunden'
      });
      return;
    }
    
    // Prüfen ob Kontonummer bereits existiert
    const existingAccount = bankAccounts.find(acc => acc.accountNumber === accountNumber);
    if (existingAccount) {
      res.status(409).json({
        success: false,
        error: 'Ein Bankkonto mit dieser Kontonummer existiert bereits'
      });
      return;
    }
    
    // Neues Bankkonto erstellen
    const newBankAccount: BankAccount = {
      id: uuidv4(),
      personId: personId,
      accountNumber: accountNumber.trim(),
      bankName: bankName.trim(),
      accountType: accountType.trim(),
      balance: typeof balance === 'number' ? balance : 0,
      currency: currency || 'EUR',
      isActive: typeof isActive === 'boolean' ? isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    bankAccounts.push(newBankAccount);
    
    const response: ApiResponse<BankAccount> = {
      success: true,
      data: newBankAccount
    };
    
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Erstellen des Bankkontos'
    });
  }
});

// PATCH /api/bank-accounts/:id - Bankkonto aktualisieren
app.patch('/api/bank-accounts/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const accountIndex = bankAccounts.findIndex(acc => acc.id === id);
    
    if (accountIndex === -1) {
      res.status(404).json({
        success: false,
        error: 'Bankkonto nicht gefunden'
      });
      return;
    }
    
    // Bankkonto aktualisieren
    bankAccounts[accountIndex] = {
      ...bankAccounts[accountIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    const response: ApiResponse<BankAccount> = {
      success: true,
      data: bankAccounts[accountIndex]
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Aktualisieren des Bankkontos'
    });
  }
});

// DELETE /api/bank-accounts/:id - Bankkonto löschen
app.delete('/api/bank-accounts/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    
    const accountIndex = bankAccounts.findIndex(acc => acc.id === id);
    
    if (accountIndex === -1) {
      res.status(404).json({
        success: false,
        error: 'Bankkonto nicht gefunden'
      });
      return;
    }
    
    // Bankkonto löschen
    const deletedAccount = bankAccounts[accountIndex];
    bankAccounts.splice(accountIndex, 1);
    
    const response: ApiResponse<BankAccount> = {
      success: true,
      data: deletedAccount
    };
    
    res.json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Fehler beim Löschen des Bankkontos'
    });
  }
});

// 404 Handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpunkt nicht gefunden'
  });
});

// Error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server Error:', error);
  res.status(500).json({
    success: false,
    error: 'Interner Serverfehler'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Fake Backend Server läuft auf Port ${PORT}`);
  console.log(`📋 Verfügbare Endpunkte:`);
  console.log(`   GET    /api/persons`);
  console.log(`   POST   /api/persons`);
  console.log(`   PATCH  /api/persons/:id`);
  console.log(`   PATCH  /api/persons`);
  console.log(`   DELETE /api/persons/:id`);
  console.log(`   GET    /api/bank-accounts`);
  console.log(`   POST   /api/bank-accounts`);
  console.log(`   PATCH  /api/bank-accounts/:id`);
  console.log(`   DELETE /api/bank-accounts/:id`);
});

export default app; 
