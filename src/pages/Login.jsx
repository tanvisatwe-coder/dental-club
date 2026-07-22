import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address.";

    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Password must be at least 6 characters.";

    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    // Simulated auth check — this is a demo without a backend, so any
    // correctly-formatted email/password combination is accepted.
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(role === "dentist" ? "/dentist" : "/patient");
    }, 500);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-cyan-600 to-teal-500 p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <span className="text-5xl" aria-hidden="true">🦷</span>
        <h1 className="mt-6 text-4xl font-bold">DentalClub</h1>
        <p className="mt-4 max-w-md text-lg text-white/90">
          {role === "dentist"
            ? "Staff portal for patient records and dental charts."
            : "Patient portal to view your dental health and reports."}
        </p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to home
        </Link>

        <h2 className="text-2xl font-bold text-slate-900">
          {role === "dentist" ? "Staff / Dentist Login" : "Patient Portal Login"}
        </h2>
        <p className="mt-2 text-sm text-slate-500">Demo: any valid-format email &amp; a 6+ character password will work.</p>

        {/* Role toggle */}
        <div className="mt-6 flex gap-2" role="tablist" aria-label="Login as">
          <button
            type="button"
            role="tab"
            aria-selected={role === "patient"}
            onClick={() => setRole("patient")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${role === "patient" ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            Patient
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "dentist"}
            onClick={() => setRole("dentist")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${role === "dentist" ? "bg-cyan-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            Staff / Dentist
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "login-email-error" : undefined}
                className={`w-full rounded-xl border py-3 pl-10 pr-4 outline-none transition-colors focus:border-cyan-500 ${
                  errors.email ? "border-rose-400" : "border-slate-200"
                }`}
              />
            </div>
            {errors.email && (
              <p id="login-email-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                className={`w-full rounded-xl border py-3 pl-10 pr-4 outline-none transition-colors focus:border-cyan-500 ${
                  errors.password ? "border-rose-400" : "border-slate-200"
                }`}
              />
            </div>
            {errors.password && (
              <p id="login-password-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
                {errors.password}
              </p>
            )}
          </div>

          {formError && (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}