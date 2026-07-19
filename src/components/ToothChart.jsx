import React from "react";
import Tooth from "./Tooth";

const ToothChart = ({ teethStates, onToothClick, selectedTooth, bleedingMap }) => {
  const upper = Array.from({ length: 16 }, (_, i) => i + 1);
  const lower = Array.from({ length: 16 }, (_, i) => i + 17);

  const renderRow = (teeth, label) => (
    <div className="mb-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {teeth.map((num) => (
          <Tooth
            key={num}
            num={num}
            status={teethStates[num] || 0}
            bleedingLevel={bleedingMap?.[num] || 0}
            isSelected={selectedTooth === num}
            onClick={() => onToothClick(num)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {renderRow(upper, "Upper teeth (1–16)")}
      {renderRow(lower, "Lower teeth (17–32)")}
    </div>
  );
};

export default ToothChart;