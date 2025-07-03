export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  personId: string;
  accountNumber: string;
  bankName: string;
  accountType: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccountWithPerson extends BankAccount {
  person: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  total?: number;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
}
