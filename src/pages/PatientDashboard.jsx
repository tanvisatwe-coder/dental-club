import React, { useState } from 'react';
import ToothChart from '../components/ToothChart';
import ChatBox from '../components/ChatBox';

const PatientDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPatient, setSelectedPatient] = useState('John Doe');

  // Helper to generate unique mock maps cleanly
  const getInitialChartFor = (name) => {
    return Array.from({ length: 32 }).reduce((acc, _, i) => {
      const toothNum = i + 1;
      if (name === 'John Doe') {
        if (toothNum === 4 || toothNum === 14) acc[toothNum] = 1;      // Cavities
        else if (toothNum === 19 || toothNum === 32) acc[toothNum] = 2; // Fillings
        else acc[toothNum] = 0;
      } else if (name === 'Jane Smith') {
        if (toothNum === 8 || toothNum === 9 || toothNum === 24) acc[toothNum] = 1; // Cavities
        else if (toothNum === 2 || toothNum === 3) acc[toothNum] = 2;               // Fillings
        else acc[toothNum] = 0;
      } else if (name === 'Alex Mercer') {
        if (toothNum === 12) acc[toothNum] = 1;                                     // Cavities
        else if (toothNum === 5 || toothNum === 18 || toothNum === 30) acc[toothNum] = 2; // Fillings
        else acc[toothNum] = 0;
      }
      return acc;
    }, {});
  };

  // Dedicated profile text data
  const patientProfiles = {
    'John Doe': { appointment: 'June 30 at 10:00 AM', advice: 'Avoid cold and carbonated drinks around teeth 4 and 14.' },
    'Jane Smith': { appointment: 'July 05 at 2:30 PM', advice: 'Be extra gentle when brushing the front central incisors (teeth 8 and 9).' },
    'Alex Mercer': { appointment: 'July 12 at 9:15 AM', advice: 'Continue flossing thoroughly around the lower molar restorations.' }
  };

  // State variable holding the precise active tooth configurations shown right now
  const [currentTeethStates, setCurrentTeethStates] = useState(getInitialChartFor('John Doe'));
  const [currentProfile, setCurrentProfile] = useState(patientProfiles['John Doe']);

  // CRITICAL FIX: Explicitly updates states to trigger absolute visual re-renders
  const handlePatientChange = (e) => {
    const nextPatient = e.target.value;
    setSelectedPatient(nextPatient);
    
    // Forcing state overrides instantly
    setCurrentTeethStates(getInitialChartFor(nextPatient));
    setCurrentProfile(patientProfiles[nextPatient]);
  };

  // Live Calculations from the active state
  const totalTeeth = 32;
  const healthyCount = Object.values(currentTeethStates).filter((s) => s === 0).length;
  const cavityCount = Object.values(currentTeethStates).filter((s) => s === 1).length;
  const filledCount = Object.values(currentTeethStates).filter((s) => s === 2).length;
  const healthScore = Math.round((healthyCount / totalTeeth) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-teal-600 to-cyan-700 text-white flex flex-col p-4 shrink-0 shadow-xl">
        <div className="p-4 mb-6">
          <div className="flex items-center gap-2 text-xl font-bold">
            <span>🦷</span> DentalClub
          </div>
          <p className="text-xs text-teal-100 mt-1">Patient Hub Portal</p>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
              activeTab === 'overview' ? 'bg-white/20 text-white shadow-md font-semibold' : 'hover:bg-white/10 text-white'
            }`}
          >
            <span>🏠</span> My Health Overview
          </button>
          
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
              activeTab === 'messages' ? 'bg-white/20 text-white shadow-md font-semibold' : 'hover:bg-white/10 text-white'
            }`}
          >
            <span>💬</span> Chat with Dentist
          </button>
        </nav>

        <button 
          onClick={onLogout} 
          className="w-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold py-3 rounded-xl mt-auto shadow-md transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* 2. CORE INTERFACE PANEL */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {activeTab === 'overview' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Banner info */}
            <div className="w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white p-6 rounded-3xl shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-extrabold mb-1">Welcome back, {selectedPatient}!</h2>
                <p className="text-teal-700 text-sm bg-white/95 px-3 py-1 rounded-full inline-block font-semibold mt-1">
                  ✨ Next Appointment: {currentProfile.appointment}
                </p>
              </div>
              <div className="text-5xl opacity-90 pr-4">😊</div>
            </div>

            {/* Account Switcher Row Panel */}
            <div className="w-full bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-700">Viewing Patient Account:</h4>
                <p className="text-xs text-slate-400">Frontend Mock Switcher Tool</p>
              </div>
              <select 
                value={selectedPatient} 
                onChange={handlePatientChange}
                className="border border-teal-300 rounded-xl px-4 py-2 text-sm focus:outline-none bg-teal-50 text-teal-800 font-semibold cursor-pointer shadow-sm animate-pulse"
              >
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
                <option value="Alex Mercer">Alex Mercer</option>
              </select>
            </div>

            {/* Metrics cards breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Health Score</p>
                <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-8 border-teal-500 text-3xl font-black text-teal-600">
                  {healthScore}%
                </div>
                <p className="text-xs text-slate-400 mt-3 font-medium">Keep up the good work!</p>
              </div>

              <div className="bg-emerald-500 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <p className="text-sm opacity-90 font-medium">Healthy Teeth</p>
                <p className="text-4xl font-extrabold">{healthyCount}</p>
              </div>
              <div className="bg-pink-500 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <p className="text-sm opacity-90 font-medium">Active Cavities</p>
                <p className="text-4xl font-extrabold">{cavityCount}</p>
              </div>
              <div className="bg-sky-500 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                <p className="text-sm opacity-90 font-medium">Restored / Filled</p>
                <p className="text-4xl font-extrabold">{filledCount}</p>
              </div>
            </div>

            {/* Tooth chart module block */}
            <div className="w-full bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">My Clinical Dental Chart</h3>
                <p className="text-xs text-slate-400">Official condition log context. Changes can only be filed by clinical staff.</p>
              </div>

              {/* Read-only layout window wrapper */}
              <div className="pointer-events-none opacity-95">
                <ToothChart teethStates={currentTeethStates} onToothClick={() => null} />
              </div>
            </div>

            {/* Dynamic Advice Row Box */}
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
              <h4 className="text-amber-800 font-bold text-base flex items-center gap-2">
                📋 Doctor's Personal Care Directives
              </h4>
              <ul className="text-sm text-amber-900/80 list-disc list-inside space-y-1">
                <li>{currentProfile.advice}</li>
                <li>Rinse with warm saltwater twice daily to support healthy gum tissues.</li>
                <li>Brush with prescription toothpaste nightly before going to sleep.</li>
              </ul>
            </div>

          </div>
        )}

        {/* Messaging window workspace router */}
        {activeTab === 'messages' && (
          <div className="flex-1 bg-white p-6 overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Contact Dr. Smith</h2>
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

export default PatientDashboard;