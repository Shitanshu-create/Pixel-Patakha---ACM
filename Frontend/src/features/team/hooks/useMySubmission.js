import useAsync from '../../common/hooks/useAsync.js';
import { getMySubmission } from '../api/submissionApi.js';

export default function useMySubmission() {
  const { data: submission, loading, error, execute: refetch } = useAsync(
    async () => {
      try {
        return await getMySubmission();
      } catch (err) {
        if (err.status === 404) {
          return null; // Not submitted yet
        }
        throw err;
      }
    },
    true
  );

  return { submission, loading, error, refetch };
}
