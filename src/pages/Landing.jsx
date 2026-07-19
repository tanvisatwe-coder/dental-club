import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Phone, MapPin, Clock, ArrowRight } from "lucide-react";

const services = [
  "Teeth Cleaning",
  "Braces & Aligners",
  "Root Canal",
  "Teeth Whitening",
  "Dental Implants",
  "Kids Dentistry",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 text-xl font-bold text-cyan-700">
            <span className="text-2xl">🦷</span> DentalClub
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:text-cyan-700">
              Login
            </Link>
            <Link to="/appointment" className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700">
              Book Appointment
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-50 to-white px-4 py-16">
        <div className="mx-auto max-w-6xl text-center md:text-left md:grid md:grid-cols-2 md:items-center md:gap-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
              Your smile deserves expert care
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Modern dentistry with online booking, digital records, and a patient portal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link to="/appointment" className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700">
                Book Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
                Patient Portal
              </Link>
            </div>
          </div>
          <div className="mt-10 rounded-3xl bg-gradient-to-br from-cyan-600 to-teal-500 p-8 text-white shadow-xl md:mt-0">
            <p className="text-sm opacity-90">Next available slot</p>
            <p className="mt-2 text-3xl font-bold">Today, 4:30 PM</p>
            <p className="mt-4 flex items-center gap-2 text-sm"><Calendar className="h-4 w-4" /> Easy online booking</p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Our Services</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s} className="rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md">
              <h3 className="font-bold text-slate-800">{s}</h3>
              <p className="mt-2 text-sm text-slate-500">Professional care tailored to your needs.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact footer */}
      <footer className="bg-cyan-800 py-12 text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          <div className="flex gap-3"><MapPin className="h-5 w-5" /><span>123 Smile Street, Dental City</span></div>
          <div className="flex gap-3"><Phone className="h-5 w-5" /><span>+91 98765 43210</span></div>
          <div className="flex gap-3"><Clock className="h-5 w-5" /><span>Mon–Sat: 9 AM – 7 PM</span></div>
        </div>
      </footer>
    </div>
  );
}