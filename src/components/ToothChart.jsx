import { useState } from "react";
import Tooth from "./Tooth";
import AuditLog from "./AuditLog";

function ToothChart({ role }) {
  const [teeth, setTeeth] = useState(
    Array.from({ length: 32 }, (_, i) => ({
      id: i + 1,
      status: "healthy",
    }))
  );

  const [logs, setLogs] = useState([]);

  const handleClick = (id) => {
    if (role !== "dentist") return;

    const updatedTeeth = teeth.map((t) =>
      t.id === id
        ? {
            ...t,
            status:
              t.status === "healthy"
                ? "cavity"
                : t.status === "cavity"
                ? "filled"
                : "healthy",
          }
        : t
    );

    const clickedTooth = teeth.find((t) => t.id === id);

    setLogs([
      {
        toothId: id,
        status: clickedTooth.status,
        time: new Date().toLocaleTimeString(),
      },
      ...logs,
    ]);

    setTeeth(updatedTeeth);
  };

  const healthy = teeth.filter(
    (t) => t.status === "healthy"
  ).length;

  const cavity = teeth.filter(
    (t) => t.status === "cavity"
  ).length;

  const filled = teeth.filter(
    (t) => t.status === "filled"
  ).length;

  const saveData = () => {
    localStorage.setItem("dentalData", JSON.stringify(teeth));
    alert("Data Saved Successfully!");
  };

  return (
    <div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-3xl shadow-xl">
          <h3 className="text-lg font-semibold">
            Healthy Teeth
          </h3>
          <p className="text-4xl font-bold mt-2">
            {healthy}
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white p-6 rounded-3xl shadow-xl">
          <h3 className="text-lg font-semibold">
            Cavities
          </h3>
          <p className="text-4xl font-bold mt-2">
            {cavity}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white p-6 rounded-3xl shadow-xl">
          <h3 className="text-lg font-semibold">
            Filled Teeth
          </h3>
          <p className="text-4xl font-bold mt-2">
            {filled}
          </p>
        </div>

      </div>

      {/* Save Button */}
      <button
        onClick={saveData}
        className="
          bg-gradient-to-r
          from-indigo-500
          to-purple-600
          text-white
          px-8
          py-3
          rounded-2xl
          shadow-lg
          hover:scale-105
          transition-all
          mb-8
        "
      >
        💾 Save Changes
      </button>

      {/* Teeth Grid */}
      <div className="grid grid-cols-8 gap-4 mb-8 justify-items-center">
        {teeth.map((tooth) => (
          <Tooth
            key={tooth.id}
            tooth={tooth}
            onClick={() => handleClick(tooth.id)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-8">

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded"></div>
          <span>Healthy</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-500 rounded"></div>
          <span>Cavity</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded"></div>
          <span>Filled</span>
        </div>

      </div>

      {/* Activity Log */}
      <div className="bg-gray-100 p-5 rounded-2xl shadow">
        <AuditLog logs={logs} />
      </div>

    </div>
  );
}

export default ToothChart;