import React, { useState } from 'react';
import ToothChart from '../components/ToothChart';
import ChatBox from '../components/ChatBox';

const PatientDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPatient, setSelectedPatient] = useState('John Doe');

  const getInitialChartFor = (name) => {
    return Array.from({ length: 32 }).reduce((acc, _, i) => {
      const toothNum = i + 1;

      if (name === 'John Doe') {
        if (toothNum === 4 || toothNum === 14) acc[toothNum] = 1;
        else if (toothNum === 19 || toothNum === 32) acc[toothNum] = 2;
        else acc[toothNum] = 0;
      } else if (name === 'Jane Smith') {
        if (toothNum === 8 || toothNum === 9 || toothNum === 24) acc[toothNum] = 1;
        else if (toothNum === 2 || toothNum === 3) acc[toothNum] = 2;
        else acc[toothNum] = 0;
      } else if (name === 'Alex Mercer') {
        if (toothNum === 12) acc[toothNum] = 1;
        else if (toothNum === 5 || toothNum === 18 || toothNum === 30) acc[toothNum] = 2;
        else acc[toothNum] = 0;
      }

      return acc;
    }, {});
  };

  const patientProfiles = {
    'John Doe': { appointment: 'June 30 at 10:00 AM', advice: 'Avoid cold drinks.' },
    'Jane Smith': { appointment: 'July 05 at 2:30 PM', advice: 'Brush gently.' },
    'Alex Mercer': { appointment: 'July 12 at 9:15 AM', advice: 'Floss daily.' }
  };

  const [currentTeethStates, setCurrentTeethStates] = useState(
    getInitialChartFor('John Doe')
  );

  const [currentProfile, setCurrentProfile] = useState(
    patientProfiles['John Doe']
  );

  const handlePatientChange = (e) => {
    const next = e.target.value;
    setSelectedPatient(next);

    setCurrentTeethStates(getInitialChartFor(next));
    setCurrentProfile(patientProfiles[next]);
  };

  const healthyCount = Object.values(currentTeethStates).filter(s => s === 0).length;
  const cavityCount = Object.values(currentTeethStates).filter(s => s === 1).length;
  const filledCount = Object.values(currentTeethStates).filter(s => s === 2).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-teal-700 text-white flex flex-col p-4">

        <h2 className="text-xl font-bold mb-6">Dental Club</h2>

        <nav className="flex flex-col gap-3 flex-1">

          {/* HOME */}
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-left p-2 rounded ${
              activeTab === 'overview' ? 'bg-white/20' : ''
            }`}
          >
            🏠 Overview
          </button>

          {/* CHAT */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`text-left p-2 rounded ${
              activeTab === 'messages' ? 'bg-white/20' : ''
            }`}
          >
            💬 Messages
          </button>

          {/* ================= STEP 1-A: NEW TAB BUTTON ================= */}
          <button
            onClick={() => setActiveTab('report')}
            className={`text-left p-2 rounded ${
              activeTab === 'report' ? 'bg-white/20' : ''
            }`}
          >
            📄 Report
          </button>

        </nav>

        {/* LOGOUT */}
        <button
          onClick={onLogout}
          className="bg-red-500 p-2 rounded mt-auto"
        >
          Logout
        </button>

      </aside>

      {/* ================= MAIN AREA ================= */}
      <main className="flex-1 p-6">

        {/* HOME SCREEN */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            <h1 className="text-2xl font-bold">
              Welcome {selectedPatient}
            </h1>

            <select
              value={selectedPatient}
              onChange={handlePatientChange}
              className="border p-2 rounded"
            >
              <option>John Doe</option>
              <option>Jane Smith</option>
              <option>Alex Mercer</option>
            </select>

            <div className="grid grid-cols-3 gap-4">

              <div className="bg-green-500 text-white p-4 rounded">
                Healthy: {healthyCount}
              </div>

              <div className="bg-pink-500 text-white p-4 rounded">
                Cavities: {cavityCount}
              </div>

              <div className="bg-blue-500 text-white p-4 rounded">
                Filled: {filledCount}
              </div>

            </div>

            <div className="bg-white p-4 rounded">
              <ToothChart
                teethStates={currentTeethStates}
                onToothClick={() => null}
              />
            </div>

          </div>
        )}

        {/* CHAT SCREEN */}
        {activeTab === 'messages' && (
          <div>
            <ChatBox />
          </div>
        )}

        {/* ================= STEP 1-B: REPORT SCREEN ================= */}
        {activeTab === 'report' && (
          <div className="space-y-6">

            <h1 className="text-2xl font-bold">
              Clinical Report - {selectedPatient}
            </h1>

            <div className="bg-white p-6 rounded-xl space-y-2">

              <p><b>Patient:</b> {selectedPatient}</p>
              <p><b>Healthy Teeth:</b> {healthyCount}</p>
              <p><b>Cavities:</b> {cavityCount}</p>
              <p><b>Filled Teeth:</b> {filledCount}</p>

              <p><b>Appointment:</b> {currentProfile.appointment}</p>
              <p><b>Advice:</b> {currentProfile.advice}</p>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default PatientDashboard;