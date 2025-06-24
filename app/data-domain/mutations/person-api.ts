import type {
  ApiResponse,
  Person,
  CreatePersonRequest,
  UpdatePersonRequest,
  BulkUpdatePersonsRequest,
  BulkUpdatePersonsResponse,
} from '../types';
import { apiCall } from '../../lib/api-utils';

// Person API Functions
export const personApi = {
  // POST /api/persons
  createPerson: async (data: CreatePersonRequest): Promise<ApiResponse<Person>> => {
    return apiCall<ApiResponse<Person>>('/persons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PATCH /api/persons/:id
  updatePerson: async (id: string, data: UpdatePersonRequest): Promise<ApiResponse<Person>> => {
    return apiCall<ApiResponse<Person>>(`/persons/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // PATCH /api/persons - Bulk update/create
  bulkUpdatePersons: async (data: BulkUpdatePersonsRequest): Promise<BulkUpdatePersonsResponse> => {
    return apiCall<BulkUpdatePersonsResponse>('/persons', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/persons/:id
  deletePerson: async (id: string): Promise<ApiResponse<Person>> => {
    return apiCall<ApiResponse<Person>>(`/persons/${id}`, {
      method: 'DELETE',
    });
  },
}; 
