import type {
  ApiResponse,
  BankAccount,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
} from '../types';
import { apiCall } from '../../lib/api-utils';

// Bank Account API Functions
export const bankAccountApi = {
  // POST /api/bank-accounts
  createBankAccount: async (data: CreateBankAccountRequest): Promise<ApiResponse<BankAccount>> => {
    return apiCall<ApiResponse<BankAccount>>('/bank-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PATCH /api/bank-accounts/:id
  updateBankAccount: async (id: string, data: UpdateBankAccountRequest): Promise<ApiResponse<BankAccount>> => {
    return apiCall<ApiResponse<BankAccount>>(`/bank-accounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/bank-accounts/:id
  deleteBankAccount: async (id: string): Promise<ApiResponse<BankAccount>> => {
    return apiCall<ApiResponse<BankAccount>>(`/bank-accounts/${id}`, {
      method: 'DELETE',
    });
  },
}; 
