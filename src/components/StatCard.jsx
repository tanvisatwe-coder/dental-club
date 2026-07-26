import React from "react";

const TONES = {
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400",
};

const StatCard = ({ icon: Icon, label, value, tone = "slate", hint }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {Icon && (
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        {hint && <p className="text-[11px] text-slate-400 dark:text-slate-500">{hint}</p>}
      </div>
    </div>
  );
};

export default StatCard;