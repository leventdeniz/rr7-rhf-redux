import type {
  ApiResponse,
  Person,
  PersonsQueryParams,
} from '../types';
import { apiCall, buildQueryString } from '../../lib/api-utils';

// Person API Functions
export const personApi = {
  // GET /api/persons
  getPersons: async (params: PersonsQueryParams = {}): Promise<ApiResponse<Person[]>> => {
    const queryString = buildQueryString(params);
    return apiCall<ApiResponse<Person[]>>(`/persons${queryString}`);
  },
}; 
