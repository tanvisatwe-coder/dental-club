import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Phone, MapPin, Clock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { saveInquiry } from "../data/contactStore";

const services = [
  "Teeth Cleaning",
  "Braces & Aligners",
  "Root Canal",
  "Teeth Whitening",
  "Dental Implants",
  "Kids Dentistry",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emptyForm = { name: "", email: "", message: "" };

export default function Landing() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please tell us your name.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.message.trim()) next.message = "Please add a short message.";
    else if (form.message.trim().length < 10) next.message = "Message should be at least 10 characters.";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      saveInquiry(form);
      setIsSubmitting(false);
      setSubmitted(true);
      setForm(emptyForm);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 text-xl font-bold text-cyan-700">
            <span className="text-2xl" aria-hidden="true">🦷</span> DentalClub
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex" aria-label="Page sections">
            <a href="#services" className="transition-colors hover:text-cyan-700">Services</a>
            <a href="#contact" className="transition-colors hover:text-cyan-700">Contact</a>
          </nav>

          <div className="flex gap-3">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-cyan-700">
              Login
            </Link>
            <Link to="/appointment" className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700">
              Book Appointment
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-50 to-white px-4 py-16">
        <div className="mx-auto max-w-6xl text-center md:grid md:grid-cols-2 md:items-center md:gap-10 md:text-left">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
              Your smile deserves expert care
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Modern dentistry with online booking, digital records, and a patient portal.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link to="/appointment" className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-cyan-700">
                Book Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/login" className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                Patient Portal
              </Link>
            </div>
          </div>
          <div className="mt-10 animate-fade-in rounded-3xl bg-gradient-to-br from-cyan-600 to-teal-500 p-8 text-white shadow-xl md:mt-0">
            <p className="text-sm opacity-90">Next available slot</p>
            <p className="mt-2 text-3xl font-bold">Today, 4:30 PM</p>
            <p className="mt-4 flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" aria-hidden="true" /> Easy online booking
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Our Services</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s} className="rounded-2xl border border-slate-200 p-6 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="font-bold text-slate-800">{s}</h3>
              <p className="mt-2 text-sm text-slate-500">Professional care tailored to your needs.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16">
        <h2 className="text-center text-3xl font-bold">Get in Touch</h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Questions about a treatment or your appointment? Send us a message.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 p-6 shadow-sm sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden="true" />
              <p className="mt-3 font-semibold text-slate-800">Thanks — your message has been sent!</p>
              <p className="mt-1 text-sm text-slate-500">Our team will get back to you soon.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-sm font-medium text-cyan-700 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  className={`w-full rounded-xl border px-4 py-2.5 outline-none transition-colors focus:border-cyan-500 ${
                    errors.name ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.name && <p id="contact-name-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  className={`w-full rounded-xl border px-4 py-2.5 outline-none transition-colors focus:border-cyan-500 ${
                    errors.email ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.email && <p id="contact-email-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1 block text-sm font-medium">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="How can we help?"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className={`w-full resize-none rounded-xl border px-4 py-2.5 outline-none transition-colors focus:border-cyan-500 ${
                    errors.message ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {errors.message && <p id="contact-message-error" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Contact footer */}
      <footer className="bg-cyan-800 py-12 text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          <div className="flex gap-3">
            <MapPin className="h-5 w-5" aria-hidden="true" /><span>123 Smile Street, Dental City</span>
          </div>
          <div className="flex gap-3">
            <Phone className="h-5 w-5" aria-hidden="true" /><span>+91 98765 43210</span>
          </div>
          <div className="flex gap-3">
            <Clock className="h-5 w-5" aria-hidden="true" /><span>Mon–Sat: 9 AM – 7 PM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}