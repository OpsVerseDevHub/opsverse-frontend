interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  return (
    <div className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow text-white animate-slide-up transition
      ${type === "success" ? "bg-green-500" : "bg-red-500"}`}>
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <button className="ml-2 hover:opacity-80" onClick={onClose}>✖</button>
      </div>
    </div>
  );
}
