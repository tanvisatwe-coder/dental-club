import React from "react";
import { STATUS, BLEEDING } from "../data/toothMeta";

const TOOTH_CLIP =
  "polygon(18% 0%, 82% 0%, 100% 55%, 62% 100%, 50% 82%, 38% 100%, 0% 55%)";

const Tooth = ({
  num,
  status = 0,
  bleedingLevel = 0,
  isSelected = false,
  onClick,
  interactive = true,
  arch = "upper", // "upper" | "lower" — flips the crown so it points the right way
}) => {
  const meta = STATUS[status] ?? STATUS[0];
  const bleed = BLEEDING[bleedingLevel] ?? BLEEDING[0];

  return (
    <div className="group relative flex flex-col items-center">
      {/* Tooltip */}
      <div
        className="pointer-events-none absolute -top-11 z-20 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
        role="tooltip"
      >
        Tooth {num} · {meta.label}
        {bleedingLevel > 0 && ` · Bleeding: ${bleed.label}`}
        <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-slate-900" />
      </div>

      <button
        type="button"
        onClick={interactive ? onClick : undefined}
        aria-label={`Tooth ${num}, ${meta.label}${bleedingLevel ? `, bleeding ${bleed.label}` : ""}`}
        aria-pressed={isSelected}
        disabled={!interactive}
        className={[
          "relative flex h-11 w-9 shrink-0 items-center justify-center sm:h-12 sm:w-10",
          "border transition-transform duration-150",
          interactive ? "cursor-pointer hover:-translate-y-0.5 active:translate-y-0" : "cursor-default",
          arch === "lower" ? "rotate-180" : "",
        ].join(" ")}
        style={{
          clipPath: TOOTH_CLIP,
          background: `linear-gradient(160deg, ${meta.fill}, ${meta.fillTo})`,
          borderColor: meta.border,
          boxShadow: isSelected ? `0 0 0 3px #0f766e, 0 4px 10px -2px rgba(15,23,42,0.35)` : "0 2px 4px -1px rgba(15,23,42,0.25)",
        }}
      >
        <span
          className={[
            "text-[11px] font-bold text-white/95 drop-shadow-sm sm:text-xs",
            arch === "lower" ? "rotate-180" : "",
          ].join(" ")}
        >
          {num}
        </span>
      </button>

      {bleedingLevel > 0 && (
        <span
          className={[
            "absolute h-2.5 w-2.5 rounded-full ring-2 ring-white",
            arch === "lower" ? "-bottom-0.5" : "-top-0.5",
            "right-0",
            bleedingLevel >= 5 ? "animate-pulse" : "",
          ].join(" ")}
          style={{ backgroundColor: bleed.color }}
          title={`Bleeding: ${bleed.label}`}
        />
      )}
    </div>
  );
};

export default Tooth;