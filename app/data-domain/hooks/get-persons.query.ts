import { useQuery } from '@tanstack/react-query';
import { personApi } from '../queries/person-api';
import type { PersonsQueryParams } from '../types';

export const PERSONS_QUERY_KEY = 'persons';

export const useGetPersonsQuery = (params: PersonsQueryParams = {}) => {
  return useQuery({
    queryKey: [PERSONS_QUERY_KEY, params],
    queryFn: () => personApi.getPersons(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 
