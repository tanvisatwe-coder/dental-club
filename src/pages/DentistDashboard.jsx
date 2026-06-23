import Sidebar from "../components/Sidebar";
import ToothChart from "../components/ToothChart";
import { useState } from "react";

function DentistDashboard({ role, onLogout }) {
  const [patientId, setPatientId] = useState("P1");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">

      <Sidebar />

      <div className="flex-1 p-8">

        {/* HERO SECTION */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl shadow-2xl p-8 text-white mb-8">

          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-5xl font-bold mb-3">
                🦷 Dental Dashboard
              </h1>

              <p className="text-lg opacity-90">
                Manage patient dental records with ease
              </p>
            </div>

            <div className="text-7xl">
              👨‍⚕️
            </div>

          </div>

        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-3xl p-6 shadow-xl">

            <h3 className="text-lg">
              Patients
            </h3>

            <p className="text-4xl font-bold mt-2">
              3
            </p>

          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-3xl p-6 shadow-xl">

            <h3 className="text-lg">
              Treatments
            </h3>

            <p className="text-4xl font-bold mt-2">
              12
            </p>

          </div>

          <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-3xl p-6 shadow-xl">

            <h3 className="text-lg">
              Reports
            </h3>

            <p className="text-4xl font-bold mt-2">
              8
            </p>

          </div>

        </div>

        {/* CONTROL BAR */}
        <div className="bg-white rounded-3xl shadow-xl p-5 mb-6 flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold text-indigo-700">
              Patient Selection
            </h2>
          </div>

          <div className="flex gap-3">

            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 border-indigo-300"
            >
              <option value="P1">John Doe</option>
              <option value="P2">Sarah Khan</option>
              <option value="P3">Mike Ross</option>
            </select>

            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-lg"
            >
              Logout
            </button>

          </div>

        </div>

        {/* TOOTH CHART */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <ToothChart role={role} patientId={patientId} />
        </div>

      </div>
    </div>
  );
}

export default DentistDashboard;