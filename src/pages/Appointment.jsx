import { useState } from "react";
import { Link } from "react-router-dom";
import { IconTooth, IconAlert } from "../components/icons";
import { saveBooking } from "../data/appointmentsStore";

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

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
];

const REASONS = [
  "Routine check-up",
  "Teeth cleaning",
  "Tooth pain",
  "Braces / aligners consultation",
  "Teeth whitening",
  "Follow-up visit",
  "Other",
];

const todayStr = () => new Date().toISOString().split("T")[0];

function SymptomCheck() {
  const [form, setForm] = useState({ pain: "", bleeding: "", swelling: "", sensitivity: "" });
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="font-bold text-slate-800">Quick Symptom Check</h2>
      <p className="mt-1 text-sm text-slate-500">Optional — helps you gauge urgency before booking</p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
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
          className="mt-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
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
  );
}

function BookingForm() {
  const emptyForm = { name: "", phone: "", date: "", time: "", reason: "" };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.phone.trim()) next.phone = "Please enter a phone number.";
    if (!form.date) next.date = "Please pick a date.";
    else if (form.date < todayStr()) next.date = "Date can't be in the past.";
    if (!form.time) next.time = "Please pick a time slot.";
    if (!form.reason) next.reason = "Please select a reason for your visit.";
    return next;
  };

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      await saveBooking(form);
      setConfirmed(form);
      setForm(emptyForm);
    } catch (err) {
      setSubmitError("Something went wrong saving your booking. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 text-center shadow-sm">
        <p className="font-bold text-emerald-700">Appointment requested!</p>
        <p className="mt-1 text-sm text-emerald-700/80">
          {confirmed.date} at {confirmed.time} — {confirmed.reason}
        </p>
        <p className="mt-2 text-xs text-emerald-700/70">
          Our team will confirm your slot shortly. You can also track this from the patient portal.
        </p>
        <button
          onClick={() => setConfirmed(null)}
          className="mt-4 text-sm font-medium text-emerald-700 hover:underline"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="font-bold text-slate-800">Book Your Appointment</h2>
      <p className="mt-1 text-sm text-slate-500">Pick a date and time that works for you</p>

      <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Full name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${errors.name ? "border-rose-400" : "border-slate-200"}`}
          />
          {errors.name && <p role="alert" className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Phone number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. 9876543210"
            aria-invalid={!!errors.phone}
            className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${errors.phone ? "border-rose-400" : "border-slate-200"}`}
          />
          {errors.phone && <p role="alert" className="mt-1 text-xs font-medium text-rose-600">{errors.phone}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Date</label>
            <input
              type="date"
              name="date"
              min={todayStr()}
              value={form.date}
              onChange={handleChange}
              aria-invalid={!!errors.date}
              className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${errors.date ? "border-rose-400" : "border-slate-200"}`}
            />
            {errors.date && <p role="alert" className="mt-1 text-xs font-medium text-rose-600">{errors.date}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">Time</label>
            <select
              name="time"
              value={form.time}
              onChange={handleChange}
              aria-invalid={!!errors.time}
              className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${errors.time ? "border-rose-400" : "border-slate-200"}`}
            >
              <option value="">Select</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.time && <p role="alert" className="mt-1 text-xs font-medium text-rose-600">{errors.time}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-500">Reason for visit</label>
          <select
            name="reason"
            value={form.reason}
            onChange={handleChange}
            aria-invalid={!!errors.reason}
            className={`w-full rounded-lg border p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 ${errors.reason ? "border-rose-400" : "border-slate-200"}`}
          >
            <option value="">Select a reason</option>
            {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.reason && <p role="alert" className="mt-1 text-xs font-medium text-rose-600">{errors.reason}</p>}
        </div>

        {submitError && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Booking..." : "Request Appointment"}
        </button>
      </form>
    </div>
  );
}

export default function Appointment() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
            <IconTooth className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Book an Appointment</h1>
            <p className="text-sm text-slate-500">Schedule a visit, and check your symptoms if you'd like</p>
          </div>
        </div>

        <div className="space-y-6">
          <BookingForm />
          <SymptomCheck />
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}