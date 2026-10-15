import useAsync from '../../common/hooks/useAsync.js';
import { getSubmissions } from '../api/judgeApi.js';

export default function useJudgeSubmissions() {
  const { data: submissions, loading, error, execute: refetch } = useAsync(getSubmissions, true);
  return { submissions, loading, error, refetch };
}
