// pages/Inbox/index.tsx
import { useEffect, useState } from "react";
import Skeleton from "@/components/Skeleton";
import MessageCard from "@/components/Messaging/MessageCard";
import { Card } from "@/components/ui/card";

interface SlackMessage {
  id: string;
  user_id: string;
  channel_id: string;
  text: string;
  timestamp: string;
  received_at?: string;
  project_id?: number;
  thread_ts?: string;
}

interface SlackMapping {
  project_id: number;
  slack_channel_id: string;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<SlackMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<number | "">("");
  const [channelId, setChannelId] = useState<string>("");
  const [mappings, setMappings] = useState<SlackMapping[]>([]);

  useEffect(() => {
    fetch("/api/admin/slack/mapping")
      .then((res) => res.json())
      .then(setMappings);
  }, []);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    let url = `/api/messages?project_id=${projectId}`;
    if (channelId) url += `&channel_id=${channelId}`;

    fetch(url)
      .then((res) => res.json())
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [projectId, channelId]);

  const availableChannels = mappings
    .filter((m) => m.project_id === Number(projectId))
    .map((m) => m.slack_channel_id);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Slack Inbox</h2>

      <div className="flex gap-4">
        <select
          className="border rounded p-2"
          value={projectId}
          onChange={(e) => {
            setProjectId(e.target.value ? Number(e.target.value) : "");
            setChannelId("");
          }}
        >
          <option value="">Select Project</option>
          {Array.from(new Set(mappings.map((m) => m.project_id))).map((pid) => (
            <option key={pid} value={pid}>
              Project {pid}
            </option>
          ))}
        </select>

        {projectId && (
          <select
            className="border rounded p-2"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          >
            <option value="">All Channels</option>
            {availableChannels.map((cid) => (
              <option key={cid} value={cid}>
                {cid}
              </option>
            ))}
          </select>
        )}
      </div>

      {!projectId && (
        <div className="text-gray-500 italic">Select a project to view Slack messages.</div>
      )}

      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height="h-24" className="w-full rounded-xl" />
        ))
      ) : messages.length === 0 && projectId ? (
        <Card>No messages found for this selection.</Card>
      ) : (
        messages.map((msg) => (
          <MessageCard
            key={msg.id}
            userId={msg.user_id}
            channelId={msg.channel_id}
            text={msg.text}
            timestamp={msg.timestamp}
            threadTs={msg.thread_ts}
          >
            <div className="text-xs text-gray-400">
              {new Date(Number(msg.timestamp) * 1000).toLocaleString()}
            </div>
          </MessageCard>
        ))
      )}
    </div>
  );
}
