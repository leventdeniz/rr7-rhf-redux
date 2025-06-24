import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bankAccountApi } from '../mutations/bank-account-api';
import { BANK_ACCOUNTS_QUERY_KEY } from './get-bank-accounts.query';
import type { CreateBankAccountRequest, BankAccount } from '../types';

export const useCreateBankAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBankAccountRequest) => bankAccountApi.createBankAccount(data),
    mutationKey: ['createBankAccount'], // Für useMutationState
    // Optimistic Update via Cache
    onMutate: async (newBankAccount: CreateBankAccountRequest) => {
      // Alle ausstehenden Refetches canceln
      await queryClient.cancelQueries({ queryKey: [BANK_ACCOUNTS_QUERY_KEY] });

      // Snapshot der vorherigen Daten
      const previousBankAccounts = queryClient.getQueryData([BANK_ACCOUNTS_QUERY_KEY, {}]);

      // Optimistisch ein temporäres Bank Account erstellen
      const optimisticBankAccount: BankAccount = {
        id: `temp-${Date.now()}`, // Temporäre ID
        personId: newBankAccount.personId,
        accountNumber: newBankAccount.accountNumber,
        bankName: newBankAccount.bankName,
        accountType: newBankAccount.accountType,
        balance: newBankAccount.balance || 0,
        currency: newBankAccount.currency || 'EUR',
        isActive: newBankAccount.isActive !== false, // Default true
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Cache optimistisch updaten
      queryClient.setQueryData([BANK_ACCOUNTS_QUERY_KEY, {}], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: [...old.data, optimisticBankAccount],
          total: (old.total || 0) + 1
        };
      });

      // Context für Rollback zurückgeben
      return { previousBankAccounts, optimisticBankAccount };
    },
    // Bei Fehler: Rollback
    onError: (err, newBankAccount, context) => {
      if (context?.previousBankAccounts) {
        queryClient.setQueryData([BANK_ACCOUNTS_QUERY_KEY, {}], context.previousBankAccounts);
      }
    },
    // Nach Erfolg oder Fehler: Cache invalidieren
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BANK_ACCOUNTS_QUERY_KEY] });
    },
  });
};

export const useDeleteBankAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bankAccountApi.deleteBankAccount(id),
    mutationKey: ['deleteBankAccount'], // Für useMutationState
    // Optimistic Update via Cache
    onMutate: async (deletedId: string) => {
      // Alle ausstehenden Refetches canceln
      await queryClient.cancelQueries({ queryKey: [BANK_ACCOUNTS_QUERY_KEY] });

      // Snapshot der vorherigen Daten
      const previousBankAccounts = queryClient.getQueryData([BANK_ACCOUNTS_QUERY_KEY, {}]);

      // Cache optimistisch updaten - Bankkonto entfernen
      queryClient.setQueryData([BANK_ACCOUNTS_QUERY_KEY, {}], (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((account: BankAccount) => account.id !== deletedId),
          total: Math.max((old.total || 0) - 1, 0)
        };
      });

      // Context für Rollback zurückgeben
      return { previousBankAccounts };
    },
    // Bei Fehler: Rollback
    onError: (err, deletedId, context) => {
      if (context?.previousBankAccounts) {
        queryClient.setQueryData([BANK_ACCOUNTS_QUERY_KEY, {}], context.previousBankAccounts);
      }
    },
    // Nach Erfolg oder Fehler: Cache invalidieren
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [BANK_ACCOUNTS_QUERY_KEY] });
    },
  });
}; 
