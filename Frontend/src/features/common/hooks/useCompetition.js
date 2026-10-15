import useAsync from './useAsync.js';
import { getCompetition } from '../api/competitionApi.js';

export default function useCompetition() {
  const { data: competition, loading, error, execute: refetch } = useAsync(getCompetition, true);
  return { competition, loading, error, refetch };
}
