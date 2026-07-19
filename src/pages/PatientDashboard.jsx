import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ToothChart from "../components/ToothChart";
import ChatBox from "../components/ChatBox";
import StatCard from "../components/StatCard";
import doctorsData from "../data/doctorsData";
import Dropdown from "../components/Dropdown";
import { getUnreadCount } from "../data/chatStore";

const SECTION_LABELS = {
  overview: "Overview",
  messages: "Secure Chat",
  report: "Reports",
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPatient, setSelectedPatient] = useState("John Doe");
  const [selectedDoctor, setSelectedDoctor] = useState(doctorsData[0].name);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const recalc = () => {
      const total = doctorsData.reduce(
        (sum, doc) => sum + getUnreadCount(doc.name, selectedPatient, "Patient"),
        0
      );
      setUnreadCount(total);
    };
    recalc();
    window.addEventListener("storage", recalc);
    return () => window.removeEventListener("storage", recalc);
  }, [selectedPatient, activeTab]);

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

  const handlePatientChange = (next) => {
    setSelectedPatient(next);
    setCurrentTeethStates(getInitialChartFor(next));
    setCurrentProfile(patientProfiles[next]);
  };

  const healthyCount = Object.values(currentTeethStates).filter((s) => s === 0).length;
  const cavityCount = Object.values(currentTeethStates).filter((s) => s === 1).length;
  const filledCount = Object.values(currentTeethStates).filter((s) => s === 2).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role="Patient"
        navigate={navigate}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar
          section={SECTION_LABELS[activeTab] || "Overview"}
          role="Patient"
          userName={selectedPatient}
          notifications={unreadCount}
        />

        <main className="flex-1 space-y-6 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div>
                  <h1 className="text-lg font-bold text-slate-800">Welcome, {selectedPatient}</h1>
                  <p className="text-sm text-slate-500">Here's a look at your dental record</p>
                </div>
                <Dropdown
                  value={selectedPatient}
                  onChange={handlePatientChange}
                  colorClass="bg-gradient-to-br from-brand-500 to-brand-700"
                  options={Object.keys(patientProfiles).map((name) => ({
                    value: name,
                    label: name,
                    initials: name.split(" ").map((w) => w[0]).join(""),
                    sublabel: patientProfiles[name].appointment,
                  }))}
                />
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
                <Dropdown
                  label="Chatting with"
                  value={selectedDoctor}
                  onChange={setSelectedDoctor}
                  colorClass="bg-slate-700"
                  options={doctorsData.map((doc) => ({
                    value: doc.name,
                    label: doc.name,
                    initials: doc.name.replace(/^Dr\.?\s*/i, "").split(" ").map((w) => w[0]).join(""),
                    sublabel: doc.specialization,
                  }))}
                />
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
                  <span className="text-sm font-semibold text-brand-700">{currentProfile.appointment}</span>
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
    </div>
  );
};

export default PatientDashboard;