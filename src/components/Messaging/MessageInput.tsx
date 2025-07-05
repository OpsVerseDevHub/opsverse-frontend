import { useState } from "react";

export default function MessageInput() {
  const [text, setText] = useState("");

  return (
    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border p-2 rounded-md"
        placeholder="Type a message..."
      />
      <button type="submit" className="bg-blue-500 text-white px-4 rounded-md">Send</button>
    </form>
  );
}
