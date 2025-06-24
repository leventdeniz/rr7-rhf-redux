// API Base Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  total?: number;
  error?: string;
}

// Person Types
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonRequest {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  address?: Address;
}

export interface UpdatePersonRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  address?: Address;
}

// Bank Account Types
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

export interface CreateBankAccountRequest {
  personId: string;
  accountNumber: string;
  bankName: string;
  accountType: string;
  balance?: number;
  currency?: string;
  isActive?: boolean;
}

export interface UpdateBankAccountRequest {
  personId?: string;
  accountNumber?: string;
  bankName?: string;
  accountType?: string;
  balance?: number;
  currency?: string;
  isActive?: boolean;
}

// Query Parameters
export interface PersonsQueryParams {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface BankAccountsQueryParams {
  personId?: string;
  accountType?: string;
  isActive?: boolean;
}

// Bulk Update Types
export interface BulkUpdatePersonsRequest extends Array<CreatePersonRequest & { id?: string }> {}

export interface BulkUpdatePersonsResponse extends ApiResponse<Person[]> {
  warnings?: string[];
  message?: string;
} 
