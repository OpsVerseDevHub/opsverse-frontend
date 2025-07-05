interface Notification {
  id: number;
  icon: string;
  title: string;
  status: "Success" | "Failed";
}

const notifications: Notification[] = [
  { id: 1, icon: "🍵", title: "Lorem ipsum dolor.", status: "Success" },
  { id: 2, icon: "🍩", title: "Lorem ipsum dolor.", status: "Failed" },
  { id: 3, icon: "🍔", title: "Lorem ipsum dolor.", status: "Success" },
  { id: 4, icon: "🍕", title: "Lorem ipsum dolor.", status: "Failed" },
  { id: 5, icon: "🍗", title: "Lorem ipsum dolor.", status: "Success" },
];

export default function NotificationDropdown() {
  return (
    <div className="absolute right-0 mt-12 w-80 bg-white shadow rounded-md animate-fade-in z-50 border">
      <div className="max-h-72 overflow-y-auto divide-y">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-center gap-3 p-3 hover:bg-gray-100">
            <span className="text-2xl">{n.icon}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">{n.title}</p>
              <p className="text-xs text-gray-500">Lorem, ipsum dolor sit amet.</p>
            </div>
            <span
              className={`text-xs font-semibold ${
                n.status === "Success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {n.status}
            </span>
          </div>
        ))}
      </div>
      <div className="text-center p-3 border-t hover:underline text-blue-500 text-sm cursor-pointer">
        Show All Activities
      </div>
    </div>
  );
}
