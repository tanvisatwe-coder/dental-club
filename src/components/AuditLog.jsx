import React from "react";

/**
 * AuditLog
 * props:
 *  - entries: array of { tooth, label, color, time }, newest first is fine —
 *    this component reverses so the most recent shows on top regardless of
 *    how it's pushed.
 */
const AuditLog = ({ entries = [] }) => {
  const ordered = [...entries].reverse();

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-3 font-bold text-slate-800">Recent Activity</h3>

      {ordered.length === 0 ? (
        <p className="text-sm text-slate-400">No changes recorded yet this session</p>
      ) : (
        <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
          {ordered.map((entry, i) => (
            <li key={i} className="border-l-2 pl-3" style={{ borderColor: entry.color }}>
              <p className="text-sm font-medium text-slate-700">
                Tooth #{entry.tooth} <span className="text-slate-400">—</span> {entry.label}
              </p>
              <p className="text-xs text-slate-400">{entry.time}</p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-medium text-slate-400">
        {entries.length} change{entries.length !== 1 ? "s" : ""} recorded
      </p>
    </div>
  );
};

export default AuditLog;