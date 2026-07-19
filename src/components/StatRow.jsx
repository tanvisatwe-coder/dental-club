import React from "react";

const StatRow = ({ items }) => {
  return (
    <div className="grid grid-cols-2 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white shadow-sm sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
      {items.map(({ label, value }) => (
        <div key={label} className="p-5">
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatRow;