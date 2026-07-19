import React, { useEffect, useRef, useState } from "react";
import { IconMessage } from "./icons";
import {
  storageKeyFor,
  loadMessages,
  saveMessages,
  markThreadRead,
} from "../data/chatStore";

/**
 * ChatBox
 * props:
 *  - doctorName: which doctor this thread belongs to
 *  - patientName: which patient this thread belongs to
 *  - role: "Dentist" | "Patient" — controls bubble alignment + who a new message is sent as
 */
const ChatBox = ({ doctorName = "Dr. Sarah Mehta", patientName = "John Doe", role = "Patient" }) => {
  const [messages, setMessages] = useState(() => loadMessages(doctorName, patientName));
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  // Reload + mark as read whenever we switch to a different thread
  useEffect(() => {
    setMessages(loadMessages(doctorName, patientName));
    markThreadRead(doctorName, patientName, role);
  }, [doctorName, patientName, role]);

  // Live update when the OTHER tab (other role) sends a message — and since
  // this thread is open/visible right now, immediately mark it read too.
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === storageKeyFor(doctorName, patientName)) {
        setMessages(loadMessages(doctorName, patientName));
        markThreadRead(doctorName, patientName, role);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [doctorName, patientName, role]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    const next = [
      ...messages,
      {
        id: Date.now(),
        sender: role,
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    setMessages(next);
    saveMessages(doctorName, patientName, next);
    markThreadRead(doctorName, patientName, role); // my own message doesn't count as unread for me
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <IconMessage className="h-4 w-4 text-brand-600" />
        <div>
          <h2 className="font-bold text-slate-800">
            {role === "Dentist" ? `Chat with ${patientName}` : `Chat with ${doctorName}`}
          </h2>
          <p className="text-xs text-slate-400">Messages sync automatically for both sides</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <p className="mt-6 text-center text-sm text-slate-400">
            No messages yet — say hello 👋
          </p>
        )}

        {messages.map((m) => {
          const isMine = m.sender === role;
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isMine
                    ? "rounded-br-sm bg-brand-600 text-white"
                    : "rounded-bl-sm bg-slate-100 text-slate-800"
                }`}
              >
                <p>{m.text}</p>
                <p className={`mt-1 text-[10px] ${isMine ? "text-brand-100" : "text-slate-400"}`}>
                  {m.sender} · {m.time}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-2 border-t border-slate-100 p-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message..."
          className="max-h-28 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          onClick={handleSend}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;