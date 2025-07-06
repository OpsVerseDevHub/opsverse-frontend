import type { ReactNode } from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MessageCardProps {
  userId: string;
  channelId: string;
  text: string;
  timestamp: string;
  threadTs?: string;
  projectId?: number;
  children?: ReactNode;
}

export default function MessageCard({
  userId,
  channelId,
  text,
  timestamp,
  threadTs,
  projectId,
  children,
}: MessageCardProps) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const handleReply = () => {
    if (!replyText.trim() || !projectId) return;
    setSending(true);
    fetch("/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId, message_text: replyText }),
    })
      .then(() => setReplyText(""))
      .finally(() => setSending(false));
  };

  return (
    <Card className="hover:shadow">
      <CardContent className="space-y-2">
        <div className="text-sm text-gray-500">User: {userId}</div>
        <div className="text-sm text-gray-500">Channel: {channelId}</div>
        <div className="font-medium">{text}</div>
        <div className="text-xs text-gray-400">
          {new Date(Number(timestamp) * 1000).toLocaleString()}
        </div>
        {children}

        {threadTs && projectId && (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              placeholder="Reply to thread..."
              className="border rounded p-2 w-full"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              disabled={sending}
            />
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
              onClick={handleReply}
              disabled={!replyText.trim() || sending}
            >
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
