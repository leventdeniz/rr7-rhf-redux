import { useSuspenseQuery } from '@tanstack/react-query';
import { personApi } from '../queries/person-api';
import { PERSONS_QUERY_KEY } from './get-persons.query';
import type { PersonsQueryParams } from '../types';

export const useGetPersonsSuspenseQuery = (params: PersonsQueryParams = {}) => {
  return useSuspenseQuery({
    queryKey: [PERSONS_QUERY_KEY, params],
    queryFn: () => personApi.getPersons(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 
