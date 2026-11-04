import { GitCommit, GitPullRequest, AlertCircle, RefreshCw } from "lucide-react";
import { useGitHubActivity } from "@/hooks/useGitHubActivity";
import Skeleton from "@/components/Skeleton";
import type { GitHubActivity } from "@/lib/types";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function EventIcon({ type }: { type: string }) {
  if (type === "push") return <GitCommit size={16} className="text-blue-500" />;
  if (type === "pull_request") return <GitPullRequest size={16} className="text-purple-500" />;
  return <AlertCircle size={16} className="text-yellow-500" />;
}

function EventBadge({ type, action }: { type: string; action?: string }) {
  const label =
    type === "push"
      ? "push"
      : type === "pull_request"
      ? action ?? "pr"
      : action ?? "issue";

  const color =
    type === "push"
      ? "bg-blue-50 text-blue-700"
      : type === "pull_request"
      ? "bg-purple-50 text-purple-700"
      : "bg-yellow-50 text-yellow-700";

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{label}</span>
  );
}

function ActivityCard({ event }: { event: GitHubActivity }) {
  const { summary } = event;
  const repo = summary.repo?.split("/").pop() ?? summary.repo ?? "unknown";

  return (
    <div className="bg-white border rounded-lg p-4 space-y-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EventIcon type={event.event_type} />
          <span className="text-sm font-semibold text-gray-800">{repo}</span>
          <EventBadge type={event.event_type} action={summary.action} />
        </div>
        <span className="text-xs text-gray-400">{timeAgo(event.received_at)}</span>
      </div>

      {event.event_type === "push" && (
        <>
          <p className="text-xs text-gray-500">
            <span className="font-medium">{summary.pusher}</span> pushed to{" "}
            <code className="bg-gray-100 px-1 rounded">{summary.ref?.replace("refs/heads/", "")}</code>
          </p>
          {summary.commits && summary.commits.length > 0 && (
            <ul className="space-y-1 mt-1">
              {summary.commits.map((c) => (
                <li key={c.hash} className="flex items-start gap-2 text-xs text-gray-600">
                  <code className="shrink-0 font-mono text-gray-400">{c.hash}</code>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noreferrer" className="hover:underline truncate">
                      {c.message}
                    </a>
                  ) : (
                    <span className="truncate">{c.message}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {(event.event_type === "pull_request" || event.event_type === "issues") && (
        <p className="text-sm text-gray-700">
          {summary.url ? (
            <a href={summary.url} target="_blank" rel="noreferrer" className="hover:underline font-medium">
              #{summary.number} {summary.title}
            </a>
          ) : (
            <span className="font-medium">#{summary.number} {summary.title}</span>
          )}
          {summary.user && (
            <span className="text-gray-400 text-xs ml-2">by {summary.user}</span>
          )}
        </p>
      )}
    </div>
  );
}

export default function Messages() {
  const { data: events = [], isLoading, refetch, isFetching } = useGitHubActivity(100);

  return (
    <div className="p-6 max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">GitHub Activity</h1>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 transition"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="h-20" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-gray-400 space-y-2">
          <GitCommit size={32} className="mx-auto opacity-30" />
          <p className="text-sm">No GitHub events yet.</p>
          <p className="text-xs">Configure a webhook in your repo pointing to <code>/webhooks/github</code>.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <ActivityCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
