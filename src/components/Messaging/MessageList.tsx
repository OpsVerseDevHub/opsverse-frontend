import ChatBubble from "./ChatBubble";

export default function MessageList() {
  const messages = [
    { id: 1, sender: "Alice", text: "Hey, did you check the project?" },
    { id: 2, sender: "Me", text: "Yes, everything looks good." },
    { id: 3, sender: "Alice", text: "Cool, let me update the team." },
  ];

  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} text={msg.text} fromMe={msg.sender === "Me"} />
      ))}
    </div>
  );
}
