import { useState, useEffect, useCallback } from 'react';
import { getTeams } from '../api/adminApi.js';

export default function useAdminTeams(initialPage = 1, initialLimit = 10, searchTerm = '') {
  const [data, setData] = useState({ teams: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async (page = initialPage, search = searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTeams({ page, limit: initialLimit, search });
      setData(res || { teams: [], pagination: {} });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [initialLimit, initialPage, searchTerm]);

  useEffect(() => {
    fetchTeams(initialPage, searchTerm);
  }, [fetchTeams, initialPage, searchTerm]);

  return {
    teams: data.teams || [],
    pagination: data.pagination || { page: 1, totalPages: 1, total: 0 },
    loading,
    error,
    refetch: fetchTeams,
  };
}
