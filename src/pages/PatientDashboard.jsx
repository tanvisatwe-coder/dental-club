import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ToothChart from "../components/ToothChart";
import ChatBox from "../components/ChatBox";
import StatCard from "../components/StatCard";
import Dropdown from "../components/Dropdown";
import doctorsData from "../data/doctorsData";
import { getUnreadCount } from "../data/chatStore";
import { loadChart, chartKeyFor } from "../data/chartStore";
import { loadPatients, patientsStorageKey } from "../data/patientsStore";
import { loadReports, reportsKeyFor } from "../data/reportsStore";

const SECTION_LABELS = {
  overview: "Overview",
  messages: "Secure Chat",
  report: "Reports",
};

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorsData[0].name);

  // Shared patient roster — same source the dentist adds patients to
  const [patientProfiles, setPatientProfiles] = useState(() => loadPatients());
  const allPatients = Object.keys(patientProfiles);
  const [selectedPatient, setSelectedPatient] = useState(allPatients[0] || "");

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === patientsStorageKey) setPatientProfiles(loadPatients());
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const [currentTeethStates, setCurrentTeethStates] = useState(() => loadChart(selectedPatient).teeth);
  const [bleedingMap, setBleedingMap] = useState(() => loadChart(selectedPatient).bleeding);
  const [lastUpdated, setLastUpdated] = useState(() => loadChart(selectedPatient).updatedAt);
  const [unreadCount, setUnreadCount] = useState(0);

  const handlePatientChange = (next) => {
    setSelectedPatient(next);
    const chart = loadChart(next);
    setCurrentTeethStates(chart.teeth);
    setBleedingMap(chart.bleeding);
    setLastUpdated(chart.updatedAt);
  };

  // Live-refresh the chart if the dentist saves changes while this patient
  // has their Overview tab open in another browser tab.
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === chartKeyFor(selectedPatient)) {
        const chart = loadChart(selectedPatient);
        setCurrentTeethStates(chart.teeth);
        setBleedingMap(chart.bleeding);
        setLastUpdated(chart.updatedAt);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [selectedPatient]);

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

  const healthyCount = Object.values(currentTeethStates).filter((s) => s === 0).length;
  const cavityCount = Object.values(currentTeethStates).filter((s) => s === 1).length;
  const filledCount = Object.values(currentTeethStates).filter((s) => s === 2).length;
  const missingCount = Object.values(currentTeethStates).filter((s) => s === 3).length;

  const currentProfile = patientProfiles[selectedPatient] || {};
  const [sentReports, setSentReports] = useState(() => loadReports(selectedPatient));

  useEffect(() => {
    setSentReports(loadReports(selectedPatient));
  }, [selectedPatient]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === reportsKeyFor(selectedPatient)) {
        setSentReports(loadReports(selectedPatient));
        toast.success("Your dentist sent you a new report!");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [selectedPatient]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role="Patient"
        navigate={navigate}
        switchRoute="/dentist"
        switchLabel="Switch to Dentist View"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar
          section={SECTION_LABELS[activeTab] || "Overview"}
          role="Patient"
          userName={selectedPatient || "Patient"}
          notifications={unreadCount}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 space-y-6 p-6">
          {activeTab === "overview" && allPatients.length > 0 && (
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
                  options={allPatients.map((name) => ({
                    value: name,
                    label: name,
                    initials: name.split(" ").map((w) => w[0]).join(""),
                    sublabel: patientProfiles[name].appointment,
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Healthy" value={healthyCount} tone="emerald" />
                <StatCard label="Cavities" value={cavityCount} tone="rose" />
                <StatCard label="Filled" value={filledCount} tone="sky" />
                <StatCard label="Missing" value={missingCount} tone="slate" />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-800">Your Tooth Chart</h3>
                    <p className="text-sm text-slate-500">Recorded by your dentist — read only</p>
                  </div>
                  {lastUpdated && (
                    <span className="text-xs text-slate-400">
                      Last updated {new Date(lastUpdated).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                    </span>
                  )}
                </div>
                <ToothChart
                  teethStates={currentTeethStates}
                  bleedingMap={bleedingMap}
                  onToothClick={() => null}
                  interactive={false}
                  patientAge={currentProfile.age}
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

              {sentReports.length > 0 && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h2 className="mb-3 font-bold text-slate-800">Reports from your dentist</h2>
                  <div className="space-y-3">
                    {[...sentReports].reverse().map((r, i) => (
                      <div
                        key={i}
                        className={`rounded-xl border p-4 ${
                          i === 0 ? "border-brand-200 bg-brand-50/40" : "border-slate-100"
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-500">
                            {i === 0 ? "Latest — " : ""}
                            {new Date(r.sentAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                          </span>
                          <span className="text-xs font-medium text-slate-400">Sent by {r.sentBy}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                          <span>Healthy: <b>{r.healthyCount}</b></span>
                          <span>Cavities: <b>{r.cavityCount}</b></span>
                          <span>Filled: <b>{r.filledCount}</b></span>
                          <span>Missing: <b>{r.missingCount}</b></span>
                        </div>
                        {r.advice && <p className="mt-2 text-sm text-slate-600">Advice: {r.advice}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-1 font-bold text-slate-800">Current Chart Summary</h2>
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
                  <span className="text-sm text-slate-500">Missing teeth</span>
                  <span className="text-sm font-semibold text-slate-800">{missingCount}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm text-slate-500">Next appointment</span>
                  <span className="text-sm font-semibold text-brand-700">{currentProfile.appointment}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-sm text-slate-500">Dentist's advice</span>
                  <span className="text-sm font-semibold text-slate-800">{currentProfile.advice || "—"}</span>
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