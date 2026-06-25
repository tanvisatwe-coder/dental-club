import React, { useState } from "react";
import Login from "./pages/Login";
import DentistDashboard from "./pages/DentistDashboard";
import PatientDashboard from "./pages/PatientDashboard";

function App() {
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  return userRole === "dentist" ? (
    <DentistDashboard onLogout={handleLogout} />
  ) : (
    <PatientDashboard onLogout={handleLogout} />
  );
}

export default App;