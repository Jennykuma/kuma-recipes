import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import type { LabData } from 'shared';
import { lab as labApi } from '../../api';
import { queryKeys } from '../../lib/queryKeys';

const useLabData = (recipeId: string) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery<LabData>({
    queryKey: queryKeys.lab.detail(recipeId),
    enabled: Boolean(recipeId) && isLoaded && isSignedIn,
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Missing auth token');
      return labApi.getLabData(recipeId, token);
    },
  });
};

export default useLabData;
