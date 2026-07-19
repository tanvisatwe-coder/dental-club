import { useState } from "react";
import { Link } from "react-router-dom";
import { IconTooth, IconAlert } from "../components/icons";

const RISK_META = {
  severe: {
    label: "Severe",
    hint: "Visit your dentist as soon as possible",
    styles: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  moderate: {
    label: "Moderate",
    hint: "Needs attention within the next few days",
    styles: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  mild: {
    label: "Mild",
    hint: "Basic home care should be enough for now",
    styles: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
};

const FIELD_OPTIONS = [
  { name: "bleeding", label: "Bleeding" },
  { name: "swelling", label: "Swelling" },
  { name: "sensitivity", label: "Sensitivity" },
];

export default function Appointment() {
  const [form, setForm] = useState({
    pain: "",
    bleeding: "",
    swelling: "",
    sensitivity: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateRisk = () => {
    let score = 0;
    const pain = Number(form.pain) || 0;

    if (pain >= 7) score += 3;
    else if (pain >= 4) score += 2;
    else score += 1;

    if (form.bleeding === "yes") score += 2;
    if (form.swelling === "yes") score += 2;
    if (form.sensitivity === "yes") score += 1;

    if (score >= 7) return "severe";
    if (score >= 4) return "moderate";
    return "mild";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(calculateRisk());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
            <IconTooth className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Quick Symptom Check</h1>
            <p className="text-sm text-slate-500">Answer a few questions to gauge urgency</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Pain level (0 = none, 10 = severe)
              </label>
              <input
                type="number"
                name="pain"
                min={0}
                max={10}
                placeholder="e.g. 5"
                value={form.pain}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {FIELD_OPTIONS.map(({ name, label }) => (
              <div key={name}>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">{label}?</label>
                <select
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select an answer</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            ))}

            <button
              type="submit"
              className="mt-2 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              Check my risk level
            </button>
          </form>

          {result && (
            <div className={`mt-5 flex items-start gap-3 rounded-xl p-4 ring-1 ${RISK_META[result].styles}`}>
              <IconAlert className="mt-0.5 h-5 w-5 shrink-0" />
              <div>
                <p className="text-sm font-bold">{RISK_META[result].label} risk</p>
                <p className="text-xs opacity-90">{RISK_META[result].hint}</p>
              </div>
            </div>
          )}
        </div>

        <Link
          to="/"
          className="mt-5 block text-center text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}