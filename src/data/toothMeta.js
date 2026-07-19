// Single source of truth for tooth condition + bleeding colors and labels.
// Import this anywhere a tooth status or bleeding level needs a color/name
// so the chart, legend, and reports never fall out of sync.

export const STATUS = {
  0: {
    key: "healthy",
    label: "Healthy",
    fill: "#10b981", // emerald-500
    fillTo: "#059669", // emerald-600
    border: "#047857",
  },
  1: {
    key: "cavity",
    label: "Cavity",
    fill: "#fb7185", // rose-400
    fillTo: "#e11d48", // rose-600
    border: "#9f1239",
  },
  2: {
    key: "filled",
    label: "Filled",
    fill: "#38bdf8", // sky-400
    fillTo: "#0284c7", // sky-600
    border: "#075985",
  },
  3: {
    key: "missing",
    label: "Missing",
    fill: "#cbd5e1", // slate-300
    fillTo: "#94a3b8", // slate-400
    border: "#64748b", // slate-500
  },
};

export const STATUS_ORDER = [0, 1, 2, 3];

// Bleeding-on-probing severity, shown as a badge rather than replacing the
// tooth's condition color, since a tooth can be both e.g. "filled" AND bleeding.
export const BLEEDING = {
  0: { label: "None", color: "#cbd5e1" }, // slate-300 (not usually rendered)
  1: { label: "Mild", color: "#fde047" }, // yellow-300
  2: { label: "Mild+", color: "#facc15" }, // yellow-400
  3: { label: "Moderate", color: "#fb923c" }, // orange-400
  4: { label: "High", color: "#f97316" }, // orange-500
  5: { label: "Severe", color: "#dc2626" }, // red-600
};

export const modeToStatus = (mode) =>
  mode === "healthy" ? 0 : mode === "cavity" ? 1 : mode === "filled" ? 2 : 3;