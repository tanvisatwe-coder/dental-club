import React, { useState, useEffect, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import { notify } from "../utils/notify";
import { sendReminderMessage } from "../data/chatStore";
import {
  TEMPLATES, STATUSES, PRIORITIES, MEDICINES,
  getPlan, savePlan, addProcedure, updateProcedure, deleteProcedure,
  addPayment, deletePayment, planTotals, suggestTreatments,
  subscribeTreatments, uid,
} from "../data/treatmentStore";

/* ---------------- helpers ---------------- */
const inr = (n) => "₹" + (Number(n) || 0).toLocaleString("en-IN");

const STATUS_UI = {
  Planned:       { dot: "🟡", cls: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30" },
  "In Progress": { dot: "🔵", cls: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30" },
  Completed:     { dot: "🟢", cls: "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30" },
  Cancelled:     { dot: "🔴", cls: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30" },
};
const PRIORITY_UI = {
  Emergency: { dot: "🔴", cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300" },
  High:      { dot: "🟠", cls: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" },
  Medium:    { dot: "🟡", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300" },
  Low:       { dot: "🟢", cls: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300" },
};
const PRIORITY_RANK = { Emergency: 0, High: 1, Medium: 2, Low: 3 };

const card =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900";
const input =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100";
const btn =
  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition";

const Badge = ({ ui, label }) => (
  <span className={`inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-1 text-xs font-semibold ${ui.cls}`}>
    <span>{ui.dot}</span>{label}
  </span>
);

const fileToDataUrl = (file) =>
  new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });

/* ================================================================== */

const TreatmentPlan = ({
  patientId,
  patientName = "Patient",
  selectedTooth = "",     // ← from ToothChart click
  chartState = {},        // ← your chartStore state, for AI suggestions
  onToothStatusChange,    // ← (map) => void, so the chart can recolour teeth
  readOnly = false,
}) => {
  const key = patientId || patientName;
  const [plan, setPlan] = useState(() => getPlan(key));
  const [view, setView] = useState("table");        // table | cards
  const [sortByPriority, setSortByPriority] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [payAmt, setPayAmt] = useState("");
  const printRef = useRef(null);

  const blank = {
    procedure: "", tooth: selectedTooth || "", priority: "Medium", status: "Planned",
    cost: "", duration: 30, dentist: "", date: "", appointment: "", notes: "", meds: [],
  };
  const [form, setForm] = useState(blank);

  useEffect(() => setPlan(getPlan(key)), [key]);
  useEffect(() => subscribeTreatments(() => setPlan(getPlan(key))), [key]);

  // tooth preselect when a tooth is clicked on the chart
  useEffect(() => {
    if (selectedTooth) {
      setForm((f) => ({ ...f, tooth: String(selectedTooth) }));
      setShowForm(true);
    }
  }, [selectedTooth]);

  // push tooth colours back up to the chart
  useEffect(() => {
    if (!onToothStatusChange) return;
    const rank = { Cancelled: 0, Planned: 1, "In Progress": 2, Completed: 3 };
    const map = {};
    plan.procedures.forEach((p) => {
      if (!p.tooth) return;
      const t = String(p.tooth);
      if (!map[t] || rank[p.status] > rank[map[t]]) map[t] = p.status;
    });
    onToothStatusChange(map);
  }, [plan, onToothStatusChange]);

  const t = useMemo(() => planTotals(plan), [plan]);
  const suggestions = useMemo(() => suggestTreatments(chartState, plan), [chartState, plan]);
  const today = new Date().toISOString().split("T")[0];

const followUpStatus = plan.followUp?.date
  ? plan.followUp.date < today
    ? "overdue"
    : plan.followUp.date === today
    ? "today"
    : "upcoming"
  : null;

  const rows = useMemo(() => {
    const list = [...plan.procedures];
    return sortByPriority
      ? list.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
      : list;
  }, [plan, sortByPriority]);

  const history = useMemo(() => {
    const done = plan.procedures.filter((p) => p.status === "Completed");
    const byYear = {};
    done.forEach((p) => {
      const y = (p.date || p.createdAt || "").slice(0, 4) || "Undated";
      (byYear[y] = byYear[y] || []).push(p);
    });
    return Object.entries(byYear).sort((a, b) => b[0].localeCompare(a[0]));
  }, [plan]);

  /* ---------------- actions ---------------- */
  const applyTemplate = (name) => {
    const tpl = TEMPLATES.find((x) => x.name === name);
    if (!tpl) return setForm((f) => ({ ...f, procedure: name }));
    setForm((f) => ({
      ...f, procedure: tpl.name, cost: tpl.cost, duration: tpl.duration,
      priority: tpl.priority, notes: tpl.notes, meds: tpl.meds,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.procedure.trim()) return;
    if (editing) setPlan(updateProcedure(key, editing, { ...form, cost: Number(form.cost) || 0 }));
    else setPlan(addProcedure(key, { ...form, cost: Number(form.cost) || 0 }));
    setForm(blank); setEditing(null); setShowForm(false);
  };

  const startEdit = (p) => { setForm({ ...p }); setEditing(p.id); setShowForm(true); };
  const setStatus = (id, status) => setPlan(updateProcedure(key, id, { status }));
  const remove = (id) => window.confirm("Delete this procedure?") && setPlan(deleteProcedure(key, id));

  const attach = async (id, fileList) => {
    const files = await Promise.all(
      Array.from(fileList).map(async (f) => ({
        id: uid(), name: f.name, type: f.type, dataUrl: await fileToDataUrl(f),
      }))
    );
    const proc = plan.procedures.find((p) => p.id === id);
    setPlan(updateProcedure(key, id, { files: [...(proc.files || []), ...files] }));
  };
  const detach = (id, fid) => {
    const proc = plan.procedures.find((p) => p.id === id);
    setPlan(updateProcedure(key, id, { files: proc.files.filter((f) => f.id !== fid) }));
  };

  const uploadConsent = async (file) => {
    if (!file) return;
    const next = { ...plan, consent: { name: file.name, dataUrl: await fileToDataUrl(file), date: new Date().toISOString() } };
    setPlan(savePlan(key, next));
  };

  const setFollowUp = (patch) =>
    setPlan(savePlan(key, { ...plan, followUp: { ...plan.followUp, ...patch } }));

  /* ---------------- PDF ---------------- */
  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 18;
    doc.setFontSize(18).setTextColor(13, 148, 136).text("DentalClub", 14, y);
    doc.setFontSize(10).setTextColor(120).text("Treatment Plan", 14, (y += 6));
    doc.setTextColor(30).setFontSize(12).text(`Patient: ${patientName}`, 14, (y += 12));
    doc.setFontSize(9).setTextColor(120)
      .text(`Generated: ${new Date().toLocaleDateString("en-IN")}`, 14, (y += 6));

    y += 8;
    doc.setFontSize(9).setTextColor(80);
    doc.text("Procedure", 14, y); doc.text("Tooth", 62, y); doc.text("Priority", 80, y);
    doc.text("Status", 106, y); doc.text("Dur", 138, y); doc.text("Cost", 160, y);
    doc.line(14, y + 2, 196, y + 2);

    plan.procedures.forEach((p) => {
      y += 7;
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setTextColor(30);
      doc.text(String(p.procedure).slice(0, 24), 14, y);
      doc.text(String(p.tooth || "-"), 62, y);
      doc.text(p.priority, 80, y);
      doc.text(p.status, 106, y);
      doc.text(`${p.duration || 0}m`, 138, y);
      doc.text(inr(p.cost).replace("₹", "Rs."), 160, y);
      if (p.notes) { y += 5; doc.setFontSize(8).setTextColor(130).text(`  ${String(p.notes).slice(0, 90)}`, 14, y); doc.setFontSize(9); }
    });

    y += 12; doc.line(14, y - 6, 196, y - 6);
    doc.setTextColor(30).setFontSize(10);
    doc.text(`Total:   Rs.${t.total.toLocaleString("en-IN")}`, 14, y);
    doc.text(`Paid:    Rs.${t.paid.toLocaleString("en-IN")}`, 74, y);
    doc.text(`Pending: Rs.${t.pending.toLocaleString("en-IN")}`, 134, y);
    y += 8; doc.text(`Progress: ${t.percent}%  (${t.done}/${t.count} completed)`, 14, y);
    if (plan.followUp?.date) { y += 6; doc.text(`Next follow-up: ${plan.followUp.date}`, 14, y); }

    y = Math.max(y + 30, 250);
    doc.line(130, y, 190, y);
    doc.setFontSize(9).setTextColor(120).text("Dentist Signature", 145, y + 5);

    doc.save(`${patientName.replace(/\s+/g, "_")}_treatment_plan.pdf`);
  };

  const emailPatient = () => {
    const body = plan.procedures
      .map((p) => `• ${p.procedure} (${p.tooth || "-"}) — ${p.status} — ${inr(p.cost)}`)
      .join("%0D%0A");
    window.location.href =
      `mailto:?subject=${encodeURIComponent(`Treatment Plan — ${patientName}`)}` +
      `&body=${body}%0D%0A%0D%0ATotal: ${inr(t.total)}%0D%0APaid: ${inr(t.paid)}%0D%0APending: ${inr(t.pending)}`;
  };

  const sendReminder = () => {
  if (!plan.followUp?.date) {
    notify.error("Pick a follow-up date first");
    return;
  }

  const dentist = plan.procedures[0]?.dentist || "Dentist";
  const note = `Follow-up visit scheduled on ${plan.followUp.date}`;

  // Send reminder message into chat
  sendReminderMessage(dentist, patientName, {
    date: plan.followUp.date,
    text: note,
  });

  setFollowUp({
    reminderSent: true,
    reminderSentAt: new Date().toISOString(),
  });

  notify.success(`Reminder sent to ${patientName}`);
};

  /* ---------------- render ---------------- */
  return (
    <div className="space-y-5" ref={printRef}>
      {/* ===== Header + summary ===== */}
      <div className={card}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">🦷 Treatment Plan</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {patientName} · {t.count} procedures · approx {Math.floor(t.minutes / 60)}h {t.minutes % 60}m chair time
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => window.print()} className={`${btn} bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200`}>🖨 Print</button>
            <button onClick={downloadPDF} className={`${btn} bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200`}>📄 PDF</button>
            <button onClick={emailPatient} className={`${btn} bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200`}>📧 Email</button>
            {!readOnly && (
              <button onClick={() => { setEditing(null); setForm(blank); setShowForm((s) => !s); }}
                className={`${btn} bg-teal-600 text-white hover:bg-teal-700`}>
                {showForm ? "✕ Close" : "+ Add Treatment"}
              </button>
            )}
          </div>
        </div>

        {/* summary tiles */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Planned", plan.procedures.filter((p) => p.status === "Planned").length, "text-blue-600"],
            ["In Progress", plan.procedures.filter((p) => p.status === "In Progress").length, "text-orange-500"],
            ["Completed", t.done, "text-green-600"],
            ["Total", inr(t.total), "text-slate-700 dark:text-slate-200"],
            ["Paid", inr(t.paid), "text-green-600"],
            ["Pending", inr(t.pending), "text-red-500"],
          ].map(([label, val, cls]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
              <p className={`mt-0.5 text-lg font-bold ${cls}`}>{val}</p>
            </div>
          ))}
        </div>

        {/* progress bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>Treatment Completion</span>
            <span>{t.percent}% · {t.done}/{t.count} procedures</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-green-500 transition-all duration-500"
                 style={{ width: `${t.percent}%` }} />
          </div>
        </div>
      </div>

      {/* ===== AI suggestions ===== */}
      {suggestions.length > 0 && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-500/30 dark:bg-violet-500/10">
          <h3 className="text-sm font-bold text-violet-800 dark:text-violet-200">✨ AI Suggestions</h3>
          <div className="mt-3 space-y-3">
            {suggestions.map((s) => (
              <div key={s.tooth} className="rounded-xl bg-white p-3 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tooth {s.tooth}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Reason: {s.reason}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.suggestions.map((name) => (
                    <button key={name} disabled={readOnly}
                      onClick={() => { setShowForm(true); setEditing(null); setForm({ ...blank, tooth: s.tooth }); setTimeout(() => applyTemplate(name), 0); }}
                      className={`${btn} bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50`}>
                      + {name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== Add / edit form ===== */}
      {showForm && !readOnly && (
        <form onSubmit={submit} className={card}>
          <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">
            {editing ? "Edit Procedure" : "New Procedure"}
          </h3>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">Template</label>
              <select className={input} value="" onChange={(e) => applyTemplate(e.target.value)}>
                <option value="">Select Template…</option>
                {TEMPLATES.map((x) => <option key={x.name} value={x.name}>{x.name} · {inr(x.cost)} · {x.duration}min</option>)}
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">Procedure *</label>
              <input className={input} value={form.procedure} onChange={(e) => setForm({ ...form, procedure: e.target.value })} placeholder="Root Canal" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Tooth No.</label>
              <input className={input} value={form.tooth} onChange={(e) => setForm({ ...form, tooth: e.target.value })} placeholder="26" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Priority</label>
              <select className={input} value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
              <select className={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Cost (₹)</label>
              <input type="number" className={input} value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Duration (min)</label>
              <input type="number" className={input} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Dentist</label>
              <input className={input} value={form.dentist} onChange={(e) => setForm({ ...form, dentist: e.target.value })} placeholder="Dr. Sarah" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
              <input type="date" className={input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Appointment</label>
              <input className={input} value={form.appointment} onChange={(e) => setForm({ ...form, appointment: e.target.value })} placeholder="31 Jul, 10:30 AM" />
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-1 block text-xs font-medium text-slate-500">Clinical Notes (one per line)</label>
            <textarea rows={3} className={input} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder={"Severe pain\nPulp exposed\nTemporary dressing placed"} />
          </div>

          <div className="mt-3">
            <label className="mb-1 block text-xs font-medium text-slate-500">Prescriptions</label>
            <div className="flex flex-wrap gap-2">
              {MEDICINES.map((m) => {
                const on = form.meds?.includes(m);
                return (
                  <button type="button" key={m}
                    onClick={() => setForm({ ...form, meds: on ? form.meds.filter((x) => x !== m) : [...(form.meds || []), m] })}
                    className={`${btn} border ${on ? "border-teal-600 bg-teal-600 text-white" : "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"}`}>
                    {on ? "✓" : "+"} {m}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" className={`${btn} bg-teal-600 px-4 py-2 text-white hover:bg-teal-700`}>
              {editing ? "Save Changes" : "Add Procedure"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); setForm(blank); }}
              className={`${btn} bg-slate-100 px-4 py-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200`}>Cancel</button>
          </div>
        </form>
      )}

      {/* ===== View switch ===== */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {["table", "cards"].map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${view === v ? "bg-white text-teal-700 shadow-sm dark:bg-slate-900 dark:text-teal-300" : "text-slate-500"}`}>
              {v === "table" ? "☰ Table" : "▦ Cards"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <input type="checkbox" checked={sortByPriority} onChange={(e) => setSortByPriority(e.target.checked)} />
          Sort by urgency
        </label>
      </div>

      {/* ===== Table view ===== */}
      {view === "table" && (
        <div className={`${card} overflow-x-auto p-0`}>
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                {["Procedure", "Tooth", "Priority", "Status", "Cost", "Dentist", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-400">No procedures yet. Add one to start the plan.</td></tr>
              )}
              {rows.map((p) => (
                <React.Fragment key={p.id}>
                  <tr className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <button onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                        className="font-semibold text-slate-800 hover:text-teal-600 dark:text-slate-100">
                        {expanded === p.id ? "▾" : "▸"} {p.procedure}
                      </button>
                      {p.duration ? <span className="ml-2 text-xs text-slate-400">{p.duration} min</span> : null}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">{p.tooth || "—"}</td>
                    <td className="px-4 py-3"><Badge ui={PRIORITY_UI[p.priority]} label={p.priority} /></td>
                    <td className="px-4 py-3"><Badge ui={STATUS_UI[p.status]} label={p.status} /></td>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">{inr(p.cost)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.dentist || "—"}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {p.date || "—"}
                      {p.appointment && <div className="text-xs text-teal-600">📅 {p.appointment}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {!readOnly && (
                        <div className="flex flex-wrap gap-1">
                          <button title="Mark complete" onClick={() => setStatus(p.id, "Completed")} className={`${btn} bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/15 dark:text-green-300`}>✔</button>
                          <button title="In progress" onClick={() => setStatus(p.id, "In Progress")} className={`${btn} bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-500/15 dark:text-orange-300`}>⏸</button>
                          <button title="Edit" onClick={() => startEdit(p)} className={`${btn} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200`}>✏</button>
                          <button title="Delete" onClick={() => remove(p.id)} className={`${btn} bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/15 dark:text-red-300`}>🗑</button>
                        </div>
                        
                      )}
                    </td>
                  </tr>

                  {expanded === p.id && (
                    <tr className="bg-slate-50/70 dark:bg-slate-800/40">
                      <td colSpan={8} className="px-4 py-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase text-slate-500">Clinical Notes</p>
                            {p.notes ? (
                              <ul className="list-disc space-y-0.5 pl-4 text-sm text-slate-600 dark:text-slate-300">
                                {p.notes.split("\n").filter(Boolean).map((l, i) => <li key={i}>{l.replace(/^-\s*/, "")}</li>)}
                              </ul>
                            ) : <p className="text-sm text-slate-400">No notes.</p>}
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase text-slate-500">Prescriptions</p>
                            {p.meds?.length ? (
                              <ul className="space-y-0.5 text-sm text-slate-600 dark:text-slate-300">
                                {p.meds.map((m) => <li key={m}>✓ {m}</li>)}
                              </ul>
                            ) : <p className="text-sm text-slate-400">None.</p>}
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-bold uppercase text-slate-500">Attachments</p>
                            <div className="space-y-1">
                              {(p.files || []).map((f) => (
                                <div key={f.id} className="flex items-center gap-2 text-sm">
                                  <a href={f.dataUrl} download={f.name} className="text-teal-600 hover:underline">📎 {f.name}</a>
                                  {!readOnly && <button onClick={() => detach(p.id, f.id)} className="text-xs text-red-500">✕</button>}
                                </div>
                              ))}
                              {!readOnly && (
                                <label className="mt-1 inline-block cursor-pointer text-xs font-semibold text-teal-600">
                                  + Attach X-ray / photo / PDF
                                  <input type="file" multiple hidden accept="image/*,application/pdf"
                                    onChange={(e) => attach(p.id, e.target.files)} />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== Cards view ===== */}
      {view === "cards" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((p) => (
            <div key={p.id} className={card}>
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100">🦷 {p.procedure} {p.tooth && <span className="text-slate-400">({p.tooth})</span>}</h4>
                <Badge ui={STATUS_UI[p.status]} label={p.status} />
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                <p>Priority: <Badge ui={PRIORITY_UI[p.priority]} label={p.priority} /></p>
                <p>Cost: <span className="font-semibold">{inr(p.cost)}</span> · {p.duration || 0} min</p>
                <p>Assigned: {p.dentist || "—"}</p>
                {p.appointment && <p className="text-teal-600">📅 {p.appointment}</p>}
              </div>
              {!readOnly && (
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setStatus(p.id, "Completed")} className={`${btn} bg-green-600 text-white`}>✔ Complete</button>
                  <button onClick={() => startEdit(p)} className={`${btn} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200`}>✏ Edit</button>
                  <button onClick={() => remove(p.id)} className={`${btn} bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300`}>🗑</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== Timeline ===== */}
      {plan.procedures.length > 0 && (
        <div className={card}>
          <h3 className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">📈 Progress Timeline</h3>
          <ol className="relative space-y-4 border-l-2 border-slate-200 pl-6 dark:border-slate-700">
            {plan.procedures.map((p) => (
              <li key={p.id} className="relative">
                <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs dark:bg-slate-900">
                  {p.status === "Completed" ? "✅" : p.status === "In Progress" ? "🔄" : p.status === "Cancelled" ? "❌" : "⏳"}
                </span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {p.procedure} {p.tooth && <span className="text-slate-400">({p.tooth})</span>}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{p.status}{p.date ? ` · ${p.date}` : ""}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ===== Billing ===== */}
      <div className={card}>
        <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">💳 Cost Breakdown & Billing</h3>
        <div className="space-y-1.5 text-sm">
          {plan.procedures.filter((p) => p.status !== "Cancelled").map((p) => (
            <div key={p.id} className="flex justify-between border-b border-dashed border-slate-200 py-1 text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <span>{p.procedure}{p.tooth ? ` (${p.tooth})` : ""}</span>
              <span className="font-medium">{inr(p.cost)}</span>
            </div>
          ))}
        
          <div className="flex justify-between pt-2 text-base font-bold text-slate-800 dark:text-slate-100">
            <span>Total</span><span>{inr(t.total)}</span>
          </div>
          <div className="flex justify-between text-green-600"><span>Paid</span><span>{inr(t.paid)}</span></div>
          <div className="flex justify-between text-red-500"><span>Pending</span><span>{inr(t.pending)}</span></div>
        </div>

        {!readOnly && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input type="number" placeholder="Record payment ₹" value={payAmt}
              onChange={(e) => setPayAmt(e.target.value)} className={`${input} max-w-[180px]`} />
            <button onClick={() => { if (payAmt) { setPlan(addPayment(key, payAmt)); setPayAmt(""); } }}
              className={`${btn} bg-teal-600 px-4 py-2 text-white`}>+ Add Payment</button>
          </div>
        )}

        {plan.payments.length > 0 && (
          <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
            {plan.payments.map((pm) => (
              <div key={pm.id} className="flex items-center gap-2">
                <span>{new Date(pm.date).toLocaleDateString("en-IN")} · {pm.mode} · {inr(pm.amount)}</span>
                {!readOnly && <button onClick={() => setPlan(deletePayment(key, pm.id))} className="text-red-500">✕</button>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD NEW BILLING FEATURE HERE */}
<div className={card}>
  <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">
    🧾 Invoice Details
  </h3>

  <div className="grid gap-3 md:grid-cols-2">
    <input
      className={input}
      placeholder="Invoice Number"
    />

    <input
      className={input}
      placeholder="GST %"
      type="number"
    />

    <select className={input}>
      <option>Cash</option>
      <option>Card</option>
      <option>UPI</option>
      <option>Bank Transfer</option>
    </select>

    <input
      className={input}
      placeholder="Discount ₹"
      type="number"
    />
  </div>
</div>
      {/* ===== Consent + follow-up ===== */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className={card}>
          <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">📝 Patient Consent</h3>
          {plan.consent ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-green-600">☑ Consent uploaded</span>
              <a href={plan.consent.dataUrl} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline">View</a>
            </div>
          ) : <p className="text-sm text-slate-400">☐ No consent on file</p>}
          {!readOnly && (
            <label className="mt-2 inline-block cursor-pointer text-xs font-semibold text-teal-600">
              + Upload consent PDF
              <input type="file" hidden accept="application/pdf,image/*" onChange={(e) => uploadConsent(e.target.files[0])} />
            </label>
          )}
        </div>

        <div className={card}>
        <h3 className="mb-3 flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-200">
  <span>🔔 Follow-up Reminder</span>

  {followUpStatus === "today" && (
    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
      Today
    </span>
  )}

  {followUpStatus === "upcoming" && (
    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
      Upcoming
    </span>
  )}

  {followUpStatus === "overdue" && (
    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
      Overdue
    </span>
  )}
</h3>
          <div className="flex flex-wrap items-center gap-2">
  <input
    type="date"
    disabled={readOnly}
    className={`${input} max-w-[180px]`}
    value={plan.followUp?.date || ""}
    onChange={(e) => {
  setFollowUp({
    date: e.target.value,
    reminderSent: false,
    reminderSentAt: "",
  });
}}
  />

  {!readOnly && plan.followUp?.date && (
    <>
      <button
        onClick={sendReminder}
        className={`${btn} ${
          plan.followUp.reminderSent
            ? "bg-green-100 text-green-700"
            : "bg-teal-600 text-white"
        }`}
      >
        {plan.followUp.reminderSent
          ? "✓ Reminder Sent"
          : "Send Reminder"}
      </button>

      {plan.followUp?.reminderSent && (
        <p className="text-xs text-green-600">
          ✅ Reminder sent on{" "}
          {new Date(plan.followUp.reminderSentAt).toLocaleString("en-IN")}
        </p>
      )}
    </>
  )}
</div>
        </div>
      </div>

      {/* ===== History ===== */}
      {history.length > 0 && (
        <div className={card}>
          <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">🕒 Treatment History</h3>
          {history.map(([year, list]) => (
            <div key={year} className="mb-3">
              <p className="text-xs font-bold text-slate-500">{year}</p>
              <ul className="mt-1 space-y-0.5 text-sm text-slate-600 dark:text-slate-300">
                {list.map((p) => <li key={p.id}>✓ {p.procedure}{p.tooth ? ` (${p.tooth})` : ""}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreatmentPlan;
