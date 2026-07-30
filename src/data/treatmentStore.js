// ============================================================
// Treatment plans per patient (localStorage)
// ============================================================
const KEY = "dentalclub_treatment_plans";

const readAll = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
};
const writeAll = (all) => {
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("treatment-updated"));
};

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ---------- Procedure templates (feature #12) ----------
export const TEMPLATES = [
  { name: "Consultation",  cost: 500,   duration: 30,  priority: "Low",       notes: "Initial examination and diagnosis.", meds: [] },
  { name: "X-Ray (IOPA)",  cost: 300,   duration: 15,  priority: "Low",       notes: "Radiograph taken for diagnosis.",    meds: [] },
  { name: "Scaling",       cost: 1500,  duration: 45,  priority: "Low",       notes: "Ultrasonic scaling, full mouth.",    meds: ["Chlorhexidine Mouthwash"] },
  { name: "Filling",       cost: 1200,  duration: 40,  priority: "Medium",    notes: "Composite restoration.",             meds: ["Ibuprofen 400mg"] },
  { name: "Root Canal",    cost: 6000,  duration: 90,  priority: "High",      notes: "RCT. Pulp exposed, temporary dressing placed.", meds: ["Amoxicillin 500mg", "Ibuprofen 400mg"] },
  { name: "Crown",         cost: 4500,  duration: 45,  priority: "Medium",    notes: "Zirconia crown cementation.",        meds: [] },
  { name: "Extraction",    cost: 2000,  duration: 30,  priority: "High",      notes: "Surgical/simple extraction under LA.", meds: ["Amoxicillin 500mg", "Ibuprofen 400mg"] },
  { name: "Implant",       cost: 30000, duration: 120, priority: "High",      notes: "Endosseous implant placement.",      meds: ["Amoxicillin 500mg", "Chlorhexidine Mouthwash"] },
  { name: "Whitening",     cost: 5000,  duration: 60,  priority: "Low",       notes: "In-office bleaching.",               meds: [] },
  { name: "Emergency Pain Relief", cost: 800, duration: 20, priority: "Emergency", notes: "Open and dress, pain management.", meds: ["Ibuprofen 400mg"] },
];

export const STATUSES  = ["Planned", "In Progress", "Completed", "Cancelled"];
export const PRIORITIES = ["Emergency", "High", "Medium", "Low"];
export const MEDICINES = [
  "Amoxicillin 500mg", "Ibuprofen 400mg", "Paracetamol 650mg",
  "Metronidazole 400mg", "Chlorhexidine Mouthwash", "Diclofenac 50mg",
];

// ---------- Plan shape ----------
const emptyPlan = () => ({
  procedures: [],
  payments: [],            // [{ id, amount, date, mode }]
  consent: null,           // { name, dataUrl, date }
 followUp: {
  date: "",
  reminderSent: false,
  reminderSentAt: "",
},
});

export const getPlan = (patientId) => {
  const all = readAll();
  return { ...emptyPlan(), ...(all[patientId] || {}) };
};

export const savePlan = (patientId, plan) => {
  const all = readAll();
  all[patientId] = plan;
  writeAll(all);
  return plan;
};

// ---------- Procedure CRUD ----------
export const addProcedure = (patientId, proc) => {
  const plan = getPlan(patientId);
  plan.procedures.push({
    id: uid(),
    procedure: "",
    tooth: "",
    priority: "Medium",
    status: "Planned",
    cost: 0,
    duration: 30,
    dentist: "",
    date: "",
    appointment: "",     // "31 Jul, 10:30 AM"
    notes: "",
    meds: [],
    files: [],           // [{ id, name, type, dataUrl }]
    createdAt: new Date().toISOString(),
    ...proc,
  });
  return savePlan(patientId, plan);
};

export const updateProcedure = (patientId, id, patch) => {
  const plan = getPlan(patientId);
  plan.procedures = plan.procedures.map((p) => (p.id === id ? { ...p, ...patch } : p));
  return savePlan(patientId, plan);
};

export const deleteProcedure = (patientId, id) => {
  const plan = getPlan(patientId);
  plan.procedures = plan.procedures.filter((p) => p.id !== id);
  return savePlan(patientId, plan);
};

// ---------- Payments ----------
export const addPayment = (patientId, amount, mode = "Cash") => {
  const plan = getPlan(patientId);
  plan.payments.push({ id: uid(), amount: Number(amount) || 0, mode, date: new Date().toISOString() });
  return savePlan(patientId, plan);
};
export const deletePayment = (patientId, id) => {
  const plan = getPlan(patientId);
  plan.payments = plan.payments.filter((p) => p.id !== id);
  return savePlan(patientId, plan);
};

// ---------- Derived numbers ----------
export const planTotals = (plan) => {
  const total = plan.procedures
    .filter((p) => p.status !== "Cancelled")
    .reduce((s, p) => s + (Number(p.cost) || 0), 0);
  const paid = plan.payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const active = plan.procedures.filter((p) => p.status !== "Cancelled");
  const done = active.filter((p) => p.status === "Completed").length;
  return {
    total,
    paid,
    pending: Math.max(total - paid, 0),
    done,
    count: active.length,
    percent: active.length ? Math.round((done / active.length) * 100) : 0,
    minutes: active.reduce((s, p) => s + (Number(p.duration) || 0), 0),
  };
};

// ---------- Tooth → status colour map (feature: chart integration) ----------
export const STATUS_TOOTH_COLOR = {
  Planned: "#3b82f6",      // blue
  "In Progress": "#f97316",// orange
  Completed: "#22c55e",    // green
  Cancelled: "#ef4444",    // red
};

/** { "26": "In Progress", ... } — highest-precedence status per tooth */
export const toothStatusMap = (plan) => {
  const rank = { Cancelled: 0, Planned: 1, "In Progress": 2, Completed: 3 };
  const map = {};
  plan.procedures.forEach((p) => {
    if (!p.tooth) return;
    const t = String(p.tooth);
    if (!map[t] || rank[p.status] > rank[map[t]]) map[t] = p.status;
  });
  return map;
};

// ---------- AI-ish suggestions (feature #18) ----------
/**
 * chartState: your chartStore object, e.g. { "26": "caries", "36": "missing" }
 * Returns [{ tooth, suggestions: [], reason }]
 */
export const suggestTreatments = (chartState = {}, plan = emptyPlan()) => {
  const existing = new Set(plan.procedures.map((p) => `${p.tooth}|${p.procedure}`));
  const RULES = {
    caries:    { s: ["Filling", "Root Canal", "Crown"], r: "Large cavity detected close to the pulp." },
    decay:     { s: ["Filling", "Root Canal"],          r: "Decay detected on the occlusal surface." },
    missing:   { s: ["Implant", "Crown"],               r: "Tooth is missing — replacement recommended." },
    fractured: { s: ["Crown", "Root Canal"],            r: "Fracture line may involve the pulp chamber." },
    rct:       { s: ["Crown"],                          r: "Endodontically treated tooth needs full coverage." },
    filled:    { s: ["Crown"],                          r: "Large existing restoration — cuspal coverage advised." },
  };
  return Object.entries(chartState)
    .map(([tooth, cond]) => {
      const key = String(cond || "").toLowerCase();
      const rule = RULES[Object.keys(RULES).find((k) => key.includes(k))];
      if (!rule) return null;
      const s = rule.s.filter((n) => !existing.has(`${tooth}|${n}`));
      return s.length ? { tooth, suggestions: s, reason: rule.r } : null;
    })
    .filter(Boolean);
};

export const subscribeTreatments = (cb) => {
  window.addEventListener("treatment-updated", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("treatment-updated", cb);
    window.removeEventListener("storage", cb);
  };
};
