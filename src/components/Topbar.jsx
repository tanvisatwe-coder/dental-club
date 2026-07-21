import React from "react";
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
 *  - searchValue / onSearchChange: controlled search input (optional — if
 *    omitted the box still renders but doesn't filter anything)
 *  - searchPlaceholder: placeholder text for the search box
 */
const Topbar = ({
  section,
  role = "Patient",
  userName = "User",
  notifications = 0,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search patients, records...",
}) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/90 px-6 py-3 backdrop-blur">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <span className="font-semibold text-brand-700">DentalClub</span>
        <span className="text-slate-300">/</span>
        <span className="truncate font-medium text-slate-700">{section}</span>
        <span className="ml-1 hidden items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-600 ring-1 ring-sky-100 sm:flex">
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
              className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 lg:w-64"
            />
          </div>
        )}

        <button className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100" aria-label="Notifications">
          <IconBell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {notifications}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 border-l border-slate-100 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
            {initialsOf(userName)}
          </div>
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-sm font-semibold text-slate-800">{userName}</p>
            <p className="text-xs text-slate-400">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;