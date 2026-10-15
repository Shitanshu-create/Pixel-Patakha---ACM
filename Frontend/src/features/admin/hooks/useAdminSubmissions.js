import useAsync from '../../common/hooks/useAsync.js';
import { getSubmissions } from '../api/adminApi.js';

export default function useAdminSubmissions() {
  const { data: submissions, loading, error, execute: refetch } = useAsync(getSubmissions, true);
  return { submissions: submissions || [], loading, error, refetch };
}
