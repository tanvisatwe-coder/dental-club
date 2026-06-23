import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-700 to-purple-800 text-white flex flex-col p-4 shrink-0 shadow-xl">
      <div className="p-4 mb-6">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span>🦷</span> DentalClub
        </div>
        <p className="text-xs text-purple-200 mt-1">Smart Dental Management</p>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
            activeTab === 'dashboard' ? 'bg-white/20 text-white shadow-md font-semibold' : 'hover:bg-white/10 text-white'
          }`}
        >
          <span>🏠</span> Dashboard
        </button>
        
        <button 
          onClick={() => setActiveTab('chats')}
          className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
            activeTab === 'chats' ? 'bg-white/20 text-white shadow-md font-semibold' : 'hover:bg-white/10 text-white'
          }`}
        >
          <span>💬</span> Chats
        </button>

        <button className="w-full text-left hover:bg-white/10 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium text-white/60">
          👤 Patients
        </button>
        <button className="w-full text-left hover:bg-white/10 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium text-white/60">
          🦷 Dental Chart
        </button>
        <button className="w-full text-left hover:bg-white/10 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium text-white/60">
          📊 Reports
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;