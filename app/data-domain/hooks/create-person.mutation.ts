import { useMutation, useQueryClient } from '@tanstack/react-query';
import { personApi } from '../mutations/person-api';
import { PERSONS_QUERY_KEY } from './get-persons.query';
import type { CreatePersonRequest, Person, BulkUpdatePersonsRequest } from '../types';

export const useCreatePersonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePersonRequest) => personApi.createPerson(data),
    mutationKey: ['createPerson'], // Für useMutationState
    // Optimistic Update via Cache
    onMutate: async (newPerson: CreatePersonRequest) => {
      // Alle ausstehenden Refetches canceln
      await queryClient.cancelQueries({ queryKey: [PERSONS_QUERY_KEY] });

      // Snapshot der vorherigen Daten
      const previousPersons = queryClient.getQueryData([PERSONS_QUERY_KEY, {}]);

      // Optimistisch eine temporäre Person erstellen
      const optimisticPerson: Person = {
        id: `temp-${Date.now()}`, // Temporäre ID
        firstName: newPerson.firstName,
        lastName: newPerson.lastName,
        email: newPerson.email,
        dateOfBirth: newPerson.dateOfBirth || '',
        address: newPerson.address || {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Cache optimistisch updaten
      queryClient.setQueryData([PERSONS_QUERY_KEY, {}], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: [...old.data, optimisticPerson],
          total: (old.total || 0) + 1
        };
      });

      // Context für Rollback zurückgeben
      return { previousPersons, optimisticPerson };
    },
    // Bei Fehler: Rollback
    onError: (err, newPerson, context) => {
      if (context?.previousPersons) {
        queryClient.setQueryData([PERSONS_QUERY_KEY, {}], context.previousPersons);
      }
    },
    // Nach Erfolg oder Fehler: Cache invalidieren
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PERSONS_QUERY_KEY] });
    },
  });
};

export const useBulkUpdatePersonsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkUpdatePersonsRequest) => personApi.bulkUpdatePersons(data),
    mutationKey: ['bulkUpdatePersons'], // Für useMutationState
    // Nach Erfolg oder Fehler: Cache invalidieren
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PERSONS_QUERY_KEY] });
    },
  });
};

export const useDeletePersonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => personApi.deletePerson(id),
    mutationKey: ['deletePerson'], // Für useMutationState
    // Optimistic Update via Cache
    onMutate: async (deletedId: string) => {
      // Alle ausstehenden Refetches canceln
      await queryClient.cancelQueries({ queryKey: [PERSONS_QUERY_KEY] });

      // Snapshot der vorherigen Daten
      const previousPersons = queryClient.getQueryData([PERSONS_QUERY_KEY, {}]);

      // Cache optimistisch updaten - Person entfernen
      queryClient.setQueryData([PERSONS_QUERY_KEY, {}], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((person: Person) => person.id !== deletedId),
          total: Math.max((old.total || 0) - 1, 0)
        };
      });

      // Context für Rollback zurückgeben
      return { previousPersons };
    },
    // Bei Fehler: Rollback
    onError: (err, deletedId, context) => {
      if (context?.previousPersons) {
        queryClient.setQueryData([PERSONS_QUERY_KEY, {}], context.previousPersons);
      }
    },
    // Nach Erfolg oder Fehler: Cache invalidieren
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PERSONS_QUERY_KEY] });
    },
  });
}; 
