import { useQuery } from '@tanstack/react-query';
import { bankAccountApi } from '../queries/bank-account-api';
import type { BankAccountsQueryParams } from '../types';

export const BANK_ACCOUNTS_QUERY_KEY = 'bank-accounts';

export const useGetBankAccountsQuery = (params: BankAccountsQueryParams = {}) => {
  return useQuery({
    queryKey: [BANK_ACCOUNTS_QUERY_KEY, params],
    queryFn: () => bankAccountApi.getBankAccounts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 
