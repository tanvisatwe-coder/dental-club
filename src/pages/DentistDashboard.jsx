import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ToothChart from "../components/ToothChart";
import ChatBox from "../components/ChatBox";
import StatCard from "../components/StatCard";
import StatRow from "../components/StatRow";
import AuditLog from "../components/AuditLog";
import Dropdown from "../components/Dropdown";
import AddPatientModal from "../components/AddPatientModal";
import doctorsData from "../data/doctorsData";
import { STATUS, modeToStatus } from "../data/toothMeta";
import { getUnreadCount, sendReportMessage, deleteThread } from "../data/chatStore";
import { loadChart, saveChart, deleteChart } from "../data/chartStore";
import { loadPatients, addPatient, updatePatient, deletePatient, patientsStorageKey } from "../data/patientsStore";
import { sendReport, loadReports, deleteReport, deleteAllReports } from "../data/reportsStore";
import {
  IconDroplet,
  IconSave,
  IconDownload,
} from "../components/icons";

const RISK_STYLES = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  High: "bg-rose-50 text-rose-700 ring-rose-200",
};

const SECTION_LABELS = {
  dashboard: "Overview Dashboard",
  patients: "Patient Profiles",
  appointments: "Appointments",
  dentalChart: "Charting Center",
  reports: "Reports",
  chats: "Secure Chat",
};

const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

const DentistDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggedInDoctor, setLoggedInDoctor] = useState(doctorsData[0].name);
  const [auditLog, setAuditLog] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);

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

  const initialChart = loadChart(selectedPatient || allPatients[0]);
  const [currentTeethStates, setCurrentTeethStates] = useState(initialChart.teeth);
  const [bleedingMap, setBleedingMap] = useState(initialChart.bleeding);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [selectedMode, setSelectedMode] = useState("cavity");
  const [unreadCount, setUnreadCount] = useState(0);
  const [sentReportsList, setSentReportsList] = useState(() => loadReports(selectedPatient));

  useEffect(() => {
    setSentReportsList(loadReports(selectedPatient));
  }, [selectedPatient]);

  useEffect(() => {
    const recalc = () => {
      const total = allPatients.reduce(
        (sum, p) => sum + getUnreadCount(loggedInDoctor, p, "Dentist"),
        0
      );
      setUnreadCount(total);
    };
    recalc();
    window.addEventListener("storage", recalc);
    return () => window.removeEventListener("storage", recalc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInDoctor, activeTab, patientProfiles]);

  const switchToPatient = (name) => {
    setSelectedPatient(name);
    const chart = loadChart(name);
    setCurrentTeethStates(chart.teeth);
    setBleedingMap(chart.bleeding);
    setSelectedTooth(null);
  };

  const handleToothClick = (toothNum) => {
    setSelectedTooth(toothNum);
    const newStatus = modeToStatus(selectedMode);

    setCurrentTeethStates((prev) => ({ ...prev, [toothNum]: newStatus }));

    setAuditLog((prev) => [
      ...prev,
      {
        tooth: toothNum,
        label: STATUS[newStatus].label,
        color: STATUS[newStatus].border,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      },
    ]);
  };

  const handleBleedingChange = (value) => {
    if (!selectedTooth) return;
    setBleedingMap((prev) => ({ ...prev, [selectedTooth]: value }));
  };

  const healthyCount = Object.values(currentTeethStates).filter((s) => s === 0).length;
  const cavityCount = Object.values(currentTeethStates).filter((s) => s === 1).length;
  const filledCount = Object.values(currentTeethStates).filter((s) => s === 2).length;
  const missingCount = Object.values(currentTeethStates).filter((s) => s === 3).length;
  const totalBleeding = Object.values(bleedingMap).reduce((a, b) => a + b, 0);

  let risk = "Low";
  if (totalBleeding > 25 || cavityCount > 6) risk = "High";
  else if (totalBleeding > 10 || cavityCount > 3) risk = "Medium";

  const profile = patientProfiles[selectedPatient] || {};

  const generateReport = () => {
    const doc = new jsPDF();

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
    doc.text(`Missing Teeth: ${missingCount}`, 20, 170);

    doc.setFontSize(15);
    doc.text("Clinical Assessment", 20, 195);
    doc.setFontSize(12);
    doc.text(`Bleeding Score: ${totalBleeding}`, 20, 210);
    doc.text(`Risk Level: ${risk}`, 20, 220);

    doc.setFontSize(15);
    doc.text("Appointment", 20, 245);
    doc.setFontSize(12);
    doc.text(`${profile.appointment}`, 20, 260);

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Generated by DentalClub Management System", 20, 285);

    doc.save(`${selectedPatient}_report.pdf`);
    toast.success("PDF report downloaded!");
  };

  const handleSaveChanges = () => {
    saveChart(selectedPatient, currentTeethStates, bleedingMap);
    toast.success("Changes saved successfully! The patient can now see this update.");
  };

  const handleSendReportToPatient = () => {
    const snapshot = {
      healthyCount,
      cavityCount,
      filledCount,
      missingCount,
      bleedingScore: totalBleeding,
      risk,
      appointment: profile.appointment,
      advice: profile.advice,
      sentBy: loggedInDoctor,
    };
    sendReport(selectedPatient, snapshot);
    sendReportMessage(loggedInDoctor, selectedPatient, "Dentist", snapshot);
    setSentReportsList(loadReports(selectedPatient));
    toast.success(`Report sent to ${selectedPatient} — they'll see it in Secure Chat and Reports.`);
  };

  const handleDeleteSentReport = (index) => {
    const next = deleteReport(selectedPatient, index);
    setSentReportsList(next);
    toast.success("Report deleted.");
  };

  const handleAddPatient = (newProfile) => {
    const next = addPatient(newProfile.name, newProfile);
    setPatientProfiles(next);
    setShowAddPatient(false);
    switchToPatient(newProfile.name);
    setActiveTab("dentalChart");
    toast.success(`${newProfile.name} added to your patient list.`);
  };

  const handleEditPatient = (updatedProfile) => {
    const { name, ...fields } = updatedProfile;
    const next = updatePatient(selectedPatient, fields);
    setPatientProfiles(next);
    setShowEditPatient(false);
    toast.success(`${selectedPatient}'s profile updated.`);
  };

  const handleDeletePatient = (name) => {
    if (!window.confirm(`Delete ${name}'s profile? This also removes their chart, reports, and chat history. This can't be undone.`)) {
      return;
    }
    const next = deletePatient(name);
    deleteChart(name);
    deleteAllReports(name);
    doctorsData.forEach((doc) => deleteThread(doc.name, name));
    setPatientProfiles(next);

    if (selectedPatient === name) {
      const remaining = Object.keys(next);
      if (remaining.length > 0) {
        switchToPatient(remaining[0]);
      } else {
        setSelectedPatient("");
        setCurrentTeethStates({});
        setBleedingMap({});
      }
    }
    toast.success(`${name}'s profile deleted.`);
  };

  const filteredPatients = allPatients.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role="Dentist"
        navigate={navigate}
        switchRoute="/patient"
        switchLabel="Switch to Patient View"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar
          section={SECTION_LABELS[activeTab] || "Dashboard"}
          role="Dentist"
          userName={loggedInDoctor}
          notifications={unreadCount}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search patients..."
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 space-y-6 p-6">
          {/* Patient + doctor identity selector row */}
          <Card className="flex flex-wrap items-center justify-between gap-4 !p-4">
            <div className="flex flex-wrap items-center gap-4">
              {allPatients.length > 0 && (
                <Dropdown
                  label="Patient"
                  value={selectedPatient}
                  onChange={switchToPatient}
                  colorClass="bg-gradient-to-br from-brand-500 to-brand-700"
                  options={allPatients.map((name) => ({
                    value: name,
                    label: name,
                    initials: name.split(" ").map((w) => w[0]).join(""),
                    sublabel: patientProfiles[name].appointment,
                  }))}
                />
              )}

              <Dropdown
                label="Logged in as"
                value={loggedInDoctor}
                onChange={setLoggedInDoctor}
                colorClass="bg-slate-700"
                options={doctorsData.map((doc) => ({
                  value: doc.name,
                  label: doc.name,
                  initials: doc.name.replace(/^Dr\.?\s*/i, "").split(" ").map((w) => w[0]).join(""),
                  sublabel: doc.specialization,
                }))}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {profile.appointment && (
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
                  Next visit: {profile.appointment}
                </span>
              )}
              {selectedPatient && (
                <button
                  onClick={() => setShowEditPatient(true)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={() => setShowAddPatient(true)}
                className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
              >
                + Add Patient
              </button>
            </div>
          </Card>

          {activeTab === "dashboard" && (
            <>
              <StatRow
                items={[
                  { label: "Total Patients", value: allPatients.length },
                  { label: "Charts Updated", value: auditLog.length },
                  { label: "Appointments Today", value: 4 },
                  { label: "Pending Follow-ups", value: 2 },
                ]}
              />

              <Card>
                <h2 className="mb-4 flex items-center justify-between font-bold text-slate-800">
                  Patient Directory
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                    {filteredPatients.length} Patient{filteredPatients.length !== 1 ? "s" : ""}
                  </span>
                </h2>
                <p className="-mt-3 mb-4 text-sm text-slate-500">Select a patient to begin clinical charting</p>

                <div className="space-y-3">
                  {filteredPatients.length === 0 && (
                    <p className="py-6 text-center text-sm text-slate-400">No patients match "{searchTerm}"</p>
                  )}
                  {filteredPatients.map((name) => {
                    const p = patientProfiles[name];
                    const initials = name.split(" ").map((w) => w[0]).join("");
                    return (
                      <div
                        key={name}
                        className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{name}</p>
                            <p className="text-xs text-slate-400">
                              Age: {p.age} · Last visit: {p.appointment?.split(" - ")[0]}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 sm:inline">
                            {p.note}
                          </span>
                          <button
                            onClick={() => {
                              switchToPatient(name);
                              setActiveTab("dentalChart");
                            }}
                            className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
                          >
                            View Chart
                          </button>
                          <button
                            onClick={() => handleDeletePatient(name)}
                            className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Healthy" value={healthyCount} tone="emerald" />
                <StatCard label="Cavities" value={cavityCount} tone="rose" />
                <StatCard label="Filled" value={filledCount} tone="sky" />
                <StatCard label="Missing" value={missingCount} tone="slate" />
              </div>
            </>
          )}

          {activeTab === "patients" && (
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-bold text-slate-800">All Patients</h2>
                <span className="text-xs text-slate-400">{filteredPatients.length} shown</span>
              </div>
              {filteredPatients.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-400">No patients match "{searchTerm}"</p>
              )}
              <div className="divide-y divide-slate-100">
                {filteredPatients.map((name) => {
                  const p = patientProfiles[name];
                  return (
                    <div key={name} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{name}</p>
                        <p className="text-xs text-slate-400">
                          {p.age} yrs · {p.gender} · {p.bloodGroup}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden text-xs font-medium text-brand-700 sm:inline">{p.appointment}</span>
                        <button
                          onClick={() => {
                            switchToPatient(name);
                            setActiveTab("dentalChart");
                          }}
                          className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                        >
                          View Chart
                        </button>
                        <button
                          onClick={() => handleDeletePatient(name)}
                          className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
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
                      <p className="text-sm font-semibold text-slate-800">{name}</p>
                      <span className="text-xs font-medium text-slate-500">{p.appointment}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {activeTab === "chats" && selectedPatient && (
            <ChatBox
              doctorName={loggedInDoctor}
              patientName={selectedPatient}
              role="Dentist"
              patientProfile={profile}
            />
          )}

          {activeTab === "dentalChart" && selectedPatient && (
            <div className="space-y-6">
              <Card className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Dental Chart — {selectedPatient}</h2>
                  <p className="text-sm text-slate-500">Click a tooth, then pick a condition to log it</p>
                </div>

                <div className="flex flex-wrap rounded-xl bg-slate-100 p-1">
                  {[0, 1, 2, 3].map((s) => {
                    const key = s === 0 ? "healthy" : s === 1 ? "cavity" : s === 2 ? "filled" : "missing";
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

              <Card>
                <ToothChart
                  teethStates={currentTeethStates}
                  onToothClick={handleToothClick}
                  selectedTooth={selectedTooth}
                  bleedingMap={bleedingMap}
                  patientAge={profile.age}
                />
              </Card>

              <div className="grid gap-6 lg:grid-cols-3">
                <AuditLog entries={auditLog} />

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
                        className="w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    <IconSave className="h-4 w-4" /> Save Changes
                  </button>
                  <button
                    onClick={handleSendReportToPatient}
                    className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Send Report to Patient
                  </button>
                  <button
                    onClick={generateReport}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    <IconDownload className="h-4 w-4" /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
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
                  <div><dt className="text-xs text-slate-400">Missing</dt><dd className="text-lg font-bold text-slate-800">{missingCount}</dd></div>
                </dl>
                <p className="mt-4 text-sm text-slate-500">Appointment: <span className="font-medium text-slate-700">{profile.appointment}</span></p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={handleSendReportToPatient}
                    className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    Send Report to Patient
                  </button>
                  <button
                    onClick={generateReport}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    <IconDownload className="h-4 w-4" /> Download PDF Report
                  </button>
                </div>
              </Card>

              {sentReportsList.length > 0 && (
                <Card>
                  <h3 className="mb-4 font-bold text-slate-800">Sent Reports — {selectedPatient}</h3>
                  <div className="space-y-3">
                    {[...sentReportsList].reverse().map((r, revIdx) => {
                      const realIndex = sentReportsList.length - 1 - revIdx;
                      return (
                        <div key={realIndex} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500">
                              {new Date(r.sentAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })} · {r.sentBy}
                            </p>
                            <p className="mt-1 text-xs text-slate-600">
                              Healthy {r.healthyCount} · Cavities {r.cavityCount} · Filled {r.filledCount} · Missing {r.missingCount} · Risk {r.risk}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteSentReport(realIndex)}
                            className="shrink-0 rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>

      <AddPatientModal
        open={showAddPatient}
        onClose={() => setShowAddPatient(false)}
        onSubmit={handleAddPatient}
        mode="add"
      />

      <AddPatientModal
        open={showEditPatient}
        onClose={() => setShowEditPatient(false)}
        onSubmit={handleEditPatient}
        mode="edit"
        initialData={selectedPatient ? { name: selectedPatient, ...profile } : null}
      />
    </div>
  );
};

export default DentistDashboard;