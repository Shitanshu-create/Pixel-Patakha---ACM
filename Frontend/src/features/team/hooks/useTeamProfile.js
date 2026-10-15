import useAsync from '../../common/hooks/useAsync.js';
import { getTeamProfile } from '../api/teamApi.js';

export default function useTeamProfile() {
  const { data, loading, error, execute: refetch } = useAsync(getTeamProfile, true);
  return {
    team: data?.team || null,
    submission: data?.submission || null,
    loading,
    error,
    refetch,
  };
}
