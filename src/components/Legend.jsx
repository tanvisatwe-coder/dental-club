import React from "react";
import { STATUS, STATUS_ORDER, BLEEDING } from "../data/toothMeta";

const Legend = ({ showBleeding = true }) => {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-xs text-slate-600">
      <div className="flex items-center gap-4">
        {STATUS_ORDER.map((key) => {
          const s = STATUS[key];
          return (
            <span key={key} className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-sm"
                style={{ background: `linear-gradient(160deg, ${s.fill}, ${s.fillTo})` }}
              />
              {s.label}
            </span>
          );
        })}
      </div>

      {showBleeding && (
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
          <span className="text-slate-500">Bleeding:</span>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <span
              key={lvl}
              className="h-2.5 w-2.5 rounded-full ring-1 ring-white"
              style={{ backgroundColor: BLEEDING[lvl].color }}
              title={BLEEDING[lvl].label}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Legend;