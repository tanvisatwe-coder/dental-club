function Sidebar() {
  return (
    <div className="w-72 min-h-screen bg-gradient-to-b from-indigo-700 via-purple-700 to-pink-600 text-white shadow-2xl">

      <div className="p-6 border-b border-white/20">
        <h1 className="text-3xl font-bold">
          🦷 DentalClub
        </h1>

        <p className="text-sm text-white/80 mt-2">
          Smart Dental Management
        </p>
      </div>

      <div className="p-5 space-y-4">

        <button className="w-full text-left bg-white/20 hover:bg-white/30 p-4 rounded-xl transition-all">
          🏠 Dashboard
        </button>

        <button className="w-full text-left bg-white/10 hover:bg-white/30 p-4 rounded-xl transition-all">
          👨‍⚕️ Patients
        </button>

        <button className="w-full text-left bg-white/10 hover:bg-white/30 p-4 rounded-xl transition-all">
          🦷 Dental Chart
        </button>

        <button className="w-full text-left bg-white/10 hover:bg-white/30 p-4 rounded-xl transition-all">
          📊 Reports
        </button>

      </div>

    </div>
  );
}

export default Sidebar;