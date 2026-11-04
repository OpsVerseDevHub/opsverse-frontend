import { useState } from "react";
import { useMessages, useSlackMappings, useReply } from "@/hooks/useMessages";
import { useProjects } from "@/hooks/useProjects";
import Skeleton from "@/components/Skeleton";

function formatTs(ts: string) {
  const ms = Number(ts) > 1e10 ? Number(ts) : Number(ts) * 1000;
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InboxPage() {
  const [projectId, setProjectId] = useState<number | undefined>();
  const [channelId, setChannelId] = useState<string>("");
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const { data: projects } = useProjects();
  const { data: mappings = [] } = useSlackMappings();
  const { data: messages = [], isLoading } = useMessages(projectId, channelId || undefined);
  const reply = useReply();

  const projectName = (id: number) =>
    projects?.find((p) => p.id === id)?.name ?? `Project ${id}`;

  const availableChannels = mappings
    .filter((m) => m.project_id === projectId)
    .map((m) => m.slack_channel_id);

  const mappedProjects = Array.from(new Set(mappings.map((m) => m.project_id)));

  function sendReply(msg: { thread_ts?: string; project_id?: number }) {
    if (!msg.project_id || !replyText[msg.thread_ts ?? "new"]) return;
    reply.mutate(
      { projectId: msg.project_id, messageText: replyText[msg.thread_ts ?? "new"] },
      { onSuccess: () => setReplyText((prev) => ({ ...prev, [msg.thread_ts ?? "new"]: "" })) }
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <h1 className="text-xl font-bold text-gray-900">Slack Inbox</h1>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          className="border rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={projectId ?? ""}
          onChange={(e) => {
            setProjectId(e.target.value ? Number(e.target.value) : undefined);
            setChannelId("");
          }}
        >
          <option value="">All projects</option>
          {mappedProjects.map((pid) => (
            <option key={pid} value={pid}>{projectName(pid)}</option>
          ))}
        </select>

        {projectId && availableChannels.length > 0 && (
          <select
            className="border rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          >
            <option value="">All channels</option>
            {availableChannels.map((cid) => (
              <option key={cid} value={cid}>#{cid}</option>
            ))}
          </select>
        )}
      </div>

      {/* Messages */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} height="h-20" />)}
        </div>
      ) : messages.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          {projectId ? "No messages for this selection." : "Select a project to load messages."}
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const key = msg.thread_ts ?? msg.id;
            return (
              <div key={msg.id} className="bg-white border rounded-lg p-4 space-y-2 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                      {msg.user_id.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-800">{msg.user_id}</span>
                      <span className="ml-2 text-xs text-gray-400">#{msg.channel_id}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{formatTs(msg.timestamp)}</span>
                </div>

                <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.text}</p>

                {msg.thread_ts && (
                  <div className="pt-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Reply in thread…"
                      value={replyText[key] ?? ""}
                      onChange={(e) => setReplyText((prev) => ({ ...prev, [key]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && sendReply(msg)}
                      className="flex-1 text-sm border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => sendReply(msg)}
                      disabled={reply.isPending || !replyText[key]}
                      className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
