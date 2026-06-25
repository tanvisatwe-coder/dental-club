import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-700 to-purple-800 text-white flex flex-col p-4 shrink-0 shadow-xl">

      <div className="p-4 mb-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span>🦷</span> DentalClub
        </div>
        <p className="text-xs text-purple-200 mt-1">
          Smart Dental Management
        </p>
      </div>

      <nav className="flex flex-col gap-2 flex-1">

        {/* DASHBOARD */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-3 rounded-xl text-left flex items-center gap-3 text-sm font-medium transition-all ${
            activeTab === 'dashboard'
              ? 'bg-white/20 font-semibold'
              : 'hover:bg-white/10'
          }`}
        >
          🏠 Dashboard
        </button>

        {/* CHATS */}
        <button
          onClick={() => setActiveTab('chats')}
          className={`px-4 py-3 rounded-xl text-left flex items-center gap-3 text-sm font-medium transition-all ${
            activeTab === 'chats'
              ? 'bg-white/20 font-semibold'
              : 'hover:bg-white/10'
          }`}
        >
          💬 Chats
        </button>

        {/* 🦷 DENTAL CHART (THIS WAS MISSING) */}
        <button
          onClick={() => setActiveTab('dentalChart')}
          className={`px-4 py-3 rounded-xl text-left flex items-center gap-3 text-sm font-medium transition-all ${
            activeTab === 'dentalChart'
              ? 'bg-white/20 font-semibold'
              : 'hover:bg-white/10'
          }`}
        >
          🦷 Dental Chart
        </button>

        {/* REPORTS */}
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-3 rounded-xl text-left flex items-center gap-3 text-sm font-medium transition-all ${
            activeTab === 'reports'
              ? 'bg-white/20 font-semibold'
              : 'hover:bg-white/10'
          }`}
        >
          📊 Reports
        </button>

      </nav>
    </aside>
  );
};

export default Sidebar;