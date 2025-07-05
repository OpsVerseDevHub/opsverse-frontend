interface ChatBubbleProps {
  text: string;
  fromMe: boolean;
}

export default function ChatBubble({ text, fromMe }: ChatBubbleProps) {
  return (
    <div className={`max-w-[70%] p-2 rounded-md ${fromMe ? "bg-blue-500 text-white self-end" : "bg-gray-200 self-start"}`}>
      {text}
    </div>
  );
}
