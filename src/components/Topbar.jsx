import React, { useEffect, useRef, useState } from "react";
import { IconSearch, IconBell } from "./icons";

const initialsOf = (name = "") =>
  name.replace(/^Dr\.?\s*/i, "").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

/**
 * Topbar
 * props:
 *  - section: current page label shown in the breadcrumb (e.g. "Charting Center")
 *  - role: "Dentist" | "Patient" — shown as a small pill badge
 *  - userName: display name on the right (e.g. "Dr. Mehra" or the patient's name)
 *  - notifications: number shown on the bell badge
 *  - notificationItems: [{ key, name, preview, time, unread }] — threads with
 *    unread messages, newest first. Clicking one calls onSelectNotification.
 *  - onSelectNotification: (item) => void — jump to that chat thread
 *  - searchValue / onSearchChange: controlled search input (optional — if
 *    omitted the box still renders but doesn't filter anything)
 *  - searchPlaceholder: placeholder text for the search box
 */
const Topbar = ({
  section,
  role = "Patient",
  userName = "User",
  notifications = 0,
  notificationItems = [],
  onSelectNotification = () => {},
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search patients, records...",
  onMenuClick,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="mr-1 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <span className="font-semibold text-brand-700 dark:text-brand-400">DentalClub</span>
        <span className="hidden text-slate-300 dark:text-slate-600 sm:inline">/</span>
        <span className="hidden truncate font-medium text-slate-700 dark:text-slate-300 sm:inline">{section}</span>
        <span className="ml-1 hidden items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-600 ring-1 ring-sky-100 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-900 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          {role} View
        </span>
      </div>

      <div className="flex items-center gap-3">
        {onSearchChange && (
          <div className="relative hidden md:block">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 lg:w-64"
            />
          </div>
        )}

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            aria-haspopup="true"
            aria-expanded={notifOpen}
            aria-label={`Notifications${notifications > 0 ? `, ${notifications} unread` : ""}`}
            className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <IconBell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {notifications}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:text-slate-100">
                Messages
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notificationItems.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                    No new messages
                  </p>
                ) : (
                  notificationItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        onSelectNotification(item);
                        setNotifOpen(false);
                      }}
                      className="flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50 dark:border-slate-700/60 dark:hover:bg-slate-700/50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                        {initialsOf(item.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{item.name}</p>
                          <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">{item.time}</span>
                        </div>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.preview}</p>
                      </div>
                      {item.unread > 0 && (
                        <span className="mt-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                          {item.unread}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-l border-slate-100 pl-3 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
            {initialsOf(userName)}
          </div>
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{userName}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;