import React from "react";
import Tooth from "./Tooth";
import Legend from "./Legend";

// Nudges each tooth up/down so the row reads as a real dental arch instead of
// a flat grid: front teeth of the upper arch dip down toward the lower arch,
// front teeth of the lower arch lift up toward the upper arch, and molars
// (at the outer edges) sit further back/away from the midline.
const archOffset = (indexInRow, rowLength, amplitude) => {
  const mid = (rowLength - 1) / 2;
  const normalized = Math.abs(indexInRow - mid) / mid; // 0 at center, 1 at ends
  return (1 - normalized * normalized) * amplitude;
};

const QUADRANTS = {
  upper: [
    { label: "Upper right", range: [1, 8] },
    { label: "Upper left", range: [9, 16] },
  ],
  lower: [
    { label: "Lower left", range: [17, 24] },
    { label: "Lower right", range: [25, 32] },
  ],
};

const ToothChart = ({
  teethStates,
  onToothClick,
  selectedTooth,
  bleedingMap,
  interactive = true,
  showLegend = true,
}) => {
  const upper = Array.from({ length: 16 }, (_, i) => i + 1);
  const lower = Array.from({ length: 16 }, (_, i) => i + 17);

  const renderRow = (teeth, arch) => (
    <div className="flex items-end justify-center gap-1.5 sm:gap-2">
      {teeth.map((num, idx) => {
        const offset = archOffset(idx, teeth.length, 14);
        const translateY = arch === "upper" ? offset : -offset;
        return (
          <div key={num} style={{ transform: `translateY(${translateY}px)` }}>
            <Tooth
              num={num}
              arch={arch}
              status={teethStates[num] || 0}
              bleedingLevel={bleedingMap?.[num] || 0}
              isSelected={selectedTooth === num}
              onClick={() => onToothClick(num)}
              interactive={interactive}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="relative mx-auto min-w-[560px] max-w-3xl px-4 py-6">
          {/* Midline divider between L/R */}
          <div className="pointer-events-none absolute inset-y-2 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-slate-200" />

          <div className="mb-2 flex justify-between px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>{QUADRANTS.upper[0].label}</span>
            <span>{QUADRANTS.upper[1].label}</span>
          </div>
          {renderRow(upper, "upper")}

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-300">
              Occlusal line
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {renderRow(lower, "lower")}
          <div className="mt-2 flex justify-between px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>{QUADRANTS.lower[0].label}</span>
            <span>{QUADRANTS.lower[1].label}</span>
          </div>
        </div>
      </div>

      {showLegend && (
        <div className="mt-4">
          <Legend showBleeding={!!bleedingMap} />
        </div>
      )}
    </div>
  );
};

export default ToothChart;