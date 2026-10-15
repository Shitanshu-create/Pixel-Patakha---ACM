import useAsync from '../../common/hooks/useAsync.js';
import { getTeams } from '../api/adminApi.js';

export default function useAdminTeams(initialPage = 1, initialLimit = 10, searchTerm = '') {
  const { data, loading, error, refetch } = useAsync(
    () => getTeams({ page: initialPage, limit: initialLimit, search: searchTerm }),
    true,
    [initialPage, initialLimit, searchTerm]
  );

  return {
    teams: data?.teams || [],
    pagination: data?.pagination || { page: 1, totalPages: 1, total: 0 },
    loading,
    error,
    refetch,
  };
}
