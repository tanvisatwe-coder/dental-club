import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Dropdown (searchable combobox)
 * props:
 *  - label: small text shown to the left of the trigger (e.g. "Patient")
 *  - value: currently selected option's value
 *  - options: [{ value, label, sublabel?, initials? }]
 *  - onChange: (value) => void
 *  - colorClass: tailwind bg class for the avatar chip, e.g. "bg-brand-600"
 */
const Dropdown = ({ label, value, options, onChange, colorClass = "bg-brand-600" }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);
  const listId = useRef(`dropdown-list-${Math.random().toString(36).slice(2, 9)}`).current;

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.sublabel || "").toLowerCase().includes(q)
    );
  }, [options, query]);

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        {label && <span className="font-medium text-slate-500">{label}</span>}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {selected?.initials && (
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white ${colorClass}`}
            >
              {selected.initials}
            </span>
          )}
          <span className="whitespace-nowrap">{selected?.label ?? "Select..."}</span>
          <svg
            viewBox="0 0 24 24"
            className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-72 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
          <div className="border-b border-slate-100 p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              aria-label="Search options"
              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div id={listId} role="listbox" className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-slate-400">No matches</p>
            )}
            {filtered.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={opt.value === value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setQuery("");
                }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-50 ${
                  opt.value === value ? "bg-brand-50" : ""
                }`}
              >
                {opt.initials && (
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${colorClass}`}
                  >
                    {opt.initials}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-slate-800">{opt.label}</span>
                  {opt.sublabel && (
                    <span className="block truncate text-xs text-slate-400">{opt.sublabel}</span>
                  )}
                </span>
                {opt.value === value && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-brand-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;