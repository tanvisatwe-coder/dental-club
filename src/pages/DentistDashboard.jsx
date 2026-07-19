import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import Sidebar from "../components/Sidebar";
import ToothChart from "../components/ToothChart";
import ChatBox from "../components/ChatBox";
import DentalPieChart from "../components/DentalPieChart";
import StatCard from "../components/StatCard";
import doctorsData from "../data/doctorsData";
import { STATUS } from "../data/toothMeta";
import {
  IconCalendar,
  IconFile,
  IconMessage,
  IconUsers,
  IconLogout,
  IconDroplet,
  IconSave,
  IconDownload,
} from "../components/icons";

const RISK_STYLES = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  High: "bg-rose-50 text-rose-700 ring-rose-200",
};

const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

const DentistDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState("John Doe");
  // Simulates which doctor account is currently logged in, since there's no
  // real multi-account auth yet. This name must match what the patient picks
  // in their "Chatting with" dropdown for a thread to line up.
  const [loggedInDoctor, setLoggedInDoctor] = useState(doctorsData[0].name);

  const createDefaultChart = () => {
    return Array.from({ length: 32 }).reduce((acc, _, i) => {
      acc[i + 1] = 0;
      return acc;
    }, {});
  };

  const [patientDatabase, setPatientDatabase] = useState({
    "John Doe": { teeth: createDefaultChart(), bleeding: {} },
    "Jane Smith": { teeth: createDefaultChart(), bleeding: {} },
    "Alex Mercer": { teeth: createDefaultChart(), bleeding: {} },
  });

  const [currentTeethStates, setCurrentTeethStates] = useState(createDefaultChart());
  const [bleedingMap, setBleedingMap] = useState({});
  const [selectedTooth, setSelectedTooth] = useState(null);

  const [patientProfiles] = useState({
    "John Doe": {
      age: 24,
      gender: "Male",
      bloodGroup: "O+",
      phone: "9876543210",
      appointment: "25 June 2025 - 10:00 AM",
    },
    "Jane Smith": {
      age: 30,
      gender: "Female",
      bloodGroup: "A+",
      phone: "9876543211",
      appointment: "26 June 2025 - 02:00 PM",
    },
    "Alex Mercer": {
      age: 27,
      gender: "Male",
      bloodGroup: "B+",
      phone: "9876543212",
      appointment: "28 June 2025 - 11:30 AM",
    },
  });

  const [selectedMode, setSelectedMode] = useState("cavity");

  const handleToothClick = (toothNum) => {
    setSelectedTooth(toothNum);
    setCurrentTeethStates((prev) => ({
      ...prev,
      [toothNum]: selectedMode === "healthy" ? 0 : selectedMode === "cavity" ? 1 : 2,
    }));
  };

  const handleBleedingChange = (value) => {
    if (!selectedTooth) return;
    setBleedingMap((prev) => ({ ...prev, [selectedTooth]: value }));
  };

  const handlePatientChange = (e) => {
    const next = e.target.value;
    setSelectedPatient(next);
    setCurrentTeethStates(patientDatabase[next]?.teeth || createDefaultChart());
    setBleedingMap(patientDatabase[next]?.bleeding || {});
    setSelectedTooth(null);
  };

  const healthyCount = Object.values(currentTeethStates).filter((s) => s === 0).length;
  const cavityCount = Object.values(currentTeethStates).filter((s) => s === 1).length;
  const filledCount = Object.values(currentTeethStates).filter((s) => s === 2).length;
  const totalBleeding = Object.values(bleedingMap).reduce((a, b) => a + b, 0);

  let risk = "Low";
  if (totalBleeding > 25 || cavityCount > 6) risk = "High";
  else if (totalBleeding > 10 || cavityCount > 3) risk = "Medium";

  const generateReport = () => {
    const doc = new jsPDF();
    const profile = patientProfiles[selectedPatient];

    doc.setFillColor(8, 145, 178);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Dental Clinical Report", 20, 20);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(15);
    doc.text("Patient Information", 20, 45);
    doc.setFontSize(12);
    doc.text(`Patient: ${selectedPatient}`, 20, 60);
    doc.text(`Age: ${profile.age}`, 20, 70);
    doc.text(`Gender: ${profile.gender}`, 20, 80);
    doc.text(`Blood Group: ${profile.bloodGroup}`, 20, 90);
    doc.text(`Phone: ${profile.phone}`, 20, 100);

    doc.setFontSize(15);
    doc.text("Dental Summary", 20, 125);
    doc.setFontSize(12);
    doc.text(`Healthy Teeth: ${healthyCount}`, 20, 140);
    doc.text(`Cavities: ${cavityCount}`, 20, 150);
    doc.text(`Filled Teeth: ${filledCount}`, 20, 160);

    doc.setFontSize(15);
    doc.text("Clinical Assessment", 20, 185);
    doc.setFontSize(12);
    doc.text(`Bleeding Score: ${totalBleeding}`, 20, 200);
    doc.text(`Risk Level: ${risk}`, 20, 210);

    doc.setFontSize(15);
    doc.text("Appointment", 20, 235);
    doc.setFontSize(12);
    doc.text(`${profile.appointment}`, 20, 250);

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Generated by DentalClub Management System", 20, 285);

    doc.save(`${selectedPatient}_report.pdf`);
    toast.success("PDF report downloaded!");
  };

  const handleSaveChanges = () => {
    setPatientDatabase((prev) => ({
      ...prev,
      [selectedPatient]: { teeth: currentTeethStates, bleeding: bleedingMap },
    }));
    toast.success("Changes saved successfully!");
  };

  const profile = patientProfiles[selectedPatient];
  const allPatients = Object.keys(patientProfiles);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role="Dentist"
        navigate={navigate}
      />

      <main className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 p-6 text-white sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Dentist Dashboard</h1>
            <p className="mt-1 text-sm text-white/80">Review charts, log findings, and generate reports</p>
          </div>
          <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/30">
            {profile.appointment}
          </span>
        </div>

        {/* Patient + doctor identity selector row */}
        <Card className="flex flex-wrap items-center justify-between gap-3 !p-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-500">Patient</span>
              <select
                value={selectedPatient}
                onChange={handlePatientChange}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option>John Doe</option>
                <option>Jane Smith</option>
                <option>Alex Mercer</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium text-slate-500">Logged in as</span>
              <select
                value={loggedInDoctor}
                onChange={(e) => setLoggedInDoctor(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {doctorsData.map((doc) => (
                  <option key={doc.name} value={doc.name}>{doc.name}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-600"
          >
            <IconLogout className="h-4 w-4" /> Logout
          </button>
        </Card>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard icon={IconCalendar} label="Today's Appointments" value={4} tone="teal" />
              <StatCard icon={IconFile} label="Pending Reports" value={2} tone="amber" />
              <StatCard icon={IconMessage} label="New Messages" value={3} tone="sky" />
              <StatCard icon={IconUsers} label="Patients This Week" value={18} tone="emerald" />
            </div>

            <Card>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-800">Patient Profile</h2>
                  <dl className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm text-slate-600 sm:grid-cols-4">
                    <div><dt className="text-xs text-slate-400">Age</dt><dd>{profile.age}</dd></div>
                    <div><dt className="text-xs text-slate-400">Gender</dt><dd>{profile.gender}</dd></div>
                    <div><dt className="text-xs text-slate-400">Blood</dt><dd>{profile.bloodGroup}</dd></div>
                    <div><dt className="text-xs text-slate-400">Phone</dt><dd>{profile.phone}</dd></div>
                  </dl>
                  <p className="mt-3 text-sm font-medium text-teal-700">Next visit: {profile.appointment}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${RISK_STYLES[risk]}`}>
                  {risk} risk
                </span>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Healthy" value={healthyCount} tone="emerald" />
              <StatCard label="Cavities" value={cavityCount} tone="rose" />
              <StatCard label="Filled" value={filledCount} tone="sky" />
            </div>
          </>
        )}

        {activeTab === "patients" && (
          <Card>
            <h2 className="mb-4 font-bold text-slate-800">All Patients</h2>
            <div className="divide-y divide-slate-100">
              {allPatients.map((name) => {
                const p = patientProfiles[name];
                return (
                  <button
                    key={name}
                    onClick={() => {
                      setSelectedPatient(name);
                      setCurrentTeethStates(patientDatabase[name]?.teeth || createDefaultChart());
                      setBleedingMap(patientDatabase[name]?.bleeding || {});
                      setSelectedTooth(null);
                      setActiveTab("dentalChart");
                    }}
                    className="flex w-full items-center justify-between gap-4 py-3 text-left transition-colors hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{name}</p>
                      <p className="text-xs text-slate-400">
                        {p.age} yrs · {p.gender} · {p.bloodGroup}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-teal-700">{p.appointment}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {activeTab === "appointments" && (
          <Card>
            <h2 className="mb-4 font-bold text-slate-800">Upcoming Appointments</h2>
            <div className="divide-y divide-slate-100">
              {allPatients.map((name) => {
                const p = patientProfiles[name];
                return (
                  <div key={name} className="flex items-center justify-between gap-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                        <IconCalendar className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800">{name}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{p.appointment}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {activeTab === "chats" && (
          <ChatBox doctorName={loggedInDoctor} patientName={selectedPatient} role="Dentist" />
        )}

        {activeTab === "dentalChart" && (
          <div className="space-y-6">
            <Card className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Dental Chart — {selectedPatient}</h2>
                <p className="text-sm text-slate-500">Click a tooth, then pick a condition to log it</p>
              </div>

              {/* Segmented mode control */}
              <div className="flex rounded-xl bg-slate-100 p-1">
                {[0, 1, 2].map((s) => {
                  const key = s === 0 ? "healthy" : s === 1 ? "cavity" : "filled";
                  const active = selectedMode === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedMode(key)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        active ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <span
                        className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                        style={{ background: STATUS[s].fill }}
                      />
                      {STATUS[s].label}
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <ToothChart
                  teethStates={currentTeethStates}
                  onToothClick={handleToothClick}
                  selectedTooth={selectedTooth}
                  bleedingMap={bleedingMap}
                />
              </Card>

              <div className="space-y-6">
                <Card>
                  <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
                    <IconDroplet className="h-4 w-4 text-rose-500" /> Bleeding on probing
                  </h3>
                  {selectedTooth ? (
                    <>
                      <p className="mb-2 text-xs text-slate-400">Tooth {selectedTooth}</p>
                      <select
                        value={bleedingMap[selectedTooth] || 0}
                        onChange={(e) => handleBleedingChange(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {[0, 1, 2, 3, 4, 5].map((v) => (
                          <option key={v} value={v}>{v === 0 ? "0 — none" : v}</option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <p className="text-sm text-slate-400">Select a tooth to log bleeding</p>
                  )}
                </Card>

                <Card>
                  <DentalPieChart healthy={healthyCount} cavity={cavityCount} filled={filledCount} />
                </Card>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    <IconSave className="h-4 w-4" /> Save Changes
                  </button>
                  <button
                    onClick={generateReport}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    <IconDownload className="h-4 w-4" /> Download Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Clinical Report</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${RISK_STYLES[risk]}`}>
                {risk} risk
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div><dt className="text-xs text-slate-400">Healthy</dt><dd className="text-lg font-bold text-slate-800">{healthyCount}</dd></div>
              <div><dt className="text-xs text-slate-400">Cavities</dt><dd className="text-lg font-bold text-slate-800">{cavityCount}</dd></div>
              <div><dt className="text-xs text-slate-400">Filled</dt><dd className="text-lg font-bold text-slate-800">{filledCount}</dd></div>
              <div><dt className="text-xs text-slate-400">Bleeding score</dt><dd className="text-lg font-bold text-slate-800">{totalBleeding}</dd></div>
            </dl>
            <p className="mt-4 text-sm text-slate-500">Appointment: <span className="font-medium text-slate-700">{profile.appointment}</span></p>

            <button
              onClick={generateReport}
              className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <IconDownload className="h-4 w-4" /> Download PDF Report
            </button>
          </Card>
        )}
      </main>
    </div>
  );
};

export default DentistDashboard;