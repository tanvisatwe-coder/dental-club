import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IconMessage } from "./icons";
import {
  storageKeyFor,
  loadMessages,
  saveMessages,
  markThreadRead,
  sendReportMessage,
  deleteMessage,
} from "../data/chatStore";
import { loadChart } from "../data/chartStore";
import { sendReport } from "../data/reportsStore";

const computeRisk = (cavityCount, bleedingScore) => {
  if (bleedingScore > 25 || cavityCount > 6) return "High";
  if (bleedingScore > 10 || cavityCount > 3) return "Medium";
  return "Low";
};

/**
 * ChatBox
 * props:
 *  - doctorName: which doctor this thread belongs to
 *  - patientName: which patient this thread belongs to
 *  - role: "Dentist" | "Patient" — controls bubble alignment + who a new message is sent as
 *  - patientProfile: optional { appointment, advice } shown in a sent report card
 */
const ChatBox = ({
  doctorName = "Dr. Sarah Mehta",
  patientName = "John Doe",
  role = "Patient",
  patientProfile = {},
}) => {
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

  const handleSendReport = () => {
    const chart = loadChart(patientName);
    const counts = Object.values(chart.teeth).reduce(
      (acc, s) => {
        if (s === 0) acc.healthyCount++;
        else if (s === 1) acc.cavityCount++;
        else if (s === 2) acc.filledCount++;
        else if (s === 3) acc.missingCount++;
        return acc;
      },
      { healthyCount: 0, cavityCount: 0, filledCount: 0, missingCount: 0 }
    );
    const bleedingScore = Object.values(chart.bleeding || {}).reduce((a, b) => a + b, 0);

    const snapshot = {
      ...counts,
      bleedingScore,
      risk: computeRisk(counts.cavityCount, bleedingScore),
      appointment: patientProfile.appointment,
      advice: patientProfile.advice,
      sentBy: doctorName,
    };

    sendReport(patientName, snapshot);
    const next = sendReportMessage(doctorName, patientName, role, snapshot);
    setMessages(next);
    toast.success(`Report sent to ${patientName}.`);
  };

  const handleDeleteMessage = (messageId) => {
    const next = deleteMessage(doctorName, patientName, messageId);
    setMessages(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[70vh] flex-col rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <IconMessage className="h-4 w-4 text-brand-600" />
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100">
              {role === "Dentist" ? `Chat with ${patientName}` : `Chat with ${doctorName}`}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Messages sync automatically for both sides</p>
          </div>
        </div>
        {role === "Dentist" && (
          <button
            onClick={handleSendReport}
            className="shrink-0 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100 dark:bg-brand-950/50 dark:text-brand-300 dark:hover:bg-brand-900"
          >
            Send Report
          </button>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <p className="mt-6 text-center text-sm text-slate-400 dark:text-slate-500">
            No messages yet — say hello 👋
          </p>
        )}

        {messages.map((m) => {
          const isMine = m.sender === role;

          if (m.type === "report") {
            const r = m.report;
            return (
              <div key={m.id} className={`group flex items-start gap-1.5 ${isMine ? "justify-end" : "justify-start"}`}>
                {isMine && (
                  <button
                    onClick={() => handleDeleteMessage(m.id)}
                    aria-label="Delete message"
                    className="mt-3 shrink-0 rounded p-1 text-slate-300 opacity-0 transition-opacity hover:bg-slate-100 hover:text-rose-500 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-slate-800"
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M4 6h16M9 6V4h6v2M6 6l1 14h10l1-14" />
                    </svg>
                  </button>
                )}
                <div className="max-w-[85%] rounded-2xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm dark:border-brand-900 dark:bg-brand-950/30">
                  <p className="mb-2 flex items-center gap-1.5 font-semibold text-brand-700 dark:text-brand-300">
                    📋 Dental Report
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <span>Healthy: <b>{r.healthyCount}</b></span>
                    <span>Cavities: <b>{r.cavityCount}</b></span>
                    <span>Filled: <b>{r.filledCount}</b></span>
                    <span>Missing: <b>{r.missingCount}</b></span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">Risk: {r.risk}</p>
                  {r.advice && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Advice: {r.advice}</p>}
                  <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">{m.sender} · {m.time}</p>
                </div>
              </div>
            );
          }

          return (
            <div key={m.id} className={`group flex items-start gap-1.5 ${isMine ? "justify-end" : "justify-start"}`}>
              {isMine && (
                <button
                  onClick={() => handleDeleteMessage(m.id)}
                  aria-label="Delete message"
                  className="mt-2 shrink-0 rounded p-1 text-slate-300 opacity-0 transition-opacity hover:bg-slate-100 hover:text-rose-500 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-slate-800"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 6h16M9 6V4h6v2M6 6l1 14h10l1-14" />
                  </svg>
                </button>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  isMine
                    ? "rounded-br-sm bg-brand-600 text-white"
                    : "rounded-bl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                }`}
              >
                <p>{m.text}</p>
                <p className={`mt-1 text-[10px] ${isMine ? "text-brand-100" : "text-slate-400 dark:text-slate-500"}`}>
                  {m.sender} · {m.time}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-2 border-t border-slate-100 p-3 dark:border-slate-800">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message..."
          className="max-h-28 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
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