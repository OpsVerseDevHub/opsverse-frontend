import { useEffect, useState } from "react";
import Skeleton from "../components/Skeleton";
import MessageList from "../components/Messaging/MessageList";
import MessageInput from "../components/Messaging/MessageInput";

export default function Messages() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white shadow rounded-md overflow-hidden">
      
      {/* Conversations List */}
      <aside className="w-64 border-r p-4 flex flex-col">
        <h2 className="font-bold mb-4">Conversations</h2>
        <div className="flex flex-col gap-2">
          {loading ? (
            <>
              <Skeleton height="h-6" width="w-32" />
              <Skeleton height="h-6" width="w-28" />
              <Skeleton height="h-6" width="w-36" />
            </>
          ) : (
            <>
              <button className="text-left hover:bg-gray-100 p-2 rounded-md">Alice</button>
              <button className="text-left hover:bg-gray-100 p-2 rounded-md">Bob</button>
              <button className="text-left hover:bg-gray-100 p-2 rounded-md">Charlie</button>
            </>
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {loading ? (
            <>
              <Skeleton height="h-4" width="w-1/2" />
              <Skeleton height="h-4" width="w-1/3" />
              <Skeleton height="h-4" width="w-3/4" />
            </>
          ) : (
            <MessageList />
          )}
        </div>
        <div className="border-t p-4">
          {loading ? (
            <Skeleton height="h-10" />
          ) : (
            <MessageInput />
          )}
        </div>
      </div>
    </div>
  );
}
