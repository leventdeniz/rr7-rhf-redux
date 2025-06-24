import type {
  ApiResponse,
  BankAccountWithPerson,
  BankAccountsQueryParams,
} from '../types';
import { apiCall, buildQueryString } from '../../lib/api-utils';

// Bank Account API Functions
export const bankAccountApi = {
  // GET /api/bank-accounts
  getBankAccounts: async (params: BankAccountsQueryParams = {}): Promise<ApiResponse<BankAccountWithPerson[]>> => {
    const queryString = buildQueryString(params);
    return apiCall<ApiResponse<BankAccountWithPerson[]>>(`/bank-accounts${queryString}`);
  },
}; 
