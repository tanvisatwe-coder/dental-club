export const STATUS = {
  0: { key: "healthy", label: "Healthy", fill: "#10b981", fillTo: "#059669", border: "#047857" },
  1: { key: "cavity", label: "Cavity", fill: "#fb7185", fillTo: "#e11d48", border: "#9f1239" },
  2: { key: "filled", label: "Filled", fill: "#38bdf8", fillTo: "#0284c7", border: "#075985" },
};

export const STATUS_ORDER = [0, 1, 2];

export const BLEEDING = {
  0: { label: "None", color: "#cbd5e1" },
  1: { label: "Mild", color: "#fde047" },
  2: { label: "Mild+", color: "#facc15" },
  3: { label: "Moderate", color: "#fb923c" },
  4: { label: "High", color: "#f97316" },
  5: { label: "Severe", color: "#dc2626" },
};

export const modeToStatus = (mode) =>
  mode === "healthy" ? 0 : mode === "cavity" ? 1 : 2;