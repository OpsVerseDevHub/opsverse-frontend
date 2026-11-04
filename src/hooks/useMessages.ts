import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import type { SlackMessage, SlackMapping } from "@/lib/types";

export function useMessages(projectId?: number, channelId?: string) {
  return useQuery<SlackMessage[]>({
    queryKey: ["messages", { projectId, channelId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (projectId) params.set("project_id", String(projectId));
      if (channelId) params.set("channel_id", channelId);
      const { data } = await api.get<SlackMessage[]>(`/messages?${params}`);
      return data;
    },
    refetchInterval: 30_000,
    enabled: !!projectId,
  });
}

export function useSlackMappings() {
  return useQuery<SlackMapping[]>({
    queryKey: ["slack-mappings"],
    queryFn: async () => {
      const { data } = await api.get<SlackMapping[]>("/admin/slack/mapping");
      return data;
    },
  });
}

export function useReply() {
  return useMutation({
    mutationFn: ({ projectId, messageText }: { projectId: number; messageText: string }) =>
      api.post("/reply", null, { params: { project_id: projectId, message_text: messageText } }),
  });
}
