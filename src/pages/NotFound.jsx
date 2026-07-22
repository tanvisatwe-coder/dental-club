import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <span className="text-6xl" aria-hidden="true">🦷</span>
      <h1 className="mt-6 text-6xl font-bold text-cyan-700">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-slate-800">This page took a day off</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        We couldn't find the page you're looking for. It may have been moved, or the link might be off by a tooth.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
        >
          <Home className="h-4 w-4" aria-hidden="true" /> Back to home
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Go to login
        </Link>
      </div>
    </div>
  );
}