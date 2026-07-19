import React, { useEffect, useRef, useState } from "react";

/**
 * Dropdown
 * props:
 *  - label: small text shown to the left of the trigger (e.g. "Patient")
 *  - value: currently selected option's value
 *  - options: [{ value, label, sublabel?, initials? }]
 *  - onChange: (value) => void
 *  - colorClass: tailwind bg class for the avatar chip, e.g. "bg-brand-600"
 */
const Dropdown = ({ label, value, options, onChange, colorClass = "bg-brand-600" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        {label && <span className="font-medium text-slate-500">{label}</span>}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
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
        <div className="absolute z-30 mt-2 w-64 overflow-hidden rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
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
      )}
    </div>
  );
};

export default Dropdown;