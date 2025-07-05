import MessageList from "../components/Messaging/MessageList";
import MessageInput from "../components/Messaging/MessageInput";

export default function Messages() {
  return (
    <div className="flex flex-1 flex-col md:flex-row bg-white shadow rounded-md overflow-hidden">

      {/* Conversations List */}
      <aside className="w-full md:w-64 border-r p-4 flex flex-col">
        <h2 className="font-bold mb-4">Conversations</h2>
        <div className="flex flex-col gap-2">
          <button className="text-left hover:bg-gray-100 p-2 rounded-md">Alice</button>
          <button className="text-left hover:bg-gray-100 p-2 rounded-md">Bob</button>
          <button className="text-left hover:bg-gray-100 p-2 rounded-md">Charlie</button>
        </div>
      </aside>

      {/* Chat Area */}
      <div className="flex flex-col flex-1 h-full">
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <MessageList />
        </div>
        <div className="border-t p-4">
          <MessageInput />
        </div>
      </div>
    </div>
  );
}

