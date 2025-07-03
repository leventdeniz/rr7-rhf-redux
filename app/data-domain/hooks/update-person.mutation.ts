import { useMutation, useQueryClient } from '@tanstack/react-query';
import { personApi } from '../mutations/person-api';
import { PERSONS_QUERY_KEY } from './get-persons.query';
import type { UpdatePersonRequest, Person } from '../types';

export const useUpdatePersonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePersonRequest }) => 
      personApi.updatePerson(id, data),
    mutationKey: ['updatePerson'], // Für useMutationState
    // Optimistic Update via Cache
    onMutate: async ({ id, data }: { id: string; data: UpdatePersonRequest }) => {
      // Alle ausstehenden Refetches für diese Person canceln
      await queryClient.cancelQueries({ queryKey: [PERSONS_QUERY_KEY] });

      // Snapshot der vorherigen Daten
      const previousPersonsData = queryClient.getQueryData([PERSONS_QUERY_KEY, {}]);

      // Cache optimistisch updaten
      queryClient.setQueryData([PERSONS_QUERY_KEY, {}], (old: any) => {
        if (!old?.data) return old;
        
        return {
          ...old,
          data: old.data.map((person: Person) => {
            if (person.id === id) {
              return {
                ...person,
                ...data,
                updatedAt: new Date().toISOString(),
              };
            }
            return person;
          })
        };
      });

      // Context für Rollback zurückgeben
      return { previousPersonsData, personId: id, updateData: data };
    },
    // Bei Fehler: Rollback
    onError: (err, variables, context) => {
      if (context?.previousPersonsData) {
        queryClient.setQueryData([PERSONS_QUERY_KEY, {}], context.previousPersonsData);
      }
    },
    // Nach Erfolg oder Fehler: Cache invalidieren
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PERSONS_QUERY_KEY] });
    },
  });
}; 
