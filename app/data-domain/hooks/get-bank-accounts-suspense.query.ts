import { useSuspenseQuery } from '@tanstack/react-query';
import { bankAccountApi } from '../queries/bank-account-api';
import { BANK_ACCOUNTS_QUERY_KEY } from './get-bank-accounts.query';
import type { BankAccountsQueryParams } from '../types';

export const useGetBankAccountsSuspenseQuery = (params: BankAccountsQueryParams = {}) => {
  return useSuspenseQuery({
    queryKey: [BANK_ACCOUNTS_QUERY_KEY, params],
    queryFn: () => bankAccountApi.getBankAccounts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 
