interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, message, icon = "📭", actionText, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 text-gray-500">
      <div className="text-5xl mb-2">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {message && <p className="text-sm mt-1">{message}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
