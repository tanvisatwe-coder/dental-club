import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(role === "dentist" ? "/dentist" : "/patient");
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-gradient-to-br from-cyan-600 to-teal-500 p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <span className="text-5xl">🦷</span>
        <h1 className="mt-6 text-4xl font-bold">DentalClub</h1>
        <p className="mt-4 max-w-md text-lg text-white/90">
          {role === "dentist"
            ? "Staff portal for patient records and dental charts."
            : "Patient portal to view your dental health and reports."}
        </p>
      </div>

      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <h2 className="text-2xl font-bold text-slate-900">
          {role === "dentist" ? "Staff / Dentist Login" : "Patient Portal Login"}
        </h2>
        <p className="mt-2 text-sm text-slate-500">Demo: enter any email & password, then Login.</p>

        {/* Role toggle */}
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setRole("patient")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${role === "patient" ? "bg-cyan-600 text-white" : "bg-slate-100"}`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => setRole("dentist")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${role === "dentist" ? "bg-cyan-600 text-white" : "bg-slate-100"}`}
          >
            Staff / Dentist
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border py-3 pl-10 pr-4 outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border py-3 pl-10 pr-4 outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <button type="submit" className="w-full rounded-xl bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}