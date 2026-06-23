import { useState } from "react";
import DentistDashboard from "./DentistDashboard";
import PatientDashboard from "./PatientDashboard";

function Login() {
  const [role, setRole] = useState(null);

  if (role === "dentist") {
    return <DentistDashboard role="dentist" onLogout={() => setRole(null)} />;
  }

  if (role === "patient") {
    return <PatientDashboard onLogout={() => setRole(null)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 text-center">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          🦷 Dental Club
        </h1>

        <p className="mb-6 text-gray-500">
          Choose login type
        </p>

        <button
          onClick={() => setRole("dentist")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl mb-3 shadow-lg transition"
        >
          Login as Dentist
        </button>

        <button
          onClick={() => setRole("patient")}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl shadow-lg transition"
        >
          Login as Patient
        </button>

      </div>
    </div>
  );
}

export default Login;