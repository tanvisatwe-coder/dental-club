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
  upper: [{ label: "Upper right" }, { label: "Upper left" }],
  lower: [{ label: "Lower left" }, { label: "Lower right" }],
};

// Wisdom teeth (third molars) — universal numbering positions 1, 16, 17, 32.
// Most people under ~12 haven't developed these yet, so pediatric patients
// get a 28-tooth chart instead of the full 32.
const WISDOM_TEETH = [1, 16, 17, 32];
const PEDIATRIC_AGE_CUTOFF = 12;

const ToothChart = ({
  teethStates,
  onToothClick,
  selectedTooth,
  bleedingMap,
  interactive = true,
  showLegend = true,
  patientAge = null,
}) => {
  const isPediatric = patientAge != null && patientAge <= PEDIATRIC_AGE_CUTOFF;

  let upper = Array.from({ length: 16 }, (_, i) => i + 1);
  let lower = Array.from({ length: 16 }, (_, i) => i + 17);

  if (isPediatric) {
    upper = upper.filter((n) => !WISDOM_TEETH.includes(n));
    lower = lower.filter((n) => !WISDOM_TEETH.includes(n));
  }

  const totalTeeth = upper.length + lower.length;

  // For the pediatric chart, show a clean sequential 1..28 label instead of
  // the gapped universal numbers (2,3,4...15,18,19...31) — the underlying
  // status/click still uses the real universal id, only the visible label
  // changes, so saved data stays compatible with the adult 32-tooth chart.
  const displayNumberFor = (realNum) => {
    if (!isPediatric) return realNum;
    const allDisplayed = [...upper, ...lower];
    return allDisplayed.indexOf(realNum) + 1;
  };

  const renderRow = (teeth, arch) => (
    // justify-start (not justify-center) is deliberate: a centered flex row
    // inside a horizontally-scrollable container clips the *start* of the
    // overflow in most browsers, which is why tooth #1/#17 were getting cut
    // off. Left-aligning avoids that; the outer wrapper below still centers
    // the whole chart when it's narrower than the card.
    <div className="flex items-end justify-start gap-1.5 sm:gap-2 sm:justify-center">
      {teeth.map((num, idx) => {
        const offset = archOffset(idx, teeth.length, 14);
        const translateY = arch === "upper" ? offset : -offset;
        return (
          <div key={num} style={{ transform: `translateY(${translateY}px)` }}>
            <Tooth
              num={num}
              displayNum={displayNumberFor(num)}
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
      {isPediatric && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
          Pediatric chart — {totalTeeth} teeth shown, numbered 1–{totalTeeth} (wisdom teeth excluded for age {patientAge})
        </div>
      )}

      <div className="overflow-x-auto pb-2">
        <div className="relative mx-auto w-max min-w-full max-w-3xl px-4 py-6 sm:min-w-0">
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