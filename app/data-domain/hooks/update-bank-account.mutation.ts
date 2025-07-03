import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bankAccountApi } from '../mutations/bank-account-api';
import { BANK_ACCOUNTS_QUERY_KEY } from './get-bank-accounts.query';
import type { UpdateBankAccountRequest, BankAccount } from '../types';

export const useUpdateBankAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBankAccountRequest }) => 
      bankAccountApi.updateBankAccount(id, data),
    mutationKey: ['updateBankAccount'], // Für useMutationState
    // Optimistic Update via Cache
    onMutate: async ({ id, data }: { id: string; data: UpdateBankAccountRequest }) => {
      // Alle ausstehenden Refetches canceln
      await queryClient.cancelQueries({ queryKey: [BANK_ACCOUNTS_QUERY_KEY] });

      // Snapshot der vorherigen Daten
      const previousBankAccountsData = queryClient.getQueryData([BANK_ACCOUNTS_QUERY_KEY, {}]);

      // Cache optimistisch updaten
      queryClient.setQueryData([BANK_ACCOUNTS_QUERY_KEY, {}], (old: any) => {
        if (!old?.data) return old;
        
        return {
          ...old,
          data: old.data.map((bankAccount: BankAccount) => {
            if (bankAccount.id === id) {
              return {
                ...bankAccount,
                ...data,
                updatedAt: new Date().toISOString(),
              };
            }
            return bankAccount;
          })
        };
      });

      // Context für Rollback zurückgeben
      return { previousBankAccountsData, bankAccountId: id, updateData: data };
    },
    // Bei Fehler: Rollback
    onError: (err, variables, context) => {
      if (context?.previousBankAccountsData) {
        queryClient.setQueryData([BANK_ACCOUNTS_QUERY_KEY, {}], context.previousBankAccountsData);
      }
    },
    // Nach Erfolg oder Fehler: Cache invalidieren
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BANK_ACCOUNTS_QUERY_KEY] });
    },
  });
}; 
