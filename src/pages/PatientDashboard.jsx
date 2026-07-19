import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToothChart from "../components/ToothChart";
import ChatBox from "../components/ChatBox";
import StatCard from "../components/StatCard";
import doctorsData from "../data/doctorsData";
import { IconTooth, IconHome, IconMessage, IconFile, IconLogout } from "../components/icons";

const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: IconHome },
  { key: "messages", label: "Messages", icon: IconMessage },
  { key: "report", label: "Report", icon: IconFile },
];

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPatient, setSelectedPatient] = useState("John Doe");

  const getInitialChartFor = (name) => {
    return Array.from({ length: 32 }).reduce((acc, _, i) => {
      const toothNum = i + 1;

      if (name === "John Doe") {
        if (toothNum === 4 || toothNum === 14) acc[toothNum] = 1;
        else if (toothNum === 19 || toothNum === 32) acc[toothNum] = 2;
        else acc[toothNum] = 0;
      } else if (name === "Jane Smith") {
        if (toothNum === 8 || toothNum === 9 || toothNum === 24) acc[toothNum] = 1;
        else if (toothNum === 2 || toothNum === 3) acc[toothNum] = 2;
        else acc[toothNum] = 0;
      } else if (name === "Alex Mercer") {
        if (toothNum === 12) acc[toothNum] = 1;
        else if (toothNum === 5 || toothNum === 18 || toothNum === 30) acc[toothNum] = 2;
        else acc[toothNum] = 0;
      }

      return acc;
    }, {});
  };

  const patientProfiles = {
    "John Doe": { appointment: "June 30 at 10:00 AM", advice: "Avoid cold drinks." },
    "Jane Smith": { appointment: "July 05 at 2:30 PM", advice: "Brush gently." },
    "Alex Mercer": { appointment: "July 12 at 9:15 AM", advice: "Floss daily." },
  };

  const [currentTeethStates, setCurrentTeethStates] = useState(getInitialChartFor("John Doe"));
  const [currentProfile, setCurrentProfile] = useState(patientProfiles["John Doe"]);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorsData[0].name);

  const handlePatientChange = (e) => {
    const next = e.target.value;
    setSelectedPatient(next);
    setCurrentTeethStates(getInitialChartFor(next));
    setCurrentProfile(patientProfiles[next]);
  };

  const healthyCount = Object.values(currentTeethStates).filter((s) => s === 0).length;
  const cavityCount = Object.values(currentTeethStates).filter((s) => s === 1).length;
  const filledCount = Object.values(currentTeethStates).filter((s) => s === 2).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="flex w-64 flex-col bg-teal-800 p-4 text-white">
        <div className="mb-8 flex items-center gap-2 px-2 pt-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
            <IconTooth className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Dental Club</h2>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                activeTab === key ? "bg-white/15 text-white" : "text-teal-100 hover:bg-white/10"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-lg bg-rose-500/90 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-rose-500"
        >
          <IconLogout className="h-4 w-4" /> Logout
        </button>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 space-y-6 p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-teal-700 to-cyan-600 p-6 text-white sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold">Welcome, {selectedPatient}</h1>
                <p className="mt-1 text-sm text-white/80">Here's a look at your dental record</p>
              </div>
              <select
                value={selectedPatient}
                onChange={handlePatientChange}
                className="w-fit rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/50 [&>option]:text-slate-800"
              >
                <option>John Doe</option>
                <option>Jane Smith</option>
                <option>Alex Mercer</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Healthy" value={healthyCount} tone="emerald" />
              <StatCard label="Cavities" value={cavityCount} tone="rose" />
              <StatCard label="Filled" value={filledCount} tone="sky" />
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-1 font-bold text-slate-800">Your Tooth Chart</h3>
              <p className="mb-4 text-sm text-slate-500">
                Recorded by your dentist at your last visit — read only
              </p>
              <ToothChart
                teethStates={currentTeethStates}
                onToothClick={() => null}
                interactive={false}
              />
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium text-slate-500">Chatting with</span>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {doctorsData.map((doc) => (
                    <option key={doc.name} value={doc.name}>
                      {doc.name} — {doc.specialization}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <ChatBox doctorName={selectedDoctor} patientName={selectedPatient} role="Patient" />
          </div>
        )}

        {activeTab === "report" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Clinical Report — {selectedPatient}</h1>

            <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Patient</span>
                <span className="text-sm font-semibold text-slate-800">{selectedPatient}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Healthy teeth</span>
                <span className="text-sm font-semibold text-slate-800">{healthyCount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Cavities</span>
                <span className="text-sm font-semibold text-slate-800">{cavityCount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Filled teeth</span>
                <span className="text-sm font-semibold text-slate-800">{filledCount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-500">Next appointment</span>
                <span className="text-sm font-semibold text-teal-700">{currentProfile.appointment}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-sm text-slate-500">Dentist's advice</span>
                <span className="text-sm font-semibold text-slate-800">{currentProfile.advice}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;