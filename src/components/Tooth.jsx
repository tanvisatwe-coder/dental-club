import React from "react";
import { STATUS, BLEEDING } from "../data/toothMeta";

const TOOTH_CLIP =
  "polygon(18% 0%, 82% 0%, 100% 55%, 62% 100%, 50% 82%, 38% 100%, 0% 55%)";

// Each status gets a tinted (not white) background so it's readable at rest,
// not just on hover/selection — a healthy tooth should still be clearly
// visible sitting on a white card.
const VARIANT = {
  0: { bg: "#d1fae5", border: "#059669", borderWidth: 2, dashed: false }, // healthy
  1: { bg: "#fecdd3", border: "#e11d48", borderWidth: 2, dashed: false }, // cavity
  2: { bg: "#bae6fd", border: "#0284c7", borderWidth: 2, dashed: false }, // filled
  3: { bg: "#e2e8f0", border: "#94a3b8", borderWidth: 2, dashed: true }, // missing
};

const Tooth = ({
  num,
  displayNum = null,
  status = 0,
  bleedingLevel = 0,
  isSelected = false,
  onClick,
  interactive = true,
  arch = "upper",
}) => {
  const shownNum = displayNum ?? num;
  const meta = STATUS[status] ?? STATUS[0];
  const variant = VARIANT[status] ?? VARIANT[0];
  const bleed = BLEEDING[bleedingLevel] ?? BLEEDING[0];
  const isMissing = status === 3;

  return (
    <div className="group relative flex flex-col items-center">
      <span className={`mb-1 text-[11px] font-semibold text-slate-400 ${arch === "lower" ? "order-2 mb-0 mt-1" : ""}`}>
        {shownNum}
      </span>

      {/* Tooltip */}
      <div
        className="pointer-events-none absolute -top-11 z-20 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
        role="tooltip"
      >
        Tooth {shownNum} · {meta.label}
        {!isMissing && bleedingLevel > 0 && ` · Bleeding: ${bleed.label}`}
        <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-slate-900" />
      </div>

      <button
        type="button"
        onClick={interactive ? onClick : undefined}
        aria-label={`Tooth ${shownNum}, ${meta.label}${!isMissing && bleedingLevel ? `, bleeding ${bleed.label}` : ""}`}
        aria-pressed={isSelected}
        disabled={!interactive}
        className={[
          "relative flex h-10 w-8 shrink-0 items-center justify-center sm:h-11 sm:w-9",
          "transition-transform duration-150",
          isMissing ? "opacity-70" : "",
          interactive ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-0" : "cursor-default",
        ].join(" ")}
        style={{
          clipPath: TOOTH_CLIP,
          background: variant.bg,
          borderStyle: variant.dashed ? "dashed" : "solid",
          border: `${isSelected ? 2.5 : variant.borderWidth}px ${variant.dashed ? "dashed" : "solid"} ${variant.border}`,
          boxShadow: isSelected ? `0 0 0 3px ${variant.border}55` : "none",
        }}
      />

      <span
        className="mt-1 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: variant.border }}
      />

      {!isMissing && bleedingLevel > 0 && (
        <span
          className={`absolute right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
            arch === "lower" ? "bottom-4" : "top-4"
          } ${bleedingLevel >= 5 ? "animate-pulse" : ""}`}
          style={{ backgroundColor: bleed.color }}
          title={`Bleeding: ${bleed.label}`}
        />
      )}
    </div>
  );
};

export default Tooth;