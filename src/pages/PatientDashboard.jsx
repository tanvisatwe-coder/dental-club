import Sidebar from "../components/Sidebar";

function PatientDashboard({ onLogout }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-6">

        <div className="bg-white p-5 rounded shadow flex justify-between items-center">

          <h1 className="text-2xl font-bold text-green-700">
            Patient Dashboard
          </h1>

          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default PatientDashboard;
