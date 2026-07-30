import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "../utils/notify";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../hooks/useTheme";
import { useDensity } from "../hooks/useDensity";
import Topbar from "../components/Topbar";
import ToothChart from "../components/ToothChart";
import ChatBox from "../components/ChatBox";
import StatCard from "../components/StatCard";
import Dropdown from "../components/Dropdown";
import doctorsData from "../data/doctorsData";
import { getUnreadCount, loadMessages } from "../data/chatStore";
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
  const { theme, toggleTheme } = useTheme();
  const { density, toggleDensity } = useDensity();
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
  const [notificationItems, setNotificationItems] = useState([]);

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

      const items = doctorsData
        .map((doc) => {
          const messages = loadMessages(doc.name, selectedPatient);
          const unread = getUnreadCount(doc.name, selectedPatient, "Patient");
          const last = messages[messages.length - 1];
          return {
            key: doc.name,
            name: doc.name,
            preview: last ? (last.type === "report" ? "Sent a dental report" : last.text) : "",
            time: last ? last.time : "",
            sortKey: last ? last.id : 0,
            unread,
          };
        })
        .filter((item) => item.unread > 0)
        .sort((a, b) => b.sortKey - a.sortKey);
      setNotificationItems(items);
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
        notify.success("Your dentist sent you a new report!");
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [selectedPatient]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role="Patient"
        navigate={navigate}
        switchRoute="/dentist"
        switchLabel="Switch to Dentist View"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        density={density}
        toggleDensity={toggleDensity}
        accountName={selectedPatient}
        accountSubLabel="Patient"
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar
          section={SECTION_LABELS[activeTab] || "Overview"}
          role="Patient"
          userName={selectedPatient || "Patient"}
          notifications={unreadCount}
          notificationItems={notificationItems}
          onSelectNotification={(item) => {
            setSelectedDoctor(item.name);
            setActiveTab("messages");
          }}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 space-y-6 p-6 compact:space-y-3 compact:p-4">
          {activeTab === "overview" && allPatients.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div>
                  <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Welcome, {selectedPatient}</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Here's a look at your dental record</p>
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

              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Your Tooth Chart</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Recorded by your dentist — read only</p>
                  </div>
                  {lastUpdated && (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
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
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Clinical Report — {selectedPatient}</h1>

              {sentReports.length > 0 && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <h2 className="mb-3 font-bold text-slate-800 dark:text-slate-100">Reports from your dentist</h2>
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

              <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-1 font-bold text-slate-800 dark:text-slate-100">Current Chart Summary</h2>
                <div className="flex justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Patient</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{selectedPatient}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Healthy teeth</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{healthyCount}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Cavities</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{cavityCount}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Filled teeth</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{filledCount}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Missing teeth</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{missingCount}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Next appointment</span>
                  <span className="text-sm font-semibold text-brand-700">{currentProfile.appointment}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Dentist's advice</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{currentProfile.advice || "—"}</span>
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