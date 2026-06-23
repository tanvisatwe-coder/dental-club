import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ToothChart from '../components/ToothChart';
import ChatBox from '../components/ChatBox';

const DentistDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState('John Doe');

  // Helper to generate a fresh, default healthy chart (all 32 teeth = 0)
  const createDefaultChart = () => {
    return Array.from({ length: 32 }).reduce((acc, _, i) => {
      acc[i + 1] = 0; // 0 = Healthy (Green)
      return acc;
    }, {});
  };

  // 1. Master Patient Database Storage
  const [patientDatabase, setPatientDatabase] = useState({
    'John Doe': createDefaultChart(),
    'Jane Smith': createDefaultChart(),
    'Alex Mercer': createDefaultChart(),
  });

  // 2. The temporary layout active on the screen right now
  const [currentTeethStates, setCurrentTeethStates] = useState(createDefaultChart());

  // 3. Handles Name Switching + Smart Auto-Clearing Logic
  const handlePatientChange = (e) => {
    const nextPatient = e.target.value;
    setSelectedPatient(nextPatient);
    
    // Check if we have a saved database chart for them, otherwise provide a perfectly cleared fresh one!
    if (patientDatabase[nextPatient]) {
      setCurrentTeethStates({ ...patientDatabase[nextPatient] });
    } else {
      setCurrentTeethStates(createDefaultChart());
    }
  };

  // 4. Click handler to toggle colors on screen: 0 (Green) -> 1 (Pink) -> 2 (Blue) -> 0
  const handleToothClick = (toothNum) => {
    setCurrentTeethStates((prev) => ({
      ...prev,
      [toothNum]: (prev[toothNum] + 1) % 3,
    }));
  };

  // 5. Commit Screen Changes to Memory for this specific name
  const handleSaveChanges = () => {
    setPatientDatabase((prevDb) => ({
      ...prevDb,
      [selectedPatient]: { ...currentTeethStates },
    }));
    alert(`💾 Dental records successfully updated and locked in for ${selectedPatient}!`);
  };

  // Compute live statistics based on the current screen layout
  const healthyCount = Object.values(currentTeethStates).filter((s) => s === 0).length;
  const cavityCount = Object.values(currentTeethStates).filter((s) => s === 1).length;
  const filledCount = Object.values(currentTeethStates).filter((s) => s === 2).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-row">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0">
        {activeTab === 'dashboard' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Header Identity Banner */}
            <div className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 text-white p-6 rounded-3xl shadow-md flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 text-3xl font-extrabold mb-1">
                  <span>🦷</span> Dental Dashboard
                </div>
                <p className="text-purple-100 text-sm">Manage patient dental records with ease</p>
              </div>
              <div className="text-5xl opacity-90 pr-4">👨‍⚕️</div>
            </div>

            {/* Quick Summary Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-sky-500 text-white p-5 rounded-2xl shadow-sm">
                <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">Patients</p>
                <p className="text-3xl font-bold mt-1">3</p>
              </div>
              <div className="bg-emerald-500 text-white p-5 rounded-2xl shadow-sm">
                <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">Treatments</p>
                <p className="text-3xl font-bold mt-1">12</p>
              </div>
              <div className="bg-rose-500 text-white p-5 rounded-2xl shadow-sm">
                <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">Reports</p>
                <p className="text-3xl font-bold mt-1">8</p>
              </div>
            </div>

            {/* Selector Control Bar */}
            <div className="w-full bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between">
              <h3 className="text-lg font-bold text-indigo-900">Patient Selection</h3>
              <div className="flex items-center gap-3">
                <select 
                  value={selectedPatient} 
                  onChange={handlePatientChange}
                  className="border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none bg-slate-50 font-medium cursor-pointer"
                >
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Alex Mercer">Alex Mercer</option>
                </select>
                <button onClick={onLogout} className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
                  Logout
                </button>
              </div>
            </div>

            {/* Interactive Dynamic Medical Metrics Block */}
            <div className="w-full bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-500 text-white p-5 rounded-2xl shadow-md">
                  <p className="text-sm font-medium opacity-90">Healthy Teeth</p>
                  <p className="text-4xl font-extrabold mt-1">{healthyCount}</p>
                </div>
                <div className="bg-pink-500 text-white p-5 rounded-2xl shadow-md">
                  <p className="text-sm font-medium opacity-90">Cavities</p>
                  <p className="text-4xl font-extrabold mt-1">{cavityCount}</p>
                </div>
                <div className="bg-sky-500 text-white p-5 rounded-2xl shadow-md">
                  <p className="text-sm font-medium opacity-90">Filled Teeth</p>
                  <p className="text-4xl font-extrabold mt-1">{filledCount}</p>
                </div>
              </div>

              {/* Working Save Changes Button */}
              <div>
                <button 
                  onClick={handleSaveChanges}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md transition-all transform active:scale-95"
                >
                  💾 Save Changes
                </button>
              </div>

              {/* Mount the Modular Tooth Chart */}
              <ToothChart teethStates={currentTeethStates} onToothClick={handleToothClick} />
            </div>
          </div>
        )}

        {/* Messaging Interface */}
        {activeTab === 'chats' && (
          <div className="flex-1 bg-white p-6 overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Clinic Portal Workspace</h2>
              <button onClick={() => setActiveTab('dashboard')} className="text-xs font-semibold px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600">
                ✕ Close Workspace
              </button>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ChatBox />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DentistDashboard;