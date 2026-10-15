import useAsync from '../../common/hooks/useAsync.js';
import { getReviews } from '../api/judgeApi.js';

export default function useMyReviews() {
  const { data: reviews, loading, error, execute: refetch } = useAsync(getReviews, true);
  return { reviews, loading, error, refetch };
}
