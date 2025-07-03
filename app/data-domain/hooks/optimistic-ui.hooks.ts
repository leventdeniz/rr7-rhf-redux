import { useMutationState } from '@tanstack/react-query';
import type { CreatePersonRequest, CreateBankAccountRequest } from '../types';

/**
 * Hook für optimistische UI-Updates beim Erstellen von Personen
 * Nutzt den UI-basierten Ansatz aus der TanStack Query Dokumentation
 */
export const useOptimisticPersonCreation = () => {
  return useMutationState<CreatePersonRequest>({
    filters: { mutationKey: ['createPerson'], status: 'pending' },
    select: (mutation) => ({
      variables: mutation.state.variables,
      submittedAt: mutation.state.submittedAt,
      isPending: mutation.state.status === 'pending',
    }),
  });
};

/**
 * Hook für optimistische UI-Updates beim Aktualisieren von Personen
 */
export const useOptimisticPersonUpdate = () => {
  return useMutationState<{ id: string; data: any }>({
    filters: { mutationKey: ['updatePerson'], status: 'pending' },
    select: (mutation) => ({
      variables: mutation.state.variables,
      submittedAt: mutation.state.submittedAt,
      isPending: mutation.state.status === 'pending',
    }),
  });
};

/**
 * Hook für optimistische UI-Updates beim Erstellen von Bankkonten
 */
export const useOptimisticBankAccountCreation = () => {
  return useMutationState<CreateBankAccountRequest>({
    filters: { mutationKey: ['createBankAccount'], status: 'pending' },
    select: (mutation) => ({
      variables: mutation.state.variables,
      submittedAt: mutation.state.submittedAt,
      isPending: mutation.state.status === 'pending',
    }),
  });
};

/**
 * Hook für optimistische UI-Updates beim Aktualisieren von Bankkonten
 */
export const useOptimisticBankAccountUpdate = () => {
  return useMutationState<{ id: string; data: any }>({
    filters: { mutationKey: ['updateBankAccount'], status: 'pending' },
    select: (mutation) => ({
      variables: mutation.state.variables,
      submittedAt: mutation.state.submittedAt,
      isPending: mutation.state.status === 'pending',
    }),
  });
};

/**
 * Generischer Hook für alle pending Mutations
 * Nützlich für globale Loading-States
 */
export const useAllPendingMutations = () => {
  return useMutationState({
    filters: { status: 'pending' },
    select: (mutation) => ({
      mutationKey: mutation.options.mutationKey,
      variables: mutation.state.variables,
      submittedAt: mutation.state.submittedAt,
      status: mutation.state.status,
    }),
  });
};

/**
 * Hook um zu prüfen, ob spezifische Mutations pending sind
 */
export const useIsMutationPending = (mutationKey: string[]) => {
  const mutations = useMutationState({
    filters: { mutationKey, status: 'pending' },
  });
  
  return mutations.length > 0;
}; 
