// Types
export * from './types';

// Query Client
export * from './query-client';

// API Functions
export { personApi } from './queries/person-api';
export { bankAccountApi } from './queries/bank-account-api';
export { personApi as personMutationApi } from './mutations/person-api';  
export { bankAccountApi as bankAccountMutationApi } from './mutations/bank-account-api';

// Hooks
export * from './hooks/get-persons.query';
export * from './hooks/get-persons-suspense.query';
export * from './hooks/get-bank-accounts.query';
export * from './hooks/get-bank-accounts-suspense.query';
export * from './hooks/create-person.mutation';
export * from './hooks/update-person.mutation';
export * from './hooks/create-bank-account.mutation';
export * from './hooks/update-bank-account.mutation';

// Optimistic Updates Hooks
export * from './hooks/optimistic-ui.hooks'; 
