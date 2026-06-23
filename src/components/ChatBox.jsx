import { useState } from "react";

export default function ChatBox({ onClose }) {
  const [messages, setMessages] = useState([
    { text: "Hi! I am your dental assistant 🦷", from: "bot" }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;

    const newMessages = [
      ...messages,
      { text: input, from: "user" },
      { text: "Thanks! I will help you with that.", from: "bot" }
    ];

    setMessages(newMessages);
    setInput("");
  };

  return (
    <div className="fixed bottom-20 right-5 w-80 bg-white shadow-xl rounded-lg overflow-hidden">

      <div className="bg-blue-600 text-white p-2 flex justify-between">
        <span>Chat Assistant</span>
        <button onClick={onClose}>X</button>
      </div>

      <div className="h-64 overflow-y-auto p-2 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${
              m.from === "user" ? "text-right" : "text-left"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex border-t">
        <input
          className="flex-1 p-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-3"
        >
          Send
        </button>
      </div>

    </div>
  );
}