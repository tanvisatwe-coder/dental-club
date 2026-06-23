import React, { useState } from 'react';
import Login from './pages/Login';
import DentistDashboard from './pages/DentistDashboard';
import PatientDashboard from './pages/PatientDashboard'; // Import the patient portal

function App() {
  // Can be null (logged out), 'dentist', or 'patient'
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <div className="App">
      {userRole === null && <Login onLogin={handleLogin} />}
      {userRole === 'dentist' && <DentistDashboard onLogout={handleLogout} />}
      {userRole === 'patient' && <PatientDashboard onLogout={handleLogout} />}
    </div>
  );
}

export default App;