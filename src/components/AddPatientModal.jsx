import React, { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  age: "",
  gender: "Male",
  bloodGroup: "",
  phone: "",
  appointment: "",
  note: "New patient",
  advice: "",
};

/**
 * AddPatientModal
 * props:
 *  - mode: "add" | "edit"
 *  - initialData: { name, age, gender, bloodGroup, phone, appointment, note, advice }
 *    (required when mode === "edit")
 *  - onSubmit: (profile) => void
 */
const AddPatientModal = ({ open, onClose, onSubmit, mode = "add", initialData = null }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(mode === "edit" && initialData ? { ...emptyForm, ...initialData } : emptyForm);
      setError("");
    }
  }, [open, mode, initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.age) {
      setError("Name and age are required.");
      return;
    }
    onSubmit({
      name: form.name.trim(),
      age: Number(form.age),
      gender: form.gender,
      bloodGroup: form.bloodGroup.trim() || "—",
      phone: form.phone.trim() || "—",
      appointment: form.appointment.trim() || "Not scheduled",
      note: form.note.trim() || "New patient",
      advice: form.advice.trim() || "General oral hygiene care.",
    });
  };

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {isEdit ? `Edit ${initialData?.name || "Patient"}` : "Add Patient"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Full name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isEdit}
              placeholder="e.g. Priya Patel"
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-50 disabled:text-slate-400"
            />
            {isEdit && (
              <p className="mt-1 text-[11px] text-slate-400">
                Name can't be changed here — it's linked to this patient's chart and message history.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Age *</label>
              <input
                name="age"
                type="number"
                min={0}
                max={120}
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 9"
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Blood group</label>
              <input
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={handleChange}
                placeholder="e.g. O+"
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Next appointment</label>
            <input
              name="appointment"
              value={form.appointment}
              onChange={handleChange}
              placeholder="e.g. 2 August 2026 - 11:00 AM"
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Note / reason for visit</label>
            <input
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="e.g. Routine check-up"
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Advice for patient</label>
            <input
              name="advice"
              value={form.advice}
              onChange={handleChange}
              placeholder="e.g. Avoid cold drinks"
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {isEdit ? "Save Changes" : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;