import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { GitHubActivity } from "@/lib/types";

export function useGitHubActivity(limit = 50) {
  return useQuery<GitHubActivity[]>({
    queryKey: ["github-activity", limit],
    queryFn: async () => {
      const { data } = await api.get<GitHubActivity[]>(`/github/activity?limit=${limit}`);
      return data;
    },
    refetchInterval: 60_000,
  });
}
